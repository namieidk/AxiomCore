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
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadUserFromStorage(): { user: User | null; token: string | null } {
  if (typeof window === 'undefined') return { user: null, token: null };
  try {
    const saved = localStorage.getItem('user_session') || localStorage.getItem('user');
    const token = localStorage.getItem('jwt_token');
    if (!saved) return { user: null, token: null };
    const parsed = JSON.parse(saved);
    return {
      user: {
        id: parsed.id || parsed.employeeId,
        name: parsed.name,
        role: parsed.role,
        department: parsed.department || 'General',
      },
      token,
    };
  } catch {
    localStorage.removeItem('user_session');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    localStorage.removeItem('jwt_token');
    return { user: null, token: null };
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => loadUserFromStorage().user);
  const [token, setToken] = useState<string | null>(() => loadUserFromStorage().token);

  const loading = false;

  const login = (userData: User, jwtToken: string) => {
    try {
      localStorage.setItem('user_session', JSON.stringify(userData));
      localStorage.setItem('user', JSON.stringify({
        employeeId: userData.id,
        name: userData.name,
        role: userData.role,
        department: userData.department,
      }));
      localStorage.setItem('user_role', userData.role.toUpperCase());
      localStorage.setItem('jwt_token', jwtToken);
      setUser(userData);
      setToken(jwtToken);
    } catch (e) {
      console.error('Failed to save session to localStorage', e);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user_session');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    localStorage.removeItem('jwt_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};