import type { CommentDto } from '@repo/shared';
import { api } from '@/lib/api';

export const fetchComments = (articleId: string) =>
  api.get<CommentDto[]>(`/articles/${articleId}/comments`).then((r) => r.data);

export const addComment = (articleId: string, body: string) =>
  api
    .post<CommentDto>(`/articles/${articleId}/comments`, { body })
    .then((r) => r.data);

export const deleteComment = (commentId: string) =>
  api
    .delete<{ success: boolean }>(`/comments/${commentId}`)
    .then((r) => r.data);
