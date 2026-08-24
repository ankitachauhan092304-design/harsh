'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Role, Lead, AdminUser, BlogPost, AuditLog, VisitorAnalytics as IVisitorAnalytics } from '@/types';
import { clientDbService as dbService } from '@/lib/clientDbService';
import AdminLogin from './components/AdminLogin';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import AdminProfile from './components/AdminProfile';
import DashboardOverview from './components/DashboardOverview';
import LeadTable from './components/LeadTable';
import LeadDetailModal from './components/LeadDetailModal';
import BlogManager from './components/BlogManager';
import AuditLogViewer from './components/AuditLogViewer';
import SettingsManager from './components/SettingsManager';
import VisitorAnalytics from './components/VisitorAnalytics';

export default function AdminPage() {
  const [user, setUser] = useState<{ id: string; email: string; name: string; role: Role } | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [globalQuery, setGlobalQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // CRM Data State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [executives, setExecutives] = useState<AdminUser[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [visitorAnalytics, setVisitorAnalytics] = useState<IVisitorAnalytics | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Initial Auth & Data Hydration
  useEffect(() => {
    const savedUser = sessionStorage.getItem('wf_admin_user');
    const lastSessionTime = localStorage.getItem('wf_admin_session_time');

    if (savedUser && lastSessionTime) {
      const elapsed = Date.now() - Number(lastSessionTime);
      if (elapsed > 15 * 60 * 1000) {
        handleLogout();
      } else {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          if (parsed.role === 'CONTENT_MANAGER') setActiveTab('blogs');
        } catch {
          handleLogout();
        }
      }
    }
    setIsCheckingAuth(false);
  }, []);

  // Fetch Data from clientDbService
  const loadCRMData = useCallback(async () => {
    if (!user) return;
    try {
      const fetchedLeads = await dbService.getLeads();
      const fetchedAdmins = await dbService.getAdminUsers();
      const fetchedBlogs = await dbService.getBlogPosts();
      const fetchedLogs = await dbService.getAuditLogs();
      const fetchedSettings = await dbService.getSettings();
      const fetchedAnalytics = await dbService.getVisitorAnalytics();

      setLeads(fetchedLeads);
      setExecutives(fetchedAdmins as AdminUser[]);
      setBlogs(fetchedBlogs as unknown as BlogPost[]);
      setAuditLogs(fetchedLogs);
      setSettings(fetchedSettings);
      setVisitorAnalytics(fetchedAnalytics);
    } catch (err) {
      console.error('Data load error:', err);
    }
  }, [user]);

  const [lastSyncTime, setLastSyncTime] = useState<string>('Just Now');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [newLeadBanner, setNewLeadBanner] = useState<string | null>(null);

  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadCRMData();
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setTimeout(() => setIsRefreshing(false), 400);
  }, [loadCRMData]);

  // Initial Load & Real-time Live Polling Every 5 Seconds
  useEffect(() => {
    if (!user) return;
    
    // Initial fetch
    loadCRMData();
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    // 5-second polling interval
    const interval = setInterval(async () => {
      try {
        const freshLeads = await dbService.getLeads();
        setLeads((prev) => {
          if (freshLeads.length > prev.length && prev.length > 0) {
            const newest = freshLeads[0];
            setNewLeadBanner(`🎉 Real-Time Alert: New Enquiry Received from ${newest.name} (${newest.phone}) for ₹${newest.loanAmount.toLocaleString('en-IN')}`);
            setTimeout(() => setNewLeadBanner(null), 8000);
          }
          return freshLeads;
        });
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.warn('Real-time sync notice:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, loadCRMData]);

  // Update Activity Timestamp on User Action
  const updateSessionActivity = useCallback(() => {
    if (user) {
      localStorage.setItem('wf_admin_session_time', Date.now().toString());
    }
  }, [user]);

  useEffect(() => {
    window.addEventListener('mousemove', updateSessionActivity);
    window.addEventListener('keydown', updateSessionActivity);
    return () => {
      window.removeEventListener('mousemove', updateSessionActivity);
      window.removeEventListener('keydown', updateSessionActivity);
    };
  }, [updateSessionActivity]);

  const handleLogout = () => {
    sessionStorage.removeItem('wf_admin_user');
    localStorage.removeItem('wf_admin_session_time');
    setUser(null);
    setActiveTab('dashboard');
  };

  // CRUD Actions
  const handleUpdateStatus = async (leadId: string, status: string) => {
    if (!user) return;
    await dbService.updateLead(leadId, { status }, user.name);
    await dbService.createAuditLog(user.name, 'STATUS_UPDATE', `Updated lead ${leadId} status to ${status}`, user.id);
    await loadCRMData();
    if (selectedLead && selectedLead.id === leadId) {
      const updated = await dbService.getLeadById(leadId);
      if (updated) setSelectedLead(updated);
    }
  };

  const handleAssignExecutive = async (leadId: string, executiveId: string | null) => {
    if (!user) return;
    const exec = executives.find((e) => e.id === executiveId);
    await dbService.updateLead(leadId, { assignedToId: executiveId, assignedTo: exec || null }, user.name);
    await dbService.createAuditLog(
      user.name,
      'LEAD_ASSIGN',
      `Assigned lead ${leadId} to ${exec ? exec.name : 'Unassigned'}`,
      user.id
    );
    await loadCRMData();
  };

  const handleAddNote = async (leadId: string, content: string) => {
    if (!user) return;
    await dbService.addLeadNote(leadId, user.name, content);
    await loadCRMData();
    if (selectedLead && selectedLead.id === leadId) {
      const updated = await dbService.getLeadById(leadId);
      if (updated) setSelectedLead(updated);
    }
  };

  const handleUpdateReminder = async (leadId: string, dateIso: string) => {
    if (!user) return;
    await dbService.updateLead(leadId, { nextFollowupDate: dateIso, reminderDate: dateIso }, user.name);
    await loadCRMData();
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!user) return;
    await dbService.softDeleteLead(leadId, user.name);
    await loadCRMData();
    if (selectedLead && selectedLead.id === leadId) setSelectedLead(null);
  };

  const handleImportLeads = async (importedLeads: Partial<Lead>[]) => {
    if (!user) return;
    for (const leadData of importedLeads) {
      await dbService.createLead(leadData);
    }
    await dbService.createAuditLog(user.name, 'CSV_IMPORT', `Imported ${importedLeads.length} leads via CSV`, user.id);
    await loadCRMData();
    alert(`Successfully imported ${importedLeads.length} leads!`);
  };

  const handleCreateBlog = async (blogData: Partial<BlogPost>) => {
    if (!user) return;
    await dbService.createBlogPost(blogData);
    await dbService.createAuditLog(user.name, 'BLOG_CREATE', `Created blog "${blogData.title}"`, user.id);
    await loadCRMData();
  };

  const handleUpdateBlog = async (id: string, blogData: Partial<BlogPost>) => {
    if (!user) return;
    await dbService.updateBlogPost(id, blogData);
    await dbService.createAuditLog(user.name, 'BLOG_UPDATE', `Updated blog "${blogData.title}"`, user.id);
    await loadCRMData();
  };

  const handleDeleteBlog = async (id: string) => {
    if (!user) return;
    await dbService.deleteBlogPost(id);
    await dbService.createAuditLog(user.name, 'BLOG_DELETE', `Deleted blog ID ${id}`, user.id);
    await loadCRMData();
  };

  const handleSaveSetting = async (key: string, value: string) => {
    if (!user) return;
    await dbService.updateSetting(key, value);
    await dbService.createAuditLog(user.name, 'SETTING_UPDATE', `Updated setting ${key}`, user.id);
    await loadCRMData();
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-[#0B4F9C] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar
        userRole={user.role}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          user={user}
          globalQuery={globalQuery}
          onSearchChange={(q) => setGlobalQuery(q)}
          onLogout={handleLogout}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onSelectTab={(tab) => setActiveTab(tab)}
          lastSyncTime={lastSyncTime}
          isRefreshing={isRefreshing}
          onManualRefresh={handleManualRefresh}
        />

        {newLeadBanner && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 shadow-md flex items-center justify-between text-xs font-bold animate-in slide-in-from-top duration-300">
            <span>{newLeadBanner}</span>
            <button onClick={() => setNewLeadBanner(null)} className="text-white/80 hover:text-white font-bold ml-4">✕</button>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              leads={leads}
              userRole={user.role}
              onSelectLead={(l) => setSelectedLead(l)}
              onFilterByStatus={(s) => {
                setActiveTab('leads');
              }}
            />
          )}

          {(activeTab === 'leads' || activeTab === 'pipeline' || activeTab === 'followups') && (
            <LeadTable
              leads={leads}
              executives={executives}
              userRole={user.role}
              globalQuery={globalQuery}
              onSelectLead={(l) => setSelectedLead(l)}
              onUpdateStatus={handleUpdateStatus}
              onAssignExecutive={handleAssignExecutive}
              onDeleteLead={handleDeleteLead}
              onImportLeads={handleImportLeads}
            />
          )}

          {activeTab === 'blogs' && (
            <BlogManager
              blogs={blogs}
              userRole={user.role}
              authorName={user.name}
              onCreateBlog={handleCreateBlog}
              onUpdateBlog={handleUpdateBlog}
              onDeleteBlog={handleDeleteBlog}
            />
          )}

          {activeTab === 'analytics' && (
            <VisitorAnalytics
              analytics={visitorAnalytics}
              onRefresh={handleManualRefresh}
              isRefreshing={isRefreshing}
            />
          )}

          {activeTab === 'audit' && <AuditLogViewer auditLogs={auditLogs} />}

          {activeTab === 'settings' && (
            <SettingsManager
              settings={settings}
              userRole={user.role}
              onSaveSetting={handleSaveSetting}
            />
          )}

          {activeTab === 'profile' && <AdminProfile user={user} />}
        </main>
      </div>

      {/* Selected Lead Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          userRole={user.role}
          authorName={user.name}
          onUpdateStatus={handleUpdateStatus}
          onAddNote={handleAddNote}
          onUpdateReminder={handleUpdateReminder}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
