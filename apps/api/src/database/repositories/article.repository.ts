import { Injectable } from '@nestjs/common';
import { Article, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export const articleInclude = {
  author: true,
  tags: true,
  _count: { select: { likes: true, comments: true } },
} satisfies Prisma.ArticleInclude;

export type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: typeof articleInclude;
}>;

export interface ArticleFeedFilters {
  tag?: string;
  author?: string;
  search?: string;
  sort: 'latest' | 'popular';
  skip: number;
  take: number;
}

export interface ArticleCreateData {
  title: string;
  subtitle: string | null;
  content: string;
  excerpt: string;
  coverImageUrl: string | null;
  slug: string;
  authorId: string;
  tagIds: { id: string }[];
}

export interface ArticleUpdateData {
  title?: string;
  subtitle?: string | null;
  content?: string;
  excerpt?: string;
  coverImageUrl?: string | null;
  tagIds?: { id: string }[];
}

@Injectable()
export class ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  /* ---------------- queries ---------------- */

  findFeed(
    filters: ArticleFeedFilters,
  ): Promise<[ArticleWithRelations[], number]> {
    const where: Prisma.ArticleWhereInput = { published: true };
    if (filters.tag) where.tags = { some: { slug: filters.tag } };
    if (filters.author) where.author = { username: filters.author };
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { subtitle: { contains: filters.search, mode: 'insensitive' } },
        { excerpt: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.ArticleOrderByWithRelationInput[] =
      filters.sort === 'popular'
        ? [{ likes: { _count: 'desc' } }, { publishedAt: 'desc' }]
        : [{ publishedAt: 'desc' }];

    return this.prisma.$transaction([
      this.prisma.article.findMany({
        where,
        include: articleInclude,
        orderBy,
        skip: filters.skip,
        take: filters.take,
      }),
      this.prisma.article.count({ where }),
    ]);
  }

  findByAuthor(userId: string): Promise<ArticleWithRelations[]> {
    return this.prisma.article.findMany({
      where: { authorId: userId },
      include: articleInclude,
      orderBy: { updatedAt: 'desc' },
    });
  }

  findBySlug(slug: string): Promise<ArticleWithRelations | null> {
    return this.prisma.article.findUnique({
      where: { slug },
      include: articleInclude,
    });
  }

  findById(id: string): Promise<Article | null> {
    return this.prisma.article.findUnique({ where: { id } });
  }

  /* ---------------- mutations ---------------- */

  create(data: ArticleCreateData): Promise<ArticleWithRelations> {
    const { tagIds, ...scalars } = data;
    return this.prisma.article.create({
      data: { ...scalars, tags: { connect: tagIds } },
      include: articleInclude,
    });
  }

  update(id: string, patch: ArticleUpdateData): Promise<ArticleWithRelations> {
    // Prisma มองข้าม field ที่เป็น undefined อยู่แล้ว จึงส่ง scalar ตรงๆ ได้
    const { tagIds, ...scalars } = patch;
    const data: Prisma.ArticleUpdateInput = { ...scalars };
    if (tagIds !== undefined) data.tags = { set: tagIds };

    return this.prisma.article.update({
      where: { id },
      data,
      include: articleInclude,
    });
  }

  setPublished(
    id: string,
    published: boolean,
    publishedAt: Date | null,
  ): Promise<ArticleWithRelations> {
    return this.prisma.article.update({
      where: { id },
      data: { published, publishedAt },
      include: articleInclude,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.article.delete({ where: { id } });
  }
}
