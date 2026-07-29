'use client';

import React, { useState } from 'react';
import { Shield, Search, Download, Clock, User, Filter } from 'lucide-react';
import { AuditLog } from '@/types';

interface AuditLogViewerProps {
  auditLogs: AuditLog[];
}

export default function AuditLogViewer({ auditLogs }: AuditLogViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-poppins flex items-center gap-2">
            System Audit & Security Logs <Shield size={18} className="text-[#0B4F9C]" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">Immutable security log of all admin actions, status changes, and logins.</p>
        </div>

        <div className="relative max-w-md w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by User, Action, or Event details..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#0B4F9C]"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Timestamp</th>
                <th className="p-4">User / Actor</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-[10px] text-slate-400 font-mono">
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                      <User size={13} className="text-slate-400" /> {log.username}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0B4F9C] font-mono text-[9px] font-bold border border-blue-100">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-xs font-semibold text-slate-400">
                    No audit logs matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
