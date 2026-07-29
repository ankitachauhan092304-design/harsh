'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Download, Upload, Phone, MessageSquare,
  Copy, CheckCircle, ChevronLeft, ChevronRight, Eye, UserCheck,
  Building2, MapPin, IndianRupee, Trash2, ShieldAlert, Sparkles, Plus,
} from 'lucide-react';
import { Lead, Role, AdminUser } from '@/types';
import ExecutiveAssignModal from './ExecutiveAssignModal';
import DuplicateCheckModal from './DuplicateCheckModal';
import CsvImportModal from './CsvImportModal';

interface LeadTableProps {
  leads: Lead[];
  executives: AdminUser[];
  userRole: Role;
  globalQuery: string;
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, status: string) => void;
  onAssignExecutive: (leadId: string, executiveId: string | null) => void;
  onDeleteLead: (leadId: string) => void;
  onImportLeads: (leads: Partial<Lead>[]) => void;
}

export default function LeadTable({
  leads,
  executives,
  userRole,
  globalQuery,
  onSelectLead,
  onUpdateStatus,
  onAssignExecutive,
  onDeleteLead,
  onImportLeads,
}: LeadTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loanTypeFilter, setLoanTypeFilter] = useState('ALL');
  const [execFilter, setExecFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [assigningLead, setAssigningLead] = useState<Lead | null>(null);
  const [duplicateLead, setDuplicateLead] = useState<Lead | null>(null);
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const canEdit = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || userRole === 'LOAN_EXECUTIVE';

  // Filter & Search Engine
  const filteredLeads = useMemo(() => {
    const query = (globalQuery || searchQuery).trim().toLowerCase();
    return leads.filter((lead) => {
      // Search match across Lead Number, Name, Phone, Email, City, Loan Type, Tags
      const matchesSearch =
        !query ||
        lead.leadNumber.toLowerCase().includes(query) ||
        lead.name.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        (lead.email && lead.email.toLowerCase().includes(query)) ||
        lead.city.toLowerCase().includes(query) ||
        lead.loanType.toLowerCase().includes(query) ||
        (lead.tags && lead.tags.toLowerCase().includes(query));

      const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
      const matchesLoanType = loanTypeFilter === 'ALL' || lead.loanType === loanTypeFilter;
      const matchesExec =
        execFilter === 'ALL'
          ? true
          : execFilter === 'UNASSIGNED'
          ? !lead.assignedToId
          : lead.assignedToId === execFilter;

      return matchesSearch && matchesStatus && matchesLoanType && matchesExec;
    });
  }, [leads, globalQuery, searchQuery, statusFilter, loanTypeFilter, execFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / itemsPerPage));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, currentPage]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Export to CSV with formula injection sanitization
  const exportToCSV = () => {
    const sanitizeCSV = (val: any) => {
      let str = String(val || '').replace(/"/g, '""');
      if (['=', '+', '-', '@'].includes(str.charAt(0))) {
        str = "'" + str;
      }
      return `"${str}"`;
    };

    const headers = ['Lead Number', 'Name', 'Phone', 'Email', 'City', 'Loan Type', 'Amount (INR)', 'Status', 'Assigned Executive', 'Created At'];
    const rows = filteredLeads.map((l) => [
      sanitizeCSV(l.leadNumber),
      sanitizeCSV(l.name),
      sanitizeCSV(l.phone),
      sanitizeCSV(l.email || ''),
      sanitizeCSV(l.city),
      sanitizeCSV(l.loanType),
      sanitizeCSV(l.loanAmount),
      sanitizeCSV(l.status),
      sanitizeCSV(l.assignedTo?.name || 'Unassigned'),
      sanitizeCSV(new Date(l.createdAt).toLocaleDateString('en-IN')),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Whitestone_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportToJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLeads, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `Whitestone_Leads_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Lead #, Name, Phone, City..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#0B4F9C]"
          />
        </div>

        {/* Filters & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Loan Category Filter */}
          <select
            value={loanTypeFilter}
            onChange={(e) => setLoanTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="PERSONAL">Personal Loan</option>
            <option value="BUSINESS">Business Loan</option>
            <option value="HOME">Home Loan</option>
            <option value="LAP">Loan Against Property</option>
          </select>

          {/* Executive Filter */}
          <select
            value={execFilter}
            onChange={(e) => setExecFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Executives</option>
            <option value="UNASSIGNED">Unassigned Queue</option>
            {executives.map((exec) => (
              <option key={exec.id} value={exec.id}>{exec.name}</option>
            ))}
          </select>

          {/* Actions */}
          <button
            onClick={() => setShowCsvImport(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Upload size={14} /> Import CSV
          </button>
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 rounded-xl bg-[#0B4F9C] hover:bg-[#083c78] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={exportToJSON}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <Download size={14} /> Backup JSON
          </button>
        </div>
      </div>

      {/* CRM Lead Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Lead #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">City</th>
                <th className="p-4">Loan Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Executive</th>
                <th className="p-4">Created</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold">
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Lead Ref Number */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#0B4F9C] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                          #{lead.leadNumber}
                        </span>
                        <button
                          onClick={() => handleCopy(lead.leadNumber, `ref-${lead.id}`)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {copiedId === `ref-${lead.id}` ? <CheckCircle size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>

                    {/* Customer Name */}
                    <td className="p-4 font-bold text-slate-800">
                      <button onClick={() => onSelectLead(lead)} className="hover:underline hover:text-[#0B4F9C] text-left cursor-pointer">
                        {lead.name}
                      </button>
                    </td>

                    {/* Mobile & Quick Copy */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span>{lead.phone}</span>
                        <button
                          onClick={() => handleCopy(lead.phone, `phone-${lead.id}`)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {copiedId === `phone-${lead.id}` ? <CheckCircle size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>

                    {/* City */}
                    <td className="p-4 text-slate-600">{lead.city}</td>

                    {/* Loan Type */}
                    <td className="p-4 font-bold text-slate-700">{lead.loanType}</td>

                    {/* Amount */}
                    <td className="p-4 font-mono font-bold text-[#0B4F9C]">
                      ₹{Number(lead.loanAmount).toLocaleString('en-IN')}
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4">
                      <select
                        value={lead.status}
                        disabled={!canEdit}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border outline-none cursor-pointer ${
                          lead.status === 'APPROVED' || lead.status === 'DISBURSED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : lead.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : lead.status === 'IN_PROGRESS'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-blue-50 text-[#0B4F9C] border-blue-200'
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>

                    {/* Assigned Executive */}
                    <td className="p-4">
                      <button
                        onClick={() => canEdit && setAssigningLead(lead)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                          lead.assignedTo
                            ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                        }`}
                      >
                        {lead.assignedTo?.name || 'Assign +'}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-[10px] text-slate-400 font-medium">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                    </td>

                    {/* Quick Action Buttons */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* One-click WhatsApp */}
                        <a
                          href={`https://wa.me/91${lead.phone}?text=Hello%20${encodeURIComponent(lead.name)},%20regarding%20your%20${encodeURIComponent(lead.loanType)}%20enquiry%20%23${lead.leadNumber}%20with%20Whitestone%20Fincorp.`}
                          target="_blank"
                          rel="noreferrer"
                          title="Message on WhatsApp"
                          className="p-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-colors"
                        >
                          <MessageSquare size={14} />
                        </a>

                        {/* One-click Direct Call */}
                        <a
                          href={`tel:+91${lead.phone}`}
                          title="Call Customer"
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0B4F9C] transition-colors"
                        >
                          <Phone size={14} />
                        </a>

                        {/* View Modal */}
                        <button
                          onClick={() => onSelectLead(lead)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>

                        {/* Soft Delete */}
                        {userRole === 'SUPER_ADMIN' && (
                          <button
                            onClick={() => {
                              if (confirm(`Soft delete lead #${lead.leadNumber}?`)) onDeleteLead(lead.id);
                            }}
                            title="Soft Delete"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-xs font-semibold text-slate-400">
                    No leads found matching current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Showing {paginatedLeads.length} of {filteredLeads.length} leads</span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {assigningLead && (
        <ExecutiveAssignModal
          lead={assigningLead}
          executives={executives}
          onAssign={onAssignExecutive}
          onClose={() => setAssigningLead(null)}
        />
      )}

      {showCsvImport && (
        <CsvImportModal
          onImportLeads={onImportLeads}
          onClose={() => setShowCsvImport(false)}
        />
      )}
    </div>
  );
}
