import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const tagWithCount = {
  _count: { select: { articles: { where: { published: true } } } },
} satisfies Prisma.TagInclude;

export type TagWithPublishedCount = Prisma.TagGetPayload<{
  include: typeof tagWithCount;
}>;

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllWithPublishedCount(): Promise<TagWithPublishedCount[]> {
    return this.prisma.tag.findMany({ include: tagWithCount });
  }

  upsertBySlug(name: string, slug: string): Promise<{ id: string }> {
    return this.prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
      select: { id: true },
    });
  }
}
