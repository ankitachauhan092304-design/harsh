'use client';

import React, { useState, useMemo } from 'react';
import {
  Users, TrendingUp, Clock, CheckCircle2, AlertTriangle,
  XCircle, Award, Calendar, ChevronDown, Sparkles, Filter,
  ArrowUpRight, Building2, MapPin, IndianRupee, PieChart, BarChart3,
} from 'lucide-react';
import { Lead, Role } from '@/types';

interface DashboardOverviewProps {
  leads: Lead[];
  userRole: Role;
  onSelectLead: (lead: Lead) => void;
  onFilterByStatus: (status: string) => void;
}

export default function DashboardOverview({
  leads,
  userRole,
  onSelectLead,
  onFilterByStatus,
}: DashboardOverviewProps) {
  const [dateRange, setDateRange] = useState<'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'THIS_MONTH' | 'ALL'>('ALL');

  // Filter leads based on selected Date Range
  const filteredLeads = useMemo(() => {
    const now = new Date();
    return leads.filter((lead) => {
      const created = new Date(lead.createdAt);
      switch (dateRange) {
        case 'TODAY': {
          const today = new Date();
          return created.toDateString() === today.toDateString();
        }
        case 'YESTERDAY': {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          return created.toDateString() === yesterday.toDateString();
        }
        case 'LAST_7_DAYS': {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return created >= sevenDaysAgo;
        }
        case 'LAST_30_DAYS': {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return created >= thirtyDaysAgo;
        }
        case 'THIS_MONTH': {
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }
        default:
          return true;
      }
    });
  }, [leads, dateRange]);

  // Metrics Calculations
  const metrics = useMemo(() => {
    const total = filteredLeads.length;
    const newLeads = filteredLeads.filter((l) => l.status === 'NEW').length;
    const contacted = filteredLeads.filter((l) => l.status === 'CONTACTED').length;
    const inProgress = filteredLeads.filter((l) => l.status === 'IN_PROGRESS' || l.status === 'DOCUMENTS_RECEIVED' || l.status === 'UNDER_PROCESS').length;
    const approved = filteredLeads.filter((l) => l.status === 'APPROVED').length;
    const disbursed = filteredLeads.filter((l) => l.status === 'DISBURSED').length;
    const rejected = filteredLeads.filter((l) => l.status === 'REJECTED').length;

    const totalValue = filteredLeads.reduce((acc, curr) => acc + (curr.loanAmount || 0), 0);

    return { total, newLeads, contacted, inProgress, approved, disbursed, rejected, totalValue };
  }, [filteredLeads]);

  // Follow-up Widgets Calculations
  const followups = useMemo(() => {
    const todayStr = new Date().toDateString();
    const now = new Date();

    const overdue: Lead[] = [];
    const today: Lead[] = [];
    const tomorrow: Lead[] = [];
    const upcoming: Lead[] = [];

    leads.forEach((l) => {
      if (!l.nextFollowupDate) return;
      const fDate = new Date(l.nextFollowupDate);
      const diffDays = Math.ceil((fDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

      if (fDate.toDateString() === todayStr) {
        today.push(l);
      } else if (fDate < now) {
        overdue.push(l);
      } else if (diffDays === 1) {
        tomorrow.push(l);
      } else if (diffDays > 1 && diffDays <= 7) {
        upcoming.push(l);
      }
    });

    return { overdue, today, tomorrow, upcoming };
  }, [leads]);

  // Distribution by Loan Type
  const loanTypeStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLeads.forEach((l) => {
      const type = l.loanType || 'PERSONAL';
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [filteredLeads]);

  // Distribution by City
  const cityStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLeads.forEach((l) => {
      const city = l.city || 'Other';
      counts[city] = (counts[city] || 0) + 1;
    });
    return counts;
  }, [filteredLeads]);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header Bar & Date Range Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-poppins flex items-center gap-2">
            Executive Analytics Dashboard <Sparkles size={18} className="text-[#0B4F9C]" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">Real-time pipeline overview, lead statistics, and follow-up queues.</p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-[#0B4F9C] cursor-pointer"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="YESTERDAY">Yesterday</option>
            <option value="LAST_7_DAYS">Last 7 Days</option>
            <option value="LAST_30_DAYS">Last 30 Days</option>
            <option value="THIS_MONTH">This Month</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Leads */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-2 hover:border-[#0B4F9C]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Leads</span>
            <div className="p-2 rounded-xl bg-blue-50 text-[#0B4F9C]"><Users size={16} /></div>
          </div>
          <span className="text-2xl font-black text-slate-800 font-poppins">{metrics.total}</span>
          <span className="text-[10px] text-slate-400 font-medium">₹{(metrics.totalValue / 100000).toFixed(1)} Lakhs volume</span>
        </div>

        {/* New Leads */}
        <div
          onClick={() => onFilterByStatus('NEW')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-2 hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">New Ingested</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><Sparkles size={16} /></div>
          </div>
          <span className="text-2xl font-black text-slate-800 font-poppins group-hover:text-emerald-600 transition-colors">{metrics.newLeads}</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">Click to view <ArrowUpRight size={10} /></span>
        </div>

        {/* Contacted */}
        <div
          onClick={() => onFilterByStatus('CONTACTED')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-2 hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Contacted</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><Clock size={16} /></div>
          </div>
          <span className="text-2xl font-black text-slate-800 font-poppins group-hover:text-blue-600 transition-colors">{metrics.contacted}</span>
          <span className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5">Click to view <ArrowUpRight size={10} /></span>
        </div>

        {/* In Progress */}
        <div
          onClick={() => onFilterByStatus('IN_PROGRESS')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-2 hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Under Process</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600"><TrendingUp size={16} /></div>
          </div>
          <span className="text-2xl font-black text-slate-800 font-poppins group-hover:text-indigo-600 transition-colors">{metrics.inProgress}</span>
          <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-0.5">Click to view <ArrowUpRight size={10} /></span>
        </div>

        {/* Approved / Disbursed */}
        <div
          onClick={() => onFilterByStatus('APPROVED')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-2 hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Approved</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700"><CheckCircle2 size={16} /></div>
          </div>
          <span className="text-2xl font-black text-slate-800 font-poppins group-hover:text-emerald-700 transition-colors">{metrics.approved + metrics.disbursed}</span>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">Click to view <ArrowUpRight size={10} /></span>
        </div>

        {/* Rejected */}
        <div
          onClick={() => onFilterByStatus('REJECTED')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-2 hover:border-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Rejected</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600"><XCircle size={16} /></div>
          </div>
          <span className="text-2xl font-black text-slate-800 font-poppins group-hover:text-rose-600 transition-colors">{metrics.rejected}</span>
          <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5">Click to view <ArrowUpRight size={10} /></span>
        </div>
      </div>

      {/* Follow-up Dashboard Widgets Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-800 font-poppins flex items-center gap-2">
          <Calendar size={18} className="text-[#0B4F9C]" />
          Follow-up Reminders & Queues
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Overdue Widget (Highlighted in RED) */}
          <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-rose-600 animate-bounce" />
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">Overdue ({followups.overdue.length})</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 text-[10px] font-bold">ACTION REQD</span>
            </div>

            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {followups.overdue.length > 0 ? (
                followups.overdue.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => onSelectLead(l)}
                    className="p-3 bg-white rounded-xl border border-rose-200 hover:border-rose-400 transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{l.name}</p>
                      <p className="text-[10px] text-slate-400">{l.phone} · ₹{(l.loanAmount / 100000).toFixed(1)}L</p>
                    </div>
                    <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">Overdue</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-rose-700/70 font-semibold py-4 text-center">No overdue follow-ups!</p>
              )}
            </div>
          </div>

          {/* Today Widget */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Today&apos;s Follow-ups ({followups.today.length})</h4>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0B4F9C] text-[10px] font-bold">TODAY</span>
            </div>

            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {followups.today.length > 0 ? (
                followups.today.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => onSelectLead(l)}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#0B4F9C] transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{l.name}</p>
                      <p className="text-[10px] text-slate-400">{l.phone} · {l.loanType}</p>
                    </div>
                    <span className="text-[9px] font-bold text-[#0B4F9C]">Scheduled</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-semibold py-4 text-center">No follow-ups for today.</p>
              )}
            </div>
          </div>

          {/* Tomorrow Widget */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tomorrow ({followups.tomorrow.length})</h4>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">TOMORROW</span>
            </div>

            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {followups.tomorrow.length > 0 ? (
                followups.tomorrow.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => onSelectLead(l)}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-400 transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{l.name}</p>
                      <p className="text-[10px] text-slate-400">{l.city} · ₹{(l.loanAmount / 100000).toFixed(1)}L</p>
                    </div>
                    <span className="text-[9px] font-bold text-indigo-600">Pending</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-semibold py-4 text-center">No follow-ups for tomorrow.</p>
              )}
            </div>
          </div>

          {/* Upcoming Widget */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Next 7 Days ({followups.upcoming.length})</h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">UPCOMING</span>
            </div>

            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {followups.upcoming.length > 0 ? (
                followups.upcoming.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => onSelectLead(l)}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-400 transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{l.name}</p>
                      <p className="text-[10px] text-slate-400">{l.loanType}</p>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-600">Upcoming</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-semibold py-4 text-center">No upcoming follow-ups.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Loan Type Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-800 font-poppins flex items-center gap-2">
              <BarChart3 size={16} className="text-[#0B4F9C]" /> Leads by Loan Category
            </h4>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Category Breakdown</span>
          </div>

          <div className="flex flex-col gap-3 py-2">
            {Object.entries(loanTypeStats).map(([type, count]) => {
              const percentage = Math.round((count / Math.max(metrics.total, 1)) * 100);
              return (
                <div key={type} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{type}</span>
                    <span>{count} leads ({percentage}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0B4F9C] to-[#6366f1] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leads by City Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-800 font-poppins flex items-center gap-2">
              <MapPin size={16} className="text-[#00A86B]" /> Leads by City Location
            </h4>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Regional Distribution</span>
          </div>

          <div className="flex flex-col gap-3 py-2">
            {Object.entries(cityStats).map(([city, count]) => {
              const percentage = Math.round((count / Math.max(metrics.total, 1)) * 100);
              return (
                <div key={city} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{city}</span>
                    <span>{count} leads ({percentage}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00A86B] to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
