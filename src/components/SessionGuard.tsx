'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const SessionGuard = ({ children, allowedRoles }: Props) => {
  const router            = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    const role = user.role.toUpperCase();
    if (!allowedRoles.map(r => r.toUpperCase()).includes(role)) {
      router.push('/login');
    }
  }, [loading, user, allowedRoles, router]);

  // On server or while auth is still resolving — render nothing
  if (typeof window === 'undefined' || loading) return null;

  return <>{children}</>;
};