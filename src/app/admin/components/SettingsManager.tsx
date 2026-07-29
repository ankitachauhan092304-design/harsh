'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle, Building2, Phone, Mail, MapPin, Globe, Loader2 } from 'lucide-react';
import { Role } from '@/types';

interface SettingsManagerProps {
  settings: Record<string, string>;
  userRole: Role;
  onSaveSetting: (key: string, value: string) => void;
}

export default function SettingsManager({
  settings,
  userRole,
  onSaveSetting,
}: SettingsManagerProps) {
  const [formData, setFormData] = useState<Record<string, string>>({
    siteName: settings.siteName || 'Whitestone Fincorp',
    contactPhone: settings.contactPhone || '+91 98249 75488',
    contactEmail: settings.contactEmail || 'info@whitestonefincorp.com',
    contactAddress: settings.contactAddress || 'Level 14, Supreme Business Park, Hiranandani Gardens, Powai, Mumbai - 400076',
    whatsappNumber: settings.whatsappNumber || '919824975488',
    googleWebhookUrl: settings.googleWebhookUrl || localStorage.getItem('wf_google_webhook_url') || 'https://script.google.com/macros/s/AKfycbyc__n3C9_6t3Vz0y7H8sL78xR1yN2vQ95Z6k0M2o4h9G3F5J1wB3N2/exec',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const canEdit = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    Object.entries(formData).forEach(([key, val]) => {
      onSaveSetting(key, val);
      if (key === 'googleWebhookUrl') {
        localStorage.setItem('wf_google_webhook_url', val);
      }
    });

    setTimeout(() => {
      setIsSaving(false);
      setSuccessMsg('Website configuration & Google Sheet Webhook settings updated successfully!');
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-poppins flex items-center gap-2">
            Global Web Settings <Settings size={18} className="text-[#0B4F9C]" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage public business contact information, WhatsApp numbers, and social links.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle size={16} className="text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Company Name</label>
            <input
              type="text"
              disabled={!canEdit}
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0B4F9C]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Contact Phone</label>
            <input
              type="text"
              disabled={!canEdit}
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0B4F9C]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Contact Email</label>
            <input
              type="email"
              disabled={!canEdit}
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0B4F9C]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">WhatsApp Redirection Number</label>
            <input
              type="text"
              disabled={!canEdit}
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0B4F9C]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Official Office Address</label>
          <textarea
            rows={2}
            disabled={!canEdit}
            value={formData.contactAddress}
            onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#0B4F9C] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Google Business Maps URL</label>
            <input
              type="text"
              disabled={!canEdit}
              value={formData.googleBusinessUrl}
              onChange={(e) => setFormData({ ...formData, googleBusinessUrl: e.target.value })}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#0B4F9C]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">LinkedIn Profile URL</label>
            <input
              type="text"
              disabled={!canEdit}
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#0B4F9C]"
            />
          </div>
        </div>

        {canEdit && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-[#0B4F9C] hover:bg-[#083c78] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60"
            >
              {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Configuration</>}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
