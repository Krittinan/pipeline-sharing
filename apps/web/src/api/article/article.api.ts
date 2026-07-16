import type {
  ArticleDto,
  ArticleFeedQuery,
  ArticleInput,
  Paginated,
} from '@repo/shared';
import { useQuery, type QueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

/**
 * invalidate ทุก query ที่ผูกกับบทความ (feed / บทความของฉัน / หน้าบทความ)
 * เรียกหลัง mutation ที่กระทบข้อมูลบทความ เพื่อให้ค่าที่แสดงตรงกันทุกหน้า
 */
export function invalidateArticleQueries(queryClient: QueryClient): void {
  for (const key of ['feed', 'my-articles', 'article']) {
    queryClient.invalidateQueries({ queryKey: [key] });
  }
}

/* ---------------- queries ---------------- */

export const fetchFeed = (params: ArticleFeedQuery = {}) =>
  api
    .get<Paginated<ArticleDto>>('/articles', { params })
    .then((r) => r.data);

export const fetchArticleBySlug = (slug: string) =>
  api.get<ArticleDto>(`/articles/${encodeURIComponent(slug)}`).then((r) => r.data);

export const fetchMyArticles = () =>
  api.get<ArticleDto[]>('/articles/me').then((r) => r.data);

/** บทความของฉัน — รวม queryKey ไว้ที่เดียว (ตรงกับ invalidateArticleQueries) */
export const useMyArticles = () =>
  useQuery({ queryKey: ['my-articles'], queryFn: fetchMyArticles });

/* ---------------- mutations ---------------- */

export const createArticle = (payload: ArticleInput) =>
  api.post<ArticleDto>('/articles', payload).then((r) => r.data);

export const updateArticle = (id: string, payload: Partial<ArticleInput>) =>
  api.patch<ArticleDto>(`/articles/${id}`, payload).then((r) => r.data);

export const publishArticle = (id: string) =>
  api.post<ArticleDto>(`/articles/${id}/publish`).then((r) => r.data);

export const unpublishArticle = (id: string) =>
  api.post<ArticleDto>(`/articles/${id}/unpublish`).then((r) => r.data);

export const deleteArticle = (id: string) =>
  api.delete<{ success: boolean }>(`/articles/${id}`).then((r) => r.data);

export const likeArticle = (id: string) =>
  api
    .post<{ liked: boolean; likeCount: number }>(`/articles/${id}/like`)
    .then((r) => r.data);

export const unlikeArticle = (id: string) =>
  api
    .delete<{ liked: boolean; likeCount: number }>(`/articles/${id}/like`)
    .then((r) => r.data);
