'use client';

import React, { useState } from 'react';
import { UserCheck, X, Shield, CheckCircle } from 'lucide-react';
import { Lead, AdminUser } from '@/types';

interface ExecutiveAssignModalProps {
  lead: Lead;
  executives: AdminUser[];
  onAssign: (leadId: string, executiveId: string | null) => void;
  onClose: () => void;
}

export default function ExecutiveAssignModal({
  lead,
  executives,
  onAssign,
  onClose,
}: ExecutiveAssignModalProps) {
  const [selectedExecId, setSelectedExecId] = useState<string>(lead.assignedToId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(lead.id, selectedExecId || null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B4F9C] flex items-center justify-center">
            <UserCheck size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 font-poppins">Assign Executive</h3>
            <p className="text-xs text-slate-500 font-mono">Lead #{lead.leadNumber}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1">
            <p className="text-xs font-bold text-slate-800">{lead.name}</p>
            <p className="text-[10px] text-slate-500">{lead.phone} · {lead.city} · {lead.loanType}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Select Executive</label>
            <select
              value={selectedExecId}
              onChange={(e) => setSelectedExecId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0B4F9C]"
            >
              <option value="">-- Unassigned --</option>
              {executives.map((exec) => (
                <option key={exec.id} value={exec.id}>
                  {exec.name} ({exec.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-[#083c78] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Save Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
