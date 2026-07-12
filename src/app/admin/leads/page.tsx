'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Search, Download, Edit, Phone, Mail, MessageSquare } from 'lucide-react';
import { Lead, LeadNote } from '@/types';
import { buildFollowUpMessage, buildWhatsAppUrl, DEFAULT_WA_NUMBER } from '@/lib/whatsapp';

export default function AdminLeads() {
  useAdminAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [productFilter, setProductFilter] = useState('ALL');

  // Selected lead for inspection drawer
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNotes, setLeadNotes] = useState<LeadNote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [updatingLead, setUpdatingLead] = useState(false);

  // Form edit details
  const [editStatus, setEditStatus] = useState('NEW');
  const [editPriority, setEditPriority] = useState('MEDIUM');
  const [editRemarks, setEditRemarks] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');

  // Fetch leads on load
  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch leads.');
      }

      setLeads(data.leads);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to initialize CRM Leads.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Fetch single lead details (notes & status history)
  const inspectLead = async (lead: Lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditPriority(lead.priority);
    setEditRemarks(lead.remarks || '');
    setEditAssignedTo(lead.assignedToId || '');
    setLeadNotes(lead.notes || []);

    try {
      const res = await fetch(`/api/admin/leads?id=${lead.id}`);
      const data = await res.json();
      if (res.ok && data.lead) {
        setLeadNotes(data.lead.notes || []);
        setSelectedLead(data.lead);
      }
    } catch (err: unknown) {
      console.error('Failed to load lead details:', err);
    }
  };

  // Update lead parameters (status, priority, remarks, assignment)
  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    setUpdatingLead(true);

    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLead.id,
          status: editStatus,
          priority: editPriority,
          remarks: editRemarks,
          assignedToId: editAssignedTo || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update lead.');
      }

      // Refresh list
      await fetchLeads();
      
      // Update selected lead inspect
      const refreshedLead = data.lead;
      setSelectedLead(refreshedLead);
      if (refreshedLead.notes) setLeadNotes(refreshedLead.notes);
      
      alert('Lead parameters updated successfully.');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to update lead.';
      alert(errMsg);
    } finally {
      setUpdatingLead(false);
    }
  };

  // Add a note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteContent.trim()) return;

    try {
      const resNote = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLead.id,
          newNote: newNoteContent,
        }),
      });

      const data = await resNote.json();
      if (!resNote.ok) throw new Error(data.error || 'Failed to add note.');

      // Refresh list & local notes
      await fetchLeads();
      const refreshedLead = data.lead;
      setSelectedLead(refreshedLead);
      if (refreshedLead.notes) setLeadNotes(refreshedLead.notes);
      setNewNoteContent('');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to append note.';
      alert(errMsg);
    }
  };

  // Filter logic
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.leadNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    
    const prodCode = productFilter === 'ALL' ? 'ALL' : `${productFilter}_KEY`;
    const matchesProduct = productFilter === 'ALL' || lead.loanType === prodCode || lead.loanType === productFilter;

    return matchesSearch && matchesStatus && matchesProduct;
  });

  // Export search results to CSV
  const exportToCsv = () => {
    const headers = ['Lead Number', 'Lead ID', 'Name', 'Phone', 'Email', 'City', 'Employment', 'Monthly Income', 'Loan Product', 'Loan Amount', 'Status', 'Priority', 'WA Clicked', 'Source', 'Remarks', 'Created At'];
    const rows = filteredLeads.map((l) => [
      l.leadNumber || '',
      l.id,
      l.name,
      l.phone,
      l.email,
      l.city,
      l.employmentType,
      l.monthlyIncome,
      l.loanType,
      l.loanAmount,
      l.status,
      l.priority,
      l.whatsappClicked ? 'Yes' : 'No',
      l.source || '',
      (l.remarks || '').replace(/,/g, ';'),
      l.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Whitestone_CRM_Leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 font-inter animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-48 bg-slate-200 rounded-lg" />
            <div className="h-3 w-64 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-10 w-28 bg-slate-200 rounded-xl" />
        </div>
        {/* Table Skeleton */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col gap-4">
          <div className="h-8 w-full bg-slate-50 rounded-lg" />
          <div className="h-12 w-full bg-slate-100/60 rounded-xl animate-pulse" />
          <div className="h-12 w-full bg-slate-50/60 rounded-xl animate-pulse" />
          <div className="h-12 w-full bg-slate-100/60 rounded-xl animate-pulse" />
          <div className="h-12 w-full bg-slate-50/60 rounded-xl animate-pulse" />
          <div className="h-12 w-full bg-slate-100/60 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-inter relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 font-poppins">Leads CRM Management</h1>
          <span className="text-xs text-slate-400 font-semibold mt-1">Review, assign, and update loan pipeline entries</span>
        </div>
        <button
          onClick={exportToCsv}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#00A86B] hover:bg-[#008f5a] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
        >
          <Download size={14} />
          Export to CSV
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs font-bold">
          {error}
        </div>
      )}

      {/* CRM Search & Filters bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-xs">
        {/* Search */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, phone..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0B4F9C] focus:bg-white outline-none rounded-xl text-xs font-semibold transition-all"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-[#0B4F9C] cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        {/* Product Filter */}
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-[#0B4F9C] cursor-pointer"
        >
          <option value="ALL">All Loan Products</option>
          <option value="PERSONAL">Personal Loan</option>
          <option value="BUSINESS">Business Loan</option>
          <option value="HOME">Home Loan</option>
          <option value="LAP">Loan Against Property</option>
          <option value="PROJECT_LOAN">Project Loan</option>
          <option value="TOP_UP_LOAN">Top-up Loan</option>
          <option value="CREDIT_CARD">Credit Card</option>
        </select>
      </div>

      {/* Leads Table Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-inter font-semibold text-slate-600">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-6 rounded-l-2xl">Lead #</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Phone / Email</th>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Loan Amt</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Priority</th>
                <th className="py-4 px-6 rounded-r-2xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[10px] font-bold text-[#0B4F9C] bg-blue-50 px-1.5 py-0.5 rounded">{lead.leadNumber || '—'}</span>
                      {lead.whatsappClicked && (
                        <span className="text-[9px] font-bold text-[#25D366] flex items-center gap-0.5">
                          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          WA Contacted
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-800">
                    <div className="flex flex-col">
                      <span>{lead.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{lead.city}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-dmsans text-slate-500">
                    <div className="flex flex-col gap-0.5">
                      <span>{lead.phone}</span>
                      <span className="text-[10px] font-semibold text-slate-400 select-all">{lead.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[9px]">
                      {lead.loanType.replace('_KEY', '').replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-dmsans font-bold text-slate-800">
                    ₹{lead.loanAmount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                      lead.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                      lead.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' :
                      lead.status === 'IN_PROGRESS' ? 'bg-indigo-50 text-indigo-700' :
                      lead.status === 'CONTACTED' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] ${
                      lead.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                      lead.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-50 text-slate-500'
                    }`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => inspectLead(lead)}
                      className="p-2 rounded-lg border border-slate-200 hover:border-[#0B4F9C] hover:bg-blue-50/10 text-slate-500 hover:text-[#0B4F9C] transition-colors cursor-pointer"
                    >
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                    No leads match search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Lead Drawer Overlay */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end font-inter bg-slate-900/40 backdrop-blur-xs">
          {/* Drawer Panel */}
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-none">Inspect Dossier</span>
                <h3 className="text-base font-bold text-slate-800 font-poppins mt-1.5">{selectedLead.name}</h3>
                {selectedLead.leadNumber && (
                  <span className="font-mono text-[10px] text-[#0B4F9C] font-bold mt-0.5">{selectedLead.leadNumber}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Quick Action Buttons */}
                <a
                  href={`tel:+91${selectedLead.phone}`}
                  className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                  title={`Call ${selectedLead.phone}`}
                >
                  <Phone size={14} />
                </a>
                <button
                  onClick={() => {
                    const msg = buildFollowUpMessage({
                      customerName: selectedLead.name,
                      leadNumber: selectedLead.leadNumber || selectedLead.id,
                      executiveName: 'Whitestone Fincorp Team',
                    });
                    // Track click in CRM
                    fetch(`/api/leads/${selectedLead.id}/whatsapp`, { method: 'POST' }).catch(() => {});
                    window.open(buildWhatsAppUrl(msg, DEFAULT_WA_NUMBER), '_blank', 'noopener,noreferrer');
                  }}
                  className="p-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-colors cursor-pointer"
                  title="Send WhatsApp Follow-up"
                >
                  <MessageSquare size={14} />
                </button>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-[#0B4F9C] hover:bg-blue-100 transition-colors cursor-pointer"
                  title={`Email ${selectedLead.email}`}
                >
                  <Mail size={14} />
                </a>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-6 no-scrollbar">
              {/* Core Parameters */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-[#00A86B]" />
                  <span>{selectedLead.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="text-[#0B4F9C] shrink-0" />
                  <span className="truncate select-all">{selectedLead.email}</span>
                </div>
                <div>
                  <span className="text-slate-400">Monthly Income:</span>
                  <span className="font-bold text-slate-800 font-dmsans block mt-0.5">₹{selectedLead.monthlyIncome.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400">City / Emp:</span>
                  <span className="font-bold text-slate-800 block mt-0.5">{selectedLead.city} / {selectedLead.employmentType}</span>
                </div>
              </div>

              {/* CRM Parameter Actions */}
              <form onSubmit={handleUpdateLead} className="flex flex-col gap-4 pb-6 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 font-poppins uppercase tracking-wider pb-1.5 border-b border-slate-50">Lead Actions</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Status selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Operational Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#0B4F9C] cursor-pointer"
                    >
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  {/* Priority selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Lead Priority</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#0B4F9C] cursor-pointer"
                    >
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Assignment */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Assign Loan Executive</label>
                    <select
                      value={editAssignedTo}
                      onChange={(e) => setEditAssignedTo(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#0B4F9C] cursor-pointer"
                    >
                      <option value="">Unassigned</option>
                      <option value="u2">Rohan Gupta (Admin)</option>
                      <option value="u3">Ananya Sen (Loan Executive)</option>
                    </select>
                  </div>

                  {/* Remarks input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Remarks / Executive Summary</label>
                    <textarea
                      value={editRemarks}
                      onChange={(e) => setEditRemarks(e.target.value)}
                      rows={2}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#0B4F9C] resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingLead}
                  className="py-2.5 bg-[#0B4F9C] hover:bg-[#083c78] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {updatingLead ? 'Updating dossier parameters...' : 'Update Lead Parameters'}
                </button>
              </form>

              {/* Notes & Activity timeline */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-slate-800 font-poppins uppercase tracking-wider pb-1.5 border-b border-slate-50">Notes & Logs History</h4>
                
                {/* Add a note form */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Type executive note to log..."
                    className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Log Note
                  </button>
                </form>

                {/* Notes list */}
                <div className="flex flex-col gap-3 mt-2">
                  {leadNotes.map((note) => (
                    <div key={note.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1 text-[11px]">
                      <div className="flex justify-between font-bold text-slate-400">
                        <span className="text-[#0B4F9C]">{note.authorName}</span>
                        <span className="font-dmsans">{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600 font-semibold mt-1 leading-relaxed">{note.content}</p>
                    </div>
                  ))}
                  {leadNotes.length === 0 && (
                    <span className="text-center text-slate-400 text-[11px] font-semibold py-4">No notes logged yet.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
