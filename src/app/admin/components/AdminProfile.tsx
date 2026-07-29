'use client';

import React, { useState } from 'react';
import { User, Key, CheckCircle, ShieldAlert, Loader2, Mail, Shield, Building2 } from 'lucide-react';
import { Role } from '@/types';
import { clientDbService as dbService } from '@/lib/clientDbService';

interface AdminProfileProps {
  user: { id: string; email: string; name: string; role: Role };
}

export default function AdminProfile({ user }: AdminProfileProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { default: bcrypt } = await import('bcryptjs');
      const newHash = bcrypt.hashSync(newPassword, 10);

      await dbService.updateAdminUser(user.id, { passwordHash: newHash });
      await dbService.createAuditLog(user.name, 'PASSWORD_CHANGE', 'Admin password changed successfully', user.id);

      setSuccessMsg('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B4F9C] via-[#1a5fb4] to-[#00A86B] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 font-poppins">{user.name}</h2>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-1">
              <Mail size={13} /> {user.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200">
          <Shield size={16} className="text-[#0B4F9C]" />
          <span className="text-xs font-bold text-slate-700">Role: <span className="font-mono text-[#0B4F9C]">{user.role}</span></span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-100">
          <Key size={18} className="text-[#0B4F9C]" />
          <h3 className="text-base font-bold text-slate-800 font-poppins">Change Account Password</h3>
        </div>

        {successMsg && (
          <div className="p-3.5 mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
            <ShieldAlert size={16} className="text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 max-w-md">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#0B4F9C] focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#0B4F9C] focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#0B4F9C] focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-[#0B4F9C] hover:bg-[#083c78] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
