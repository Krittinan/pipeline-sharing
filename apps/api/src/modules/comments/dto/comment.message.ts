import { Expose, Type } from 'class-transformer';
import { AuthorMessage } from '../../../shared/dto/author.message';
import { ToIsoDate } from '../../../shared/dto/transforms';
import { toMessage, toMessageList } from '../../../shared/dto/serialize';

export class CommentMessage {
  @Expose() id!: string;
  @Expose() body!: string;

  @Expose()
  @ToIsoDate()
  createdAt!: string;

  @Expose()
  @Type(() => AuthorMessage)
  author!: AuthorMessage;

  static from(source: unknown): CommentMessage {
    return toMessage(CommentMessage, source);
  }

  static fromList(sources: unknown[]): CommentMessage[] {
    return toMessageList(CommentMessage, sources);
  }
}
