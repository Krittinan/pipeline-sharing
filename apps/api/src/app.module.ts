import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './shared/env.validation';
import { PrismaModule } from './database/prisma/prisma.module';
import { RepositoriesModule } from './database/repositories/repositories.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { CommentsModule } from './modules/comments/comments.module';
import { TagsModule } from './modules/tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    PrismaModule,
    RepositoriesModule,
    RedisModule,
    AuthModule,
    UsersModule,
    ArticlesModule,
    CommentsModule,
    TagsModule,
  ],
})
export class AppModule {}
