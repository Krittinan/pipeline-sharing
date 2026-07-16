import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article } from '@prisma/client';
import type { Paginated } from '@repo/shared';
import { RedisService } from '../../redis/redis.service';
import {
  makeExcerpt,
  randomSuffix,
  sanitizeHtml,
  slugify,
} from '../../shared/utils/text.util';
import { ArticleMessage } from './dto/article.message';
import type { CreateArticleForm } from './dto/create-article.form';
import type { UpdateArticleForm } from './dto/update-article.form';
import type { QueryArticleForm } from './dto/query-article.form';
import {
  ArticleUpdateData,
  ArticleWithRelations,
  ArticleRepository,
} from '../../database/repositories/article.repository';
import { LikeRepository } from '../../database/repositories/like.repository';
import { TagRepository } from '../../database/repositories/tag.repository';

const FEED_CACHE_TTL = 15;

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articles: ArticleRepository,
    private readonly likes: LikeRepository,
    private readonly tags: TagRepository,
    private readonly redis: RedisService,
  ) {}

  /* ---------------- queries ---------------- */

  async feed(
    query: QueryArticleForm,
    currentUserId?: string,
  ): Promise<Paginated<ArticleMessage>> {
    // page/pageSize ผ่าน ValidationPipe (@Min/@Max) มาแล้ว เหลือแค่ใส่ default
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const sort = query.sort ?? 'latest';

    // cache เฉพาะ guest (liked เป็น per-user)
    const cacheKey = currentUserId
      ? null
      : `feed:${JSON.stringify({
          page,
          pageSize,
          sort,
          tag: query.tag,
          author: query.author,
          search: query.search,
        })}`;
    if (cacheKey) {
      const cached =
        await this.redis.cacheGetJson<Paginated<ArticleMessage>>(cacheKey);
      if (cached) return cached;
    }

    const [items, total] = await this.articles.findFeed({
      tag: query.tag,
      author: query.author,
      search: query.search,
      sort,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const result: Paginated<ArticleMessage> = {
      items: await this.serializeList(items, currentUserId),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };

    if (cacheKey) await this.redis.cacheSetJson(cacheKey, result, FEED_CACHE_TTL);
    return result;
  }

  async findMine(userId: string): Promise<ArticleMessage[]> {
    const items = await this.articles.findByAuthor(userId);
    return this.serializeList(items, userId);
  }

  async findBySlug(
    slug: string,
    currentUserId?: string,
  ): Promise<ArticleMessage> {
    const article = await this.articles.findBySlug(slug);
    if (!article) throw new NotFoundException('ไม่พบบทความ');
    if (!article.published && article.authorId !== currentUserId) {
      throw new NotFoundException('ไม่พบบทความ');
    }
    const [views, liked] = await Promise.all([
      this.redis.incrViews(article.id),
      this.isLiked(article.id, currentUserId),
    ]);
    return this.serialize(article, views, liked);
  }

  /* ---------------- mutations ---------------- */

  async create(userId: string, form: CreateArticleForm): Promise<ArticleMessage> {
    const content = sanitizeHtml(form.content);
    const slug = `${slugify(form.title)}-${randomSuffix()}`;
    const tagIds = await this.resolveTags(form.tags);

    const article = await this.articles.create({
      title: form.title,
      subtitle: form.subtitle || null,
      content,
      excerpt: makeExcerpt(content),
      coverImageUrl: form.coverImageUrl || null,
      slug,
      authorId: userId,
      tagIds,
    });

    await this.redis.delByPattern('feed:*');
    return this.serialize(article, 0, false);
  }

  async update(
    userId: string,
    id: string,
    form: UpdateArticleForm,
  ): Promise<ArticleMessage> {
    await this.assertOwner(id, userId);

    const patch: ArticleUpdateData = {};
    if (form.title !== undefined) patch.title = form.title;
    if (form.subtitle !== undefined) patch.subtitle = form.subtitle || null;
    if (form.coverImageUrl !== undefined) {
      patch.coverImageUrl = form.coverImageUrl || null;
    }
    if (form.content !== undefined) {
      const content = sanitizeHtml(form.content);
      patch.content = content;
      patch.excerpt = makeExcerpt(content);
    }
    if (form.tags !== undefined) {
      patch.tagIds = await this.resolveTags(form.tags);
    }

    const article = await this.articles.update(id, patch);

    await this.redis.delByPattern('feed:*');
    return this.serializeOne(article, userId);
  }

  async setPublished(
    userId: string,
    id: string,
    published: boolean,
  ): Promise<ArticleMessage> {
    const existing = await this.assertOwner(id, userId);

    const publishedAt = published
      ? (existing.publishedAt ?? new Date())
      : existing.publishedAt;

    const article = await this.articles.setPublished(id, published, publishedAt);

    await this.redis.delByPattern('feed:*');
    return this.serializeOne(article, userId);
  }

  async remove(userId: string, id: string): Promise<{ success: boolean }> {
    await this.assertOwner(id, userId);
    await this.articles.delete(id);
    await this.redis.delByPattern('feed:*');
    return { success: true };
  }

  async like(
    userId: string,
    id: string,
  ): Promise<{ liked: boolean; likeCount: number }> {
    const article = await this.articles.findById(id);
    if (!article) throw new NotFoundException('ไม่พบบทความ');
    await this.likes.upsert(id, userId);
    return { liked: true, likeCount: await this.likes.countByArticle(id) };
  }

  async unlike(
    userId: string,
    id: string,
  ): Promise<{ liked: boolean; likeCount: number }> {
    await this.likes.delete(id, userId);
    return { liked: false, likeCount: await this.likes.countByArticle(id) };
  }

  /* ---------------- helpers ---------------- */

  private async assertOwner(id: string, userId: string): Promise<Article> {
    const article = await this.articles.findById(id);
    if (!article) throw new NotFoundException('ไม่พบบทความ');
    if (article.authorId !== userId) {
      throw new ForbiddenException('ไม่มีสิทธิ์แก้ไขบทความนี้');
    }
    return article;
  }

  private async resolveTags(names?: string[]): Promise<{ id: string }[]> {
    if (!names?.length) return [];
    const unique = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
    return Promise.all(
      unique.map((name) => this.tags.upsertBySlug(name, slugify(name))),
    );
  }

  private async isLiked(articleId: string, userId?: string): Promise<boolean> {
    if (!userId) return false;
    return !!(await this.likes.find(articleId, userId));
  }

  /** serialize บทความเดียว โดยดึง views + สถานะ liked ปัจจุบัน */
  private async serializeOne(
    article: ArticleWithRelations,
    userId?: string,
  ): Promise<ArticleMessage> {
    const [views, liked] = await Promise.all([
      this.redis.getViews(article.id),
      this.isLiked(article.id, userId),
    ]);
    return this.serialize(article, views, liked);
  }

  /** serialize รายการบทความ โดยดึง views + liked แบบ batch (ลด round-trip) */
  private async serializeList(
    items: ArticleWithRelations[],
    userId?: string,
  ): Promise<ArticleMessage[]> {
    const ids = items.map((i) => i.id);
    const views = await this.redis.getViewsMany(ids);
    const likedIds =
      userId && ids.length
        ? new Set(await this.likes.findLikedArticleIds(userId, ids))
        : new Set<string>();
    return items.map((a) =>
      this.serialize(a, views[a.id] ?? 0, likedIds.has(a.id)),
    );
  }

  private serialize(
    a: ArticleWithRelations,
    views: number,
    liked: boolean,
  ): ArticleMessage {
    // field ที่ไม่ได้ @Expose (เช่น _count, authorId) ถูก toMessage ตัดทิ้งให้อยู่แล้ว
    return ArticleMessage.from({
      ...a,
      likeCount: a._count.likes,
      commentCount: a._count.comments,
      liked,
      views,
    });
  }
}
