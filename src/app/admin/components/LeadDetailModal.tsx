'use client';

import React, { useState } from 'react';
import {
  X, Phone, Mail, MapPin, IndianRupee, User,
  Calendar, Clock, Send, CheckCircle2, ShieldAlert,
  GitBranch, FileText, Tag, Globe, Laptop, MessageSquare,
} from 'lucide-react';
import { Lead, Role } from '@/types';

interface LeadDetailModalProps {
  lead: Lead;
  userRole: Role;
  authorName: string;
  onUpdateStatus: (leadId: string, newStatus: string) => void;
  onAddNote: (leadId: string, noteContent: string) => void;
  onUpdateReminder: (leadId: string, dateIso: string) => void;
  onClose: () => void;
}

const PIPELINE_STAGES = [
  'NEW',
  'CONTACTED',
  'DOCUMENTS_RECEIVED',
  'BANK_ASSIGNED',
  'UNDER_PROCESS',
  'APPROVED',
  'DISBURSED',
  'REJECTED',
];

export default function LeadDetailModal({
  lead,
  userRole,
  authorName,
  onUpdateStatus,
  onAddNote,
  onUpdateReminder,
  onClose,
}: LeadDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'PIPELINE' | 'NOTES' | 'TIMELINE'>('DETAILS');
  const [newNoteText, setNewNoteText] = useState('');
  const [reminderDate, setReminderDate] = useState(
    lead.nextFollowupDate ? new Date(lead.nextFollowupDate).toISOString().slice(0, 16) : ''
  );

  const canEdit = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || userRole === 'LOAN_EXECUTIVE';

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(lead.id, newNoteText.trim());
    setNewNoteText('');
  };

  const handleSaveReminder = () => {
    if (!reminderDate) return;
    onUpdateReminder(lead.id, new Date(reminderDate).toISOString());
    alert('Follow-up reminder scheduled!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl border border-slate-200 shadow-2xl relative flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B4F9C] to-[#6366f1] text-white font-black text-lg flex items-center justify-center shadow-md">
              {lead.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800 font-poppins">{lead.name}</h2>
                <span className="font-mono text-xs font-bold text-[#0B4F9C] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                  #{lead.leadNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {lead.phone} · {lead.city} · {lead.loanType} (₹{(lead.loanAmount / 100000).toFixed(1)}L)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200">
            <X size={20} />
          </button>
        </div>

        {/* Modal Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('DETAILS')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'DETAILS' ? 'border-[#0B4F9C] text-[#0B4F9C]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Customer & Loan Info
          </button>
          <button
            onClick={() => setActiveTab('PIPELINE')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'PIPELINE' ? 'border-[#0B4F9C] text-[#0B4F9C]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Lead Pipeline
          </button>
          <button
            onClick={() => setActiveTab('NOTES')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'NOTES' ? 'border-[#0B4F9C] text-[#0B4F9C]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Internal Notes ({lead.notes?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'TIMELINE' ? 'border-[#0B4F9C] text-[#0B4F9C]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Activity Timeline
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* TAB 1: DETAILS */}
          {activeTab === 'DETAILS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info Box */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User size={14} /> Customer Profile
                </h4>
                <div className="grid gap-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">Full Name</span>
                    <span className="font-bold text-slate-800">{lead.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">Mobile Number</span>
                    <span className="font-bold text-slate-800">{lead.phone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">Email Address</span>
                    <span className="font-bold text-slate-800">{lead.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">City / Location</span>
                    <span className="font-bold text-slate-800">{lead.city}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">Employment Type</span>
                    <span className="font-bold text-slate-800">{lead.employmentType}</span>
                  </div>
                </div>
              </div>

              {/* Loan Info Box */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <IndianRupee size={14} /> Loan Request Details
                </h4>
                <div className="grid gap-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">Loan Category</span>
                    <span className="font-bold text-slate-800">{lead.loanType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">Required Amount</span>
                    <span className="font-bold text-[#0B4F9C] text-sm">₹{Number(lead.loanAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">Status</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">{lead.status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">Assigned Executive</span>
                    <span className="font-bold text-slate-800">{lead.assignedTo?.name || 'Unassigned'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">Lead Source</span>
                    <span className="font-bold text-slate-800">{lead.source}</span>
                  </div>
                </div>
              </div>

              {/* UTM & Traffic Metadata Box */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Globe size={14} /> Campaign & Traffic Source
                </h4>
                <div className="grid gap-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">UTM Source</span>
                    <span className="font-mono text-slate-800">{lead.utmSource || 'direct'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">UTM Medium</span>
                    <span className="font-mono text-slate-800">{lead.utmMedium || 'none'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">Landing Page</span>
                    <span className="font-mono text-slate-800 truncate max-w-[180px]">{lead.landingPage || '/'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold">IP Address</span>
                    <span className="font-mono text-slate-800">{lead.ipAddress || '103.21.125.4'}</span>
                  </div>
                </div>
              </div>

              {/* Follow-up Reminder Schedule Box */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar size={14} /> Schedule Follow-up Reminder
                </h4>
                <div className="flex flex-col gap-2">
                  <input
                    type="datetime-local"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    disabled={!canEdit}
                    className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0B4F9C]"
                  />
                  {canEdit && (
                    <button
                      type="button"
                      onClick={handleSaveReminder}
                      className="py-2.5 bg-[#0B4F9C] hover:bg-[#083c78] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Save Follow-up Date
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PIPELINE */}
          {activeTab === 'PIPELINE' && (
            <div className="flex flex-col gap-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GitBranch size={16} className="text-[#0B4F9C]" /> Lead Status Pipeline
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PIPELINE_STAGES.map((stage) => {
                  const isCurrent = lead.status === stage;
                  return (
                    <button
                      key={stage}
                      disabled={!canEdit}
                      onClick={() => onUpdateStatus(lead.id, stage)}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#0B4F9C] border-[#0B4F9C] text-white shadow-md'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase opacity-75">{stage.replace(/_/g, ' ')}</span>
                      <span className="text-xs font-black">{isCurrent ? 'Current Stage ✓' : 'Move to Stage'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: NOTES */}
          {activeTab === 'NOTES' && (
            <div className="flex flex-col gap-6">
              {canEdit && (
                <form onSubmit={handleNoteSubmit} className="flex flex-col gap-3">
                  <textarea
                    rows={3}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add an internal note or team updates..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:border-[#0B4F9C] focus:bg-white resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#0B4F9C] hover:bg-[#083c78] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <Send size={14} /> Add Note
                    </button>
                  </div>
                </form>
              )}

              <div className="flex flex-col gap-3">
                {lead.notes && lead.notes.length > 0 ? (
                  lead.notes.map((n) => (
                    <div key={n.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">{n.authorName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{new Date(n.createdAt).toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">{n.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-8">No notes added yet.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE */}
          {activeTab === 'TIMELINE' && (
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock size={16} className="text-[#0B4F9C]" /> Chronological Activity History
              </h4>

              <div className="relative pl-6 border-l-2 border-slate-200 flex flex-col gap-6 my-2">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                  <p className="text-xs font-bold text-slate-800">Lead Created & Ingested</p>
                  <p className="text-[10px] text-slate-400">{new Date(lead.createdAt).toLocaleString('en-IN')}</p>
                </div>

                {lead.whatsappClicked && (
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#25D366] border-2 border-white" />
                    <p className="text-xs font-bold text-slate-800">WhatsApp Chat Initiated by Customer</p>
                    <p className="text-[10px] text-slate-400">{lead.whatsappClickedAt ? new Date(lead.whatsappClickedAt).toLocaleString('en-IN') : 'Completed'}</p>
                  </div>
                )}

                {lead.statusHistory && lead.statusHistory.map((sh) => (
                  <div key={sh.id} className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
                    <p className="text-xs font-bold text-slate-800">Status Changed: {sh.oldStatus} ➔ {sh.newStatus}</p>
                    <p className="text-[10px] text-slate-400">{sh.changedBy} · {new Date(sh.changedAt).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
