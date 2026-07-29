'use client';

import React, { useState } from 'react';
import { Search, Bell, User, LogOut, ShieldCheck, Menu, Building2 } from 'lucide-react';
import { Role } from '@/types';
import NotificationPanel, { NotificationItem } from './NotificationPanel';

interface AdminHeaderProps {
  user: { id: string; email: string; name: string; role: Role };
  globalQuery: string;
  onSearchChange: (query: string) => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onSelectTab: (tab: string) => void;
}

export default function AdminHeader({
  user,
  globalQuery,
  onSearchChange,
  onLogout,
  onToggleSidebar,
  onSelectTab,
}: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'New Lead Captured',
      message: 'Amit Patel submitted a Personal Loan enquiry for ₹5,00,000.',
      time: '10m ago',
      type: 'LEAD',
      read: false,
    },
    {
      id: 'n2',
      title: 'Follow-up Overdue',
      message: 'Priya Sharma home loan documentation follow-up is overdue.',
      time: '1h ago',
      type: 'REMINDER',
      read: false,
    },
    {
      id: 'n3',
      title: 'Blog Published',
      message: '5 Crucial Tips to Boost Your Credit Score Fast is now live.',
      time: '3h ago',
      type: 'BLOG',
      read: true,
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
