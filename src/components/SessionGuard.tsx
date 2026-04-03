'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useAutoLogout } from '../hooks/useAutoLogout';

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const SessionGuard = ({ children, allowedRoles }: Props) => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { logout: autoLogout } = useAutoLogout();

  useEffect(() => {
    // CRITICAL: wait for AuthContext to finish reading localStorage
    // Without this check, it fires before user is loaded and always redirects
    if (loading) return;

    const role = user?.role?.toUpperCase() ?? localStorage.getItem('user_role');

    if (!role || !allowedRoles.map(r => r.toUpperCase()).includes(role)) {
      autoLogout();
    }
  }, [loading, user, allowedRoles, autoLogout]);

  // Show nothing while loading to prevent flash of redirect
  if (loading) return null;

  return <>{children}</>;
};