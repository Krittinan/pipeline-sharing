import { Global, Module } from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import { CommentRepository } from './comment.repository';
import { LikeRepository } from './like.repository';
import { TagRepository } from './tag.repository';
import { UserRepository } from './user.repository';

const repositories = [
  ArticleRepository,
  CommentRepository,
  LikeRepository,
  TagRepository,
  UserRepository,
];

/**
 * รวม repository ทุกตาราง (data-access layer) ไว้ที่เดียว
 * ตั้งเป็น @Global เพื่อให้ service ทุก module inject ได้โดยไม่ต้อง import ข้าม module
 */
@Global()
@Module({
  providers: repositories,
  exports: repositories,
})
export class RepositoriesModule {}
