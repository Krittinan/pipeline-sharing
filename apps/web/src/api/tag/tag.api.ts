import type { TagDto } from '@repo/shared';
import { api } from '@/lib/api';

export const fetchTags = () => api.get<TagDto[]>('/tags').then((r) => r.data);
