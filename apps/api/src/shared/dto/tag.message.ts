import { Expose } from 'class-transformer';
import { toMessageList } from './serialize';

export class TagMessage {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() slug!: string;
  @Expose() articleCount?: number;

  static fromList(sources: unknown[]): TagMessage[] {
    return toMessageList(TagMessage, sources);
  }
}
