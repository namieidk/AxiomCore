'use client';

import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  role: string;
  department: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Run once at module load, outside React — no effect needed ──
function loadUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null; // SSR guard
  try {
    const saved = localStorage.getItem('user_session') || localStorage.getItem('user');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return {
      id: parsed.id || parsed.employeeId,
      name: parsed.name,
      role: parsed.role,
      department: parsed.department || 'General',
    };
  } catch {
    localStorage.removeItem('user_session');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize directly — no useEffect, no cascading renders
  const [user, setUser] = useState<User | null>(() => loadUserFromStorage());

  // loading is always false now because useState initializer is synchronous
  const loading = false;

  const login = (userData: User) => {
    try {
      localStorage.setItem('user_session', JSON.stringify(userData));
      localStorage.setItem('user', JSON.stringify({
        employeeId: userData.id,
        name: userData.name,
        role: userData.role,
        department: userData.department,
      }));
      localStorage.setItem('user_role', userData.role.toUpperCase());
      setUser(userData);
    } catch (e) {
      console.error('Failed to save session to localStorage', e);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};