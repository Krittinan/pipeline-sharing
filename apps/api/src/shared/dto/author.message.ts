import { Expose } from 'class-transformer';

// ใช้เป็น nested type ผ่าน @Type() ใน ArticleMessage/CommentMessage
// (class-transformer สร้าง instance ให้เอง จึงไม่ต้องมี factory ของตัวเอง)
export class AuthorMessage {
  @Expose() id!: string;
  @Expose() username!: string;
  @Expose() name!: string;
  @Expose() avatarUrl!: string | null;
  @Expose() bio!: string | null;
}
