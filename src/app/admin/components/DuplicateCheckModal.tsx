'use client';

import React from 'react';
import { AlertTriangle, X, ArrowRight, UserCheck } from 'lucide-react';
import { Lead } from '@/types';

interface DuplicateCheckModalProps {
  existingLead: Lead;
  onUpdateExisting: () => void;
  onCreateAnyway: () => void;
  onClose: () => void;
}

export default function DuplicateCheckModal({
  existingLead,
  onUpdateExisting,
  onCreateAnyway,
  onClose,
}: DuplicateCheckModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4 text-amber-600">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 font-poppins">Existing Lead Found!</h3>
            <p className="text-xs text-amber-700 font-medium">Duplicate Phone or Email Detected</p>
          </div>
        </div>

        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 flex flex-col gap-2 my-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono">#{existingLead.leadNumber}</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[9px]">{existingLead.status}</span>
          </div>
          <p className="text-xs font-bold text-slate-800">{existingLead.name}</p>
          <p className="text-[11px] text-slate-600 font-medium">
            Phone: <strong>{existingLead.phone}</strong> · Email: {existingLead.email || 'N/A'}
          </p>
          <p className="text-[10px] text-slate-400">Created: {new Date(existingLead.createdAt).toLocaleDateString('en-IN')}</p>
        </div>

        <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
          A matching record was found in the CRM database. Would you like to update the existing lead or create a new entry anyway?
        </p>

        <div className="flex flex-col gap-2 mt-6">
          <button
            onClick={onUpdateExisting}
            className="w-full py-3 rounded-xl bg-[#0B4F9C] hover:bg-[#083c78] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <UserCheck size={16} /> Update Existing Lead
          </button>
          <button
            onClick={onCreateAnyway}
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Create New Duplicate Record
          </button>
        </div>
      </div>
    </div>
  );
}
