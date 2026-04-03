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
    if (loading) return;

    const role = user?.role?.toUpperCase() ?? localStorage.getItem('user_role');

    if (!role || !allowedRoles.map(r => r.toUpperCase()).includes(role)) {
      autoLogout();
    }
  }, [loading, user, allowedRoles, autoLogout]);

  if (loading) return null;

  return <>{children}</>;
};