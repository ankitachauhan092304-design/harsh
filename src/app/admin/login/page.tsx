'use client';

import React, { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { ShieldCheck, Mail, Lock, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all security parameters.');
      return;
    }

    setLoading(true);

    const res = await login(email, password);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center font-inter p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/50 shadow-xl p-8 md:p-10 flex flex-col gap-6 relative overflow-hidden">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center gap-2">
          <img 
            src="/logo.svg" 
            alt="Whitestone Fincorp Logo" 
            className="h-16 md:h-20 w-auto object-contain"
          />
          <span className="text-[10px] font-extrabold text-[#00A86B] tracking-widest uppercase border border-emerald-100 bg-emerald-50 px-2 py-0.5 rounded-full mt-2">
            Admin Console Portal
          </span>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold rounded-xl flex gap-2 items-center">
            <AlertCircle size={16} className="text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Administrative Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-slate-400" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@whitestonefincorp.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#0B4F9C] focus:bg-white outline-none rounded-xl text-sm font-semibold transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Security Token Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-slate-400" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#0B4F9C] focus:bg-white outline-none rounded-xl text-sm font-semibold transition-all"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-premium hover:bg-gradient-premium-hover text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Authorizing Session...
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                Access CRM Panel
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-4">
          Authorized personnel only. Audit tracking active on this node.
        </div>
      </div>
    </div>
  );
}
