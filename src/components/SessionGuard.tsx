'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const SessionGuard = ({ children, allowedRoles }: Props) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    const role = user?.role?.toUpperCase() ?? localStorage.getItem('user_role');

    if (!role || !allowedRoles.map(r => r.toUpperCase()).includes(role)) {
      router.push('/login');
    }
  }, [loading, user, allowedRoles, router]);

  if (loading) return null;

  return <>{children}</>;
};