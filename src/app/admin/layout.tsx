'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Compass } from 'lucide-react';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAdminAuth();

  const isLoginPage = pathname === '/admin/login';

  // Redirect checks on mount/updates
  React.useEffect(() => {
    if (!loading) {
      if (!user && !isLoginPage) {
        router.push('/admin/login');
      } else if (user && isLoginPage) {
        router.push('/admin/dashboard');
      }
    }
  }, [user, loading, isLoginPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-inter">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-xs font-bold">
          <Compass className="animate-spin text-[#0B4F9C]" size={36} />
          <span>Verifying admin token security...</span>
        </div>
      </div>
    );
  }

  // Prevent flash of content during redirect
  if (!user && !isLoginPage) {
    return null;
  }
  if (user && isLoginPage) {
    return null;
  }

  // Render plain layout for Login page
  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  const sidebarLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Leads CRM', href: '/admin/leads', icon: Users },
    { name: 'Blog CMS', href: '/admin/blogs', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter pt-0">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B132B] text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div className="flex flex-col">
          {/* Logo header */}
          <div className="p-6 border-b border-slate-800 flex flex-col gap-2">
            <img 
              src="/logo.svg" 
              alt="Whitestone Logo" 
              className="h-9 md:h-11 w-auto object-contain brightness-0 invert self-start"
            />
            <span className="text-[8px] font-extrabold text-[#00A86B] tracking-widest uppercase">CRM PANEL</span>
          </div>

          {/* Links */}
          <nav className="p-4 flex flex-col gap-1.5 mt-4">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0B4F9C] text-white'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={16} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User logout section */}
        <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
          <div className="flex flex-col px-4 text-xs">
            <span className="font-bold text-white leading-none">{user?.name}</span>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase mt-1 tracking-wider">
              {user?.role.replace('_', ' ')}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors w-full cursor-pointer"
          >
            <LogOut size={16} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-grow p-8 md:p-10 max-h-screen overflow-y-auto no-scrollbar">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
