import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserDto } from '@repo/shared';

interface AuthState {
  token: string | null;
  user: UserDto | null;
  hydrated: boolean;
  setAuth: (token: string, user: UserDto) => void;
  setUser: (user: UserDto) => void;
  setHydrated: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setAuth: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      setHydrated: (value) => set({ hydrated: value }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'medium-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
      // ใช้ action ผ่าน state ที่ persist ส่งมาให้ (ห้ามอ้าง useAuthStore ตรงๆ
      // เพราะ callback นี้รันตอน store ยังสร้างไม่เสร็จ -> TDZ error เงียบ)
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
