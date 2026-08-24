'use client';

import React from 'react';
import {
  LayoutDashboard, Users, GitBranch, Calendar,
  FileText, Shield, Settings, User, LogOut,
  Building2, ChevronRight, X, Sparkles, Eye,
} from 'lucide-react';
import { Role } from '@/types';

interface AdminSidebarProps {
  userRole: Role;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  userRole,
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  
  // RBAC Permission Nav Rules
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['SUPER_ADMIN', 'ADMIN', 'LOAN_EXECUTIVE', 'VIEWER'],
    },
    {
      id: 'leads',
      label: 'Lead Management',
      icon: Users,
      roles: ['SUPER_ADMIN', 'ADMIN', 'LOAN_EXECUTIVE', 'VIEWER'],
    },
    {
      id: 'analytics',
      label: 'Visitor Analytics',
      icon: Eye,
      roles: ['SUPER_ADMIN', 'ADMIN', 'VIEWER'],
    },
    {
      id: 'pipeline',
      label: 'Lead Pipeline',
      icon: GitBranch,
      roles: ['SUPER_ADMIN', 'ADMIN', 'LOAN_EXECUTIVE'],
    },
    {
      id: 'followups',
      label: 'Follow-ups & Queue',
      icon: Calendar,
      roles: ['SUPER_ADMIN', 'ADMIN', 'LOAN_EXECUTIVE'],
    },
    {
      id: 'blogs',
      label: 'Blog CMS',
      icon: FileText,
      roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'],
    },
    {
      id: 'audit',
      label: 'Audit Logs',
      icon: Shield,
      roles: ['SUPER_ADMIN', 'ADMIN'],
    },
    {
      id: 'settings',
      label: 'Web Settings',
      icon: Settings,
      roles: ['SUPER_ADMIN', 'ADMIN'],
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      roles: ['SUPER_ADMIN', 'ADMIN', 'LOAN_EXECUTIVE', 'CONTENT_MANAGER', 'VIEWER'],
    },
  ];

  const allowedNav = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-white z-40 flex flex-col border-r border-slate-800 transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-slate-800 px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B4F9C] via-[#1a5fb4] to-[#00A86B] flex items-center justify-center shadow-md">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-poppins">Whitestone</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Enterprise CRM</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white md:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Main Menu</p>
          {allowedNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0B4F9C] to-[#1a5fb4] text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-white/70" />}
              </button>
            );
          })}
        </div>

        {/* Bottom Trust Badge & Logout */}
        <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center gap-2.5">
            <Sparkles size={14} className="text-emerald-400 shrink-0" />
            <div className="text-[10px] text-slate-400 font-medium leading-tight">
              Role: <strong className="text-white font-mono">{userRole}</strong>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
