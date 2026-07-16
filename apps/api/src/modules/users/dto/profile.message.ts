import { Expose, Type } from 'class-transformer';
import { AuthorMessage } from '../../../shared/dto/author.message';
import { ToIsoDate } from '../../../shared/dto/transforms';
import { toMessage } from '../../../shared/dto/serialize';

// = AuthorMessage + วันที่เข้าร่วม (ตรงกับ AuthorDto & { createdAt } ฝั่ง web)
export class ProfileUserMessage extends AuthorMessage {
  @Expose()
  @ToIsoDate()
  createdAt!: string;
}

export class ProfileMessage {
  @Expose()
  @Type(() => ProfileUserMessage)
  user!: ProfileUserMessage;

  @Expose() articleCount!: number;

  static from(source: unknown): ProfileMessage {
    return toMessage(ProfileMessage, source);
  }
}
