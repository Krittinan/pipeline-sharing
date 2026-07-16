import { Expose, Type } from 'class-transformer';
import { UserMessage } from './user.message';
import { toMessage } from '../../../shared/dto/serialize';

export class AuthMessage {
  @Expose() token!: string;

  @Expose()
  @Type(() => UserMessage)
  user!: UserMessage;

  static from(token: string, user: unknown): AuthMessage {
    return toMessage(AuthMessage, { token, user });
  }
}
