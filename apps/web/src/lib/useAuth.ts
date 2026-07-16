'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import type { AuthResponse } from '@repo/shared';
import { useAuthStore } from '@/stores/authStore';

/** wrapper รอบ auth store ที่ปลอดภัยกับ SSR hydration */
export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    // localStorage hydrate เสร็จตั้งแต่ตอน import (synchronous) — การันตีธงหลัง mount
    if (!useAuthStore.getState().hydrated) {
      useAuthStore.getState().setHydrated(true);
    }
  }, []);

  return {
    token,
    user,
    setAuth,
    setUser,
    logout,
    ready: mounted && hydrated,
    isAuthenticated: !!token,
  };
}

/** mutation ร่วมของ login/register: เก็บ token+user แล้วพาไปหน้าแรก */
export function useAuthMutation<TInput>(
  request: (input: TInput) => Promise<AuthResponse>,
) {
  const router = useRouter();
  const { setAuth } = useAuth();
  return useMutation({
    mutationFn: request,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push('/');
    },
  });
}
