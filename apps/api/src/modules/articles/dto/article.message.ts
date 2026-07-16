import { Expose, Type } from 'class-transformer';
import { AuthorMessage } from '../../../shared/dto/author.message';
import { TagMessage } from '../../../shared/dto/tag.message';
import { ToIsoDate } from '../../../shared/dto/transforms';
import { toMessage } from '../../../shared/dto/serialize';

export class ArticleMessage {
  @Expose() id!: string;
  @Expose() slug!: string;
  @Expose() title!: string;
  @Expose() subtitle!: string | null;
  @Expose() content!: string;
  @Expose() excerpt!: string | null;
  @Expose() coverImageUrl!: string | null;
  @Expose() published!: boolean;

  @Expose()
  @ToIsoDate()
  publishedAt!: string | null;

  @Expose()
  @ToIsoDate()
  createdAt!: string;

  @Expose()
  @ToIsoDate()
  updatedAt!: string;

  @Expose()
  @Type(() => AuthorMessage)
  author!: AuthorMessage;

  @Expose()
  @Type(() => TagMessage)
  tags!: TagMessage[];

  @Expose() likeCount!: number;
  @Expose() liked!: boolean;
  @Expose() commentCount!: number;
  @Expose() views!: number;

  static from(source: unknown): ArticleMessage {
    return toMessage(ArticleMessage, source);
  }
}
