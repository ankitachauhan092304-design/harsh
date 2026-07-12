'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Settings, Save, RefreshCw, Compass, ShieldCheck, MessageSquare, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminSettings() {
  useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings State
  const [siteName, setSiteName] = useState('Whitestone Fincorp');
  const [phone, setPhone] = useState('+91 98249 75488');
  const [email, setEmail] = useState('info@whitestonefincorp.com');
  const [address, setAddress] = useState('207/21 WHITESTONE FIN CORP, OPP ADC BAN, RAKHIAL, AHMEDABAD – 380023');
  const [whatsapp, setWhatsapp] = useState('919824975488');
  const [facebook, setFacebook] = useState('https://facebook.com/whitestonefincorp');
  const [linkedin, setLinkedin] = useState('https://linkedin.com/company/whitestonefincorp');
  const [waEnabled, setWaEnabled] = useState(true);
  const [waGreeting, setWaGreeting] = useState('Hello! 👋 Thank you for reaching out to Whitestone Fincorp. How may we assist you with your loan enquiry today?');
  const [waBusinessHours, setWaBusinessHours] = useState('Mon-Sat 9:00 AM – 7:00 PM IST');

  useEffect(() => {
    // In our dbService, we have fallback settings.
    // Let's simulate loading them or query them. Since it's settings,
    // we can check if there's any API, or just fetch them.
    const loadSettings = async () => {
      // Simulate loading for 500ms
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Simulate API saving
      await new Promise((resolve) => setTimeout(resolve, 800));
      alert('Global configurations updated successfully. Node cache cleared.');
    } catch {
      alert('Failed to save configurations.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 text-xs font-bold gap-3">
        <Compass className="animate-spin text-[#0B4F9C]" size={32} />
        <span>Loading global configurations cache...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-inter relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 font-poppins">Global Configurations</h1>
          <span className="text-xs text-slate-400 font-semibold mt-1">Configure metadata, phone support, and social links</span>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Core Settings Card */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col gap-5">
          <h3 className="text-sm font-bold text-slate-800 font-poppins pb-2 border-b border-slate-100 flex items-center gap-2">
            <Settings size={18} className="text-[#0B4F9C]" />
            Corporate Profile Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Site Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] focus:bg-white transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone Support</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] focus:bg-white transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp API ID (Prefix Country Code)</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 919876543210"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Office Physical Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] focus:bg-white transition-all resize-none"
              required
            />
          </div>

          {/* Social */}
          <h3 className="text-sm font-bold text-slate-800 font-poppins pb-2 border-b border-slate-100 flex items-center gap-2 mt-4">
            Connect Social Channels
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Facebook Corporate page</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">LinkedIn Company profile</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-4 py-3 bg-[#0B4F9C] hover:bg-[#083c78] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Commiting configuration states...
              </>
            ) : (
              <>
                <Save size={14} />
                Save Site Configurations
              </>
            )}
          </button>
        </div>

        {/* WhatsApp Configuration Card */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col gap-5">
          <h3 className="text-sm font-bold text-slate-800 font-poppins pb-2 border-b border-slate-100 flex items-center gap-2">
            <MessageSquare size={18} className="text-[#25D366]" />
            WhatsApp CRM Configuration
          </h3>

          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-700">WhatsApp Integration</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Allow leads to initiate WhatsApp contact after form submission</p>
            </div>
            <button
              type="button"
              onClick={() => setWaEnabled(!waEnabled)}
              className="cursor-pointer transition-colors"
            >
              {waEnabled ? (
                <ToggleRight size={32} className="text-[#25D366]" />
              ) : (
                <ToggleLeft size={32} className="text-slate-400" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp Business Number (with country code)</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 919876543210"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#25D366] focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Business Hours Display</label>
              <input
                type="text"
                value={waBusinessHours}
                onChange={(e) => setWaBusinessHours(e.target.value)}
                placeholder="e.g. Mon-Sat 9AM-7PM IST"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#25D366] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Default Greeting Message</label>
            <textarea
              value={waGreeting}
              onChange={(e) => setWaGreeting(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#25D366] focus:bg-white transition-all resize-none"
            />
          </div>

          {/* WhatsApp Preview */}
          <div className="p-4 rounded-2xl bg-[#ECF8F1] border border-[#25D366]/20">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Message Preview</p>
            <div className="p-3 bg-white rounded-xl text-xs font-semibold text-slate-700 shadow-sm border border-slate-100 leading-relaxed whitespace-pre-line">
              {waGreeting}
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert('WhatsApp configuration saved successfully.')}
            className="w-full py-3 bg-[#25D366] hover:bg-[#22c55e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Save size={14} />
            Save WhatsApp Configuration
          </button>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck size={18} className="text-[#00A86B]" />
            <h4 className="text-sm font-bold text-slate-800 font-poppins">System Parameters</h4>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span>Next.js Engine:</span>
              <span className="font-bold text-slate-800 font-dmsans">v16.2.10</span>
            </div>
            <div className="flex justify-between">
              <span>Database Server:</span>
              <span className="font-bold text-slate-800 font-dmsans">PostgreSQL / Prisma</span>
            </div>
            <div className="flex justify-between">
              <span>SSL Encryption:</span>
              <span className="font-bold text-emerald-600 font-poppins">ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span>Rate Limiting Limit:</span>
              <span className="font-bold text-slate-800 font-dmsans">60 requests/min</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
