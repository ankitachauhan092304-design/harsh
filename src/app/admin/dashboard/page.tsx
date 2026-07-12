'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Users, FileText, CheckCircle2, Compass, AlertCircle } from 'lucide-react';
import { AuditLog } from '@/types';

interface Stats {
  totalLeads: number;
  approvedLeads: number;
  inProgressLeads: number;
  newLeads: number;
  conversionRate: number;
  avgLoanValue: number;
  statusBreakdown: Record<string, number>;
  productBreakdown: Record<string, number>;
  sourceBreakdown?: {
    whatsappLeads: number;
    websiteLeads: number;
    calculatorLeads: number;
    manualLeads: number;
  };
  recentActivity: AuditLog[];
}

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch statistics.');
        }

        setStats(data.stats);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Failed to load dashboard analytics.';
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 text-xs font-bold gap-3">
        <Compass className="animate-spin text-[#0B4F9C]" size={32} />
        <span>Aggregating CRM metadata statistics...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold rounded-xl flex gap-2 items-center">
        <AlertCircle size={16} className="text-rose-500 shrink-0" />
        <span>{error || 'Failed to initialize analytics.'}</span>
      </div>
    );
  }

  const kpis = [
    { label: 'Total Ingested Leads', value: stats.totalLeads, icon: Users, color: 'text-[#0B4F9C] bg-blue-50' },
    { label: 'New Lead Entries', value: stats.newLeads, icon: FileText, color: 'text-amber-600 bg-amber-50' },
    { label: 'Active Underwriting', value: stats.inProgressLeads, icon: Compass, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Lead Conversion Rate', value: `${stats.conversionRate.toFixed(1)}%`, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
  ];

  const sourceBuckets = [
    { label: 'WhatsApp Leads', value: stats.sourceBreakdown?.whatsappLeads ?? 0, color: 'border-[#25D366]/30 text-[#25D366] bg-[#25D366]/5' },
    { label: 'Website Leads', value: stats.sourceBreakdown?.websiteLeads ?? 0, color: 'border-blue-200 text-blue-600 bg-blue-50/30' },
    { label: 'Calculator Leads', value: stats.sourceBreakdown?.calculatorLeads ?? 0, color: 'border-purple-200 text-purple-600 bg-purple-50/30' },
    { label: 'Manual Leads', value: stats.sourceBreakdown?.manualLeads ?? 0, color: 'border-slate-200 text-slate-600 bg-slate-50/30' },
  ];

  return (
    <div className="flex flex-col gap-8 font-inter">
      {/* Header Greeting */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 font-poppins">CRM Analytics Dashboard</h1>
          <span className="text-xs text-slate-400 font-semibold mt-1">Authorized Node Session active for {user?.name}</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex justify-between items-center">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{kpi.label}</span>
                <span className="text-xl md:text-2xl font-black text-slate-800 font-dmsans mt-1">{kpi.value}</span>
              </div>
              <div className={`p-3 rounded-2xl ${kpi.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Ingestion Source Buckets */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">CRM Lead Ingestion Channels</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {sourceBuckets.map((bucket, idx) => (
            <div key={idx} className={`p-5 rounded-3xl border ${bucket.color} flex flex-col gap-1`}>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{bucket.label}</span>
              <span className="text-2xl font-black font-dmsans mt-1">{bucket.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Distribution Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col gap-5">
          <h3 className="text-sm font-bold text-slate-800 font-poppins pb-2 border-b border-slate-100">Leads by Operational Status</h3>
          <div className="flex flex-col gap-3.5 mt-2">
            {Object.entries(stats.statusBreakdown).map(([status, count]) => {
              const percentage = stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0;
              return (
                <div key={status} className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-bold">{status}</span>
                    <span className="font-dmsans text-slate-500">{count} leads ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        status === 'APPROVED' ? 'bg-[#00A86B]' :
                        status === 'REJECTED' ? 'bg-rose-500' :
                        status === 'IN_PROGRESS' ? 'bg-indigo-500' :
                        status === 'CONTACTED' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Breakdown */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col gap-5">
          <h3 className="text-sm font-bold text-slate-800 font-poppins pb-2 border-b border-slate-100">Inquiries by Product Categories</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {Object.entries(stats.productBreakdown).map(([prod, count]) => (
              <div key={prod} className="flex flex-col p-4 bg-slate-50 border border-slate-100/50 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{prod.replace('_', ' ')}</span>
                <span className="text-lg font-bold text-[#0B4F9C] font-dmsans mt-1">{count} Inquiries</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Audits */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 md:p-8 overflow-hidden">
        <h3 className="text-sm font-bold text-slate-800 font-poppins pb-2 border-b border-slate-100 mb-5">Recent Security Audit Logs</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-inter font-semibold text-slate-600">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 rounded-l-xl">Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4 rounded-r-xl">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentActivity.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-dmsans text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-4 text-[#0B4F9C] font-bold">{log.username}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                      log.action.includes('LOGIN') ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-medium">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
