import type { AuthResponse, LoginInput, RegisterInput } from '@repo/shared';
import { api } from '@/lib/api';

export const loginRequest = (input: LoginInput) =>
  api.post<AuthResponse>('/auth/login', input).then((r) => r.data);

export const registerRequest = (input: RegisterInput) =>
  api.post<AuthResponse>('/auth/register', input).then((r) => r.data);
