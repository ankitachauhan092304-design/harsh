'use client';

import React from 'react';
import { Eye, Users, Calendar, Smartphone, Laptop, Globe, RefreshCw, ArrowUpRight, MapPin, Compass, Map, Navigation } from 'lucide-react';
import { VisitorAnalytics as IVisitorAnalytics } from '@/types';

interface VisitorAnalyticsProps {
  analytics: IVisitorAnalytics | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function VisitorAnalytics({ analytics, onRefresh, isRefreshing }: VisitorAnalyticsProps) {
  if (!analytics) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-[#0B4F9C] border-t-transparent animate-spin" />
        <span className="text-xs font-bold text-slate-500">Loading Realtime Visitor Analytics...</span>
      </div>
    );
  }

  const {
    totalPageviews,
    uniqueVisitors,
    visitorsToday,
    mobileSharePercent,
    recentVisitors,
    topPages,
    referrerSources,
    regionBreakdown = [],
    cityBreakdown = [],
  } = analytics;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0B4F9C] text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Realtime Geolocation & Website Analytics</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-poppins mt-1">Region-Wise Visitor Counter & Traffic Intelligence</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Track live website sessions, region & city location distribution, device categories, and top visited pages.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pageviews */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Pageviews</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#0B4F9C] flex items-center justify-center">
              <Eye size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 font-poppins">{totalPageviews.toLocaleString('en-IN')}</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight size={10} /> Live
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">All page loads logged</p>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Unique Visitors</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 font-poppins">{uniqueVisitors.toLocaleString('en-IN')}</span>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Unique Sessions</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Distinct browser sessions</p>
        </div>

        {/* Visitors Today */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Visitors Today</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 font-poppins">{visitorsToday.toLocaleString('en-IN')}</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Today</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Logged in current 24h cycle</p>
        </div>

        {/* Mobile vs Desktop */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mobile Share</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Smartphone size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 font-poppins">{mobileSharePercent}%</span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {100 - mobileSharePercent}% Desktop
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Device category split</p>
        </div>
      </div>

      {/* NEW: Region-Wise & City-Wise Location Intelligence Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region / State-Wise Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 font-poppins flex items-center gap-2">
              <Map size={16} className="text-rose-600" /> Region / State-Wise Views
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Share %</span>
          </div>

          <div className="flex flex-col gap-3.5">
            {regionBreakdown.length > 0 ? (
              regionBreakdown.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <MapPin size={13} className="text-rose-500" />
                      <span>{item.region}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono text-[11px]">{item.count} views</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px]">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(item.percentage, 5)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 py-4 text-center">No region data logged yet.</div>
            )}
          </div>
        </div>

        {/* City-Wise Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 font-poppins flex items-center gap-2">
              <Navigation size={16} className="text-blue-600" /> Top Visiting Cities
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Visits</span>
          </div>

          <div className="flex flex-col gap-3 divide-y divide-slate-50">
            {cityBreakdown.length > 0 ? (
              cityBreakdown.map((item, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2 truncate max-w-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 font-bold">{item.city}</span>
                    <span className="text-slate-400 text-[11px] font-normal">({item.region})</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0B4F9C] font-bold text-[11px]">
                    {item.count} sessions
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 py-4 text-center">No city data logged yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Pages & Referrers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Visited Pages */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 font-poppins flex items-center gap-2">
              <Globe size={16} className="text-[#0B4F9C]" /> Top Visited Pages
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Pageviews</span>
          </div>

          <div className="flex flex-col gap-3 divide-y divide-slate-50">
            {topPages.length > 0 ? (
              topPages.map((item, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs font-semibold">
                  <span className="font-mono text-slate-700 truncate max-w-xs">{item.path}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0B4F9C] font-bold text-[11px]">
                      {item.count} views
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 py-4 text-center">No page data logged yet.</div>
            )}
          </div>
        </div>

        {/* Top Referral Sources */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 font-poppins flex items-center gap-2">
              <Compass size={16} className="text-purple-600" /> Referral Traffic Sources
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Visits</span>
          </div>

          <div className="flex flex-col gap-3 divide-y divide-slate-50">
            {referrerSources.length > 0 ? (
              referrerSources.map((item, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 truncate max-w-xs">{item.source}</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[11px]">
                    {item.count} sessions
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 py-4 text-center">No referrer data logged yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Live Visitor Stream Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 font-poppins flex items-center gap-2">
              <Users size={16} className="text-emerald-600" /> Live Visitor Activity & Geolocation Log
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Showing live session details, location, and page visits</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <th className="py-3 px-6">IP Address</th>
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Page Path</th>
                <th className="py-3 px-6">Device</th>
                <th className="py-3 px-6">Browser & OS</th>
                <th className="py-3 px-6">Referrer</th>
                <th className="py-3 px-6">Visitor Location & Region</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {recentVisitors.length > 0 ? (
                recentVisitors.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                        {v.ip || '103.21.124.89'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap text-slate-500 font-mono">
                      {v.timestamp ? new Date(v.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'medium' }) : 'Just Now'}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-[#0B4F9C] font-mono">
                      {v.path || '/'}
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      {v.device === 'MOBILE' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px]">
                          <Smartphone size={11} /> Mobile
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                          <Laptop size={11} /> Desktop
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{v.browser || 'Chrome'}</span>
                      <span className="text-slate-400 text-[10px] ml-1.5">({v.os || 'OS'})</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 truncate max-w-xs">
                      {v.referrer || 'Direct / Search'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-semibold whitespace-nowrap flex items-center gap-1.5">
                      <MapPin size={13} className="text-rose-500 shrink-0" />
                      <span>{v.location || (v.city ? `${v.city}, ${v.region}, ${v.country || 'India'}` : 'Gujarat, India')}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs font-semibold">
                    No visitor logs recorded yet. As users browse the site, real-time logs will appear here!
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
