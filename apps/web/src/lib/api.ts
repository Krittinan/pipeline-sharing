import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // token หมดอายุ/ไม่ถูกต้อง -> เคลียร์ session
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

/** ดึงข้อความ error จาก axios ให้อ่านง่าย */
export function getApiErrorMessage(error: unknown, fallback = 'เกิดข้อผิดพลาด'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(', ') : data.message;
    }
    return error.message;
  }
  return fallback;
}
