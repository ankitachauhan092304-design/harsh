'use client';

import React from 'react';
import { Bell, CheckCircle, Clock, AlertCircle, FileText, X, ArrowRight } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'LEAD' | 'STATUS' | 'REMINDER' | 'BLOG';
  read: boolean;
}

interface NotificationPanelProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectNotification: (item: NotificationItem) => void;
  onClose: () => void;
}

export default function NotificationPanel({
  notifications,
  onMarkAllRead,
  onSelectNotification,
  onClose,
}: NotificationPanelProps) {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'LEAD':
        return <CheckCircle size={14} className="text-emerald-500" />;
      case 'STATUS':
        return <Clock size={14} className="text-blue-500" />;
      case 'REMINDER':
        return <AlertCircle size={14} className="text-rose-500" />;
      case 'BLOG':
        return <FileText size={14} className="text-indigo-500" />;
      default:
        return <Bell size={14} className="text-slate-500" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-[#0B4F9C]" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</h3>
          <span className="px-2 py-0.5 rounded-full bg-[#0B4F9C]/10 text-[#0B4F9C] text-[10px] font-bold">
            {notifications.filter((n) => !n.read).length} Unread
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllRead}
            className="text-[10px] font-bold text-[#0B4F9C] hover:underline cursor-pointer"
          >
            Mark all read
          </button>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-200">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectNotification(item)}
              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                !item.read ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-slate-100 shrink-0 mt-0.5 shadow-xs">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                  <span className="text-[9px] font-medium text-slate-400 shrink-0">{item.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{item.message}</p>
              </div>
              {!item.read && <div className="w-2 h-2 rounded-full bg-[#0B4F9C] shrink-0 mt-1.5" />}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs font-semibold text-slate-400">
            No notifications available.
          </div>
        )}
      </div>
    </div>
  );
}
