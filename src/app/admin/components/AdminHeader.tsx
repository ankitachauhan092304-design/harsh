import React, { useState } from 'react';
import { Search, Bell, User, LogOut, ShieldCheck, Menu, Building2, RefreshCw, Radio } from 'lucide-react';
import { Role } from '@/types';
import NotificationPanel, { NotificationItem } from './NotificationPanel';

interface AdminHeaderProps {
  user: { id: string; email: string; name: string; role: Role };
  globalQuery: string;
  onSearchChange: (query: string) => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onSelectTab: (tab: string) => void;
  lastSyncTime?: string;
  isRefreshing?: boolean;
  onManualRefresh?: () => void;
}

export default function AdminHeader({
  user,
  globalQuery,
  onSearchChange,
  onLogout,
  onToggleSidebar,
  onSelectTab,
  lastSyncTime = 'Just Now',
  isRefreshing = false,
  onManualRefresh,
}: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Realtime Data Sync Active',
      message: 'Google Sheets & Local Database auto-sync every 5 seconds.',
      time: 'Live',
      type: 'LEAD',
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSelectNotification = (item: NotificationItem) => {
    setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
    setShowNotifications(false);
    if (item.type === 'LEAD' || item.type === 'REMINDER') onSelectTab('leads');
    else if (item.type === 'BLOG') onSelectTab('blogs');
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-[9px]">SUPER ADMIN</span>;
      case 'ADMIN':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px]">ADMIN</span>;
      case 'LOAN_EXECUTIVE':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[9px]">EXECUTIVE</span>;
      case 'CONTENT_MANAGER':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-[9px]">CONTENT</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[9px]">VIEWER</span>;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 md:hidden cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Header Input */}
        <div className="relative w-full max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={globalQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Global search lead #, name, phone, email, city..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#0B4F9C] focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Real-time Sync Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-xl text-emerald-700 text-xs font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>LIVE DATA (5s Auto-Sync)</span>
          {onManualRefresh && (
            <button
              onClick={onManualRefresh}
              title="Click to sync now"
              className="ml-1 p-1 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw size={13} className={`${isRefreshing ? 'animate-spin text-emerald-600' : 'text-emerald-500'}`} />
            </button>
          )}
        </div>
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 relative transition-colors cursor-pointer"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationPanel
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
              onSelectNotification={handleSelectNotification}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        {/* User Profile Badge */}
        <button
          onClick={() => onSelectTab('profile')}
          className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B4F9C] to-[#6366f1] text-white font-bold text-xs flex items-center justify-center shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-slate-800 line-clamp-1">{user.name}</span>
            <div className="mt-0.5">{getRoleBadge(user.role)}</div>
          </div>
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          title="Sign Out"
          className="p-2.5 rounded-xl border border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
