import { Injectable } from '@nestjs/common';
import { Like } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(articleId: string, userId: string): Promise<void> {
    await this.prisma.like.upsert({
      where: { articleId_userId: { articleId, userId } },
      update: {},
      create: { articleId, userId },
    });
  }

  async delete(articleId: string, userId: string): Promise<void> {
    await this.prisma.like.deleteMany({ where: { articleId, userId } });
  }

  countByArticle(articleId: string): Promise<number> {
    return this.prisma.like.count({ where: { articleId } });
  }

  find(articleId: string, userId: string): Promise<Like | null> {
    return this.prisma.like.findUnique({
      where: { articleId_userId: { articleId, userId } },
    });
  }

  async findLikedArticleIds(
    userId: string,
    articleIds: string[],
  ): Promise<string[]> {
    const likes = await this.prisma.like.findMany({
      where: { userId, articleId: { in: articleIds } },
      select: { articleId: true },
    });
    return likes.map((l) => l.articleId);
  }
}
