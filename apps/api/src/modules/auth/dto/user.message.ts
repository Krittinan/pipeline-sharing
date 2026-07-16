import { Exclude, Expose } from 'class-transformer';
import { ToIsoDate } from '../../../shared/dto/transforms';
import { toMessage } from '../../../shared/dto/serialize';

export class UserMessage {
  @Expose() id!: string;
  @Expose() email!: string;
  @Expose() username!: string;
  @Expose() name!: string;
  @Expose() bio!: string | null;
  @Expose() avatarUrl!: string | null;

  @Expose()
  @ToIsoDate()
  createdAt!: string;

  // กันหลุดแม้จะไม่ถูก expose อยู่แล้ว
  @Exclude()
  password?: string;

  static from(source: unknown): UserMessage {
    return toMessage(UserMessage, source);
  }
}
