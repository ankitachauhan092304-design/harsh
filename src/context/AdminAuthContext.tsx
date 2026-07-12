'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success?: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load session from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    const timer = setTimeout(() => {
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || 'Authentication failed.' };
      }

      const sessionUser = data.user;
      setUser(sessionUser);
      localStorage.setItem('admin_user', JSON.stringify(sessionUser));
      
      router.push('/admin/dashboard');
      return { success: true };
    } catch {
      return { error: 'Failed to connect to authentication server.' };
    }
  };

  const logout = async () => {
    // Clear cookies by triggering a logout api or clear cookie client side
    // In our case we can clear it by setting it to empty in document.cookie or making a quick call
    try {
      // Set cookie to expire
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      setUser(null);
      localStorage.removeItem('admin_user');
      router.push('/admin/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
