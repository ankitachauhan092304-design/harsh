'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Mail, ShieldAlert, Loader2, ArrowRight, Eye, EyeOff, Building2, CheckCircle2 } from 'lucide-react';
import { clientDbService as dbService } from '@/lib/clientDbService';
import { Role } from '@/types';

interface AdminLoginProps {
  onLoginSuccess: (user: { id: string; email: string; name: string; role: Role }) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Rate Limiting & Account Lockout
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('wf_admin_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Check Lockout Status
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const secondsLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setErrorMsg(`Too many failed attempts. Account locked for ${secondsLeft}s.`);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      // Authenticate via dbService
      const admin = await dbService.getAdminByEmail(email.trim().toLowerCase());
      
      if (!admin) {
        handleFailedAttempt();
        setIsLoading(false);
        return;
      }

      // Check Password
      const { default: bcrypt } = await import('bcryptjs');
      const isMatch = bcrypt.compareSync(password, admin.passwordHash);

      if (!isMatch) {
        handleFailedAttempt();
        setIsLoading(false);
        return;
      }

      // Successful Login
      if (rememberMe) {
        localStorage.setItem('wf_admin_remember_email', email.trim().toLowerCase());
      } else {
        localStorage.removeItem('wf_admin_remember_email');
      }

      // Record Audit Log
      await dbService.createAuditLog(admin.name, 'LOGIN_SUCCESS', `Admin logged in with role ${admin.role}`, admin.id);

      // Pass user object
      const userPayload = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role as Role,
      };

      // Store Session
      sessionStorage.setItem('wf_admin_user', JSON.stringify(userPayload));
      localStorage.setItem('wf_admin_session_time', Date.now().toString());

      setFailedAttempts(0);
      setLockoutUntil(null);
      setIsLoading(false);
      onLoginSuccess(userPayload);

    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('An unexpected error occurred during authentication.');
      setIsLoading(false);
    }
  };

  const handleFailedAttempt = () => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);

    // Audit failed attempt
    dbService.createAuditLog(email || 'Unknown', 'LOGIN_FAILED', `Failed login attempt (${nextAttempts}/5)`).catch(() => {});

    if (nextAttempts >= 5) {
      const lockTime = Date.now() + 60000; // 60s lockout
      setLockoutUntil(lockTime);
      setErrorMsg('5 consecutive failed login attempts. Account temporarily locked for 60 seconds.');
    } else {
      setErrorMsg(`Invalid credentials. ${5 - nextAttempts} attempt(s) remaining before lockout.`);
    }
  };

  const isLocked = !!(lockoutUntil && Date.now() < lockoutUntil);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0B4F9C]/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white/95 backdrop-blur-md w-full max-w-md rounded-3xl p-8 border border-white/20 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B4F9C] via-[#1a5fb4] to-[#00A86B] flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Building2 size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 font-poppins">Whitestone Fincorp</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Enterprise Admin Portal</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
            <ShieldAlert size={16} className="text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Mail size={12} /> Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                disabled={isLocked || isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@whitestonefincorp.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#0B4F9C] focus:bg-white transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Lock size={12} /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLocked || isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#0B4F9C] focus:bg-white transition-all pr-10 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#0B4F9C] focus:ring-[#0B4F9C]"
              />
              <span>Remember email</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Please contact Super Admin (superadmin@whitestonefincorp.com) to reset credentials.')}
              className="text-[#0B4F9C] font-bold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || isLocked}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#0B4F9C] via-[#1a5fb4] to-[#00A86B] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Authenticating...</>
            ) : (
              <>Sign In to Portal <ArrowRight size={15} /></>
            )}
          </button>
        </form>

        {/* Quick Demo Login Preset Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase text-center tracking-wider mb-1">Demo Quick Logins</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setEmail('superadmin@whitestonefincorp.com'); setPassword('SuperAdminPassword123!'); }}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] font-bold text-slate-700 text-left border border-slate-200 transition-colors"
            >
              <div className="text-[#0B4F9C]">Super Admin</div>
              <div className="text-[9px] text-slate-400 font-mono">superadmin@...</div>
            </button>
            <button
              type="button"
              onClick={() => { setEmail('admin@whitestonefincorp.com'); setPassword('AdminPassword123!'); }}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] font-bold text-slate-700 text-left border border-slate-200 transition-colors"
            >
              <div className="text-[#0B4F9C]">Admin</div>
              <div className="text-[9px] text-slate-400 font-mono">admin@...</div>
            </button>
            <button
              type="button"
              onClick={() => { setEmail('executive@whitestonefincorp.com'); setPassword('ExecutivePassword123!'); }}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] font-bold text-slate-700 text-left border border-slate-200 transition-colors"
            >
              <div className="text-[#00A86B]">Loan Executive</div>
              <div className="text-[9px] text-slate-400 font-mono">executive@...</div>
            </button>
            <button
              type="button"
              onClick={() => { setEmail('content@whitestonefincorp.com'); setPassword('ContentPassword123!'); }}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] font-bold text-slate-700 text-left border border-slate-200 transition-colors"
            >
              <div className="text-indigo-600">Content Manager</div>
              <div className="text-[9px] text-slate-400 font-mono">content@...</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
