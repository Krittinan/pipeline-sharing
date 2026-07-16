import { Injectable } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const commentWithAuthor = { author: true } satisfies Prisma.CommentInclude;

export type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: typeof commentWithAuthor;
}>;

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByArticle(articleId: string): Promise<CommentWithAuthor[]> {
    return this.prisma.comment.findMany({
      where: { articleId },
      include: commentWithAuthor,
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: {
    body: string;
    articleId: string;
    authorId: string;
  }): Promise<CommentWithAuthor> {
    return this.prisma.comment.create({
      data,
      include: commentWithAuthor,
    });
  }

  findById(id: string): Promise<Comment | null> {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({ where: { id } });
  }
}
