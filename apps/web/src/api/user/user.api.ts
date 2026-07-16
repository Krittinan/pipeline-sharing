import type { ProfileDto, UserDto } from '@repo/shared';
import { api } from '@/lib/api';

export const fetchProfile = (username: string) =>
  api
    .get<ProfileDto>(`/users/${encodeURIComponent(username)}`)
    .then((r) => r.data);

export const updateProfile = (payload: {
  name?: string;
  bio?: string;
  avatarUrl?: string;
}) => api.patch<UserDto>('/users/me', payload).then((r) => r.data);
