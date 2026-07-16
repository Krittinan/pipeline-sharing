import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const userWithArticleCount = {
  _count: { select: { articles: { where: { published: true } } } },
} satisfies Prisma.UserInclude;

export type UserWithArticleCount = Prisma.UserGetPayload<{
  include: typeof userWithArticleCount;
}>;

export interface ProfileUpdateData {
  name?: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByEmailOrUsername(email: string, username: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
  }

  findByUsernameWithArticleCount(
    username: string,
  ): Promise<UserWithArticleCount | null> {
    return this.prisma.user.findUnique({
      where: { username },
      include: userWithArticleCount,
    });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  update(id: string, patch: ProfileUpdateData): Promise<User> {
    // Prisma มองข้าม field ที่เป็น undefined อยู่แล้ว จึงส่ง patch ตรงๆ ได้
    return this.prisma.user.update({ where: { id }, data: patch });
  }
}
