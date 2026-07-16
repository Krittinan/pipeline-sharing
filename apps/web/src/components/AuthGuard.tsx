'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import CenteredSpinner from './CenteredSpinner';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { ready, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAuthenticated) router.replace('/login');
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated) {
    return <CenteredSpinner />;
  }

  return <>{children}</>;
}
