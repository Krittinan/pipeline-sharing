import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentMessage } from './dto/comment.message';
import type { CreateCommentForm } from './dto/create-comment.form';
import { CommentRepository } from '../../database/repositories/comment.repository';
import { ArticleRepository } from '../../database/repositories/article.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly comments: CommentRepository,
    private readonly articles: ArticleRepository,
  ) {}

  async list(articleId: string): Promise<CommentMessage[]> {
    await this.ensureArticle(articleId);
    const comments = await this.comments.findByArticle(articleId);
    return CommentMessage.fromList(comments);
  }

  async create(
    userId: string,
    articleId: string,
    form: CreateCommentForm,
  ): Promise<CommentMessage> {
    await this.ensureArticle(articleId);
    const comment = await this.comments.create({
      body: form.body,
      articleId,
      authorId: userId,
    });
    return CommentMessage.from(comment);
  }

  async remove(
    userId: string,
    commentId: string,
  ): Promise<{ success: boolean }> {
    const comment = await this.comments.findById(commentId);
    if (!comment) throw new NotFoundException('ไม่พบคอมเมนต์');
    if (comment.authorId !== userId) {
      throw new ForbiddenException('ลบได้เฉพาะคอมเมนต์ของตัวเอง');
    }
    await this.comments.delete(commentId);
    return { success: true };
  }

  private async ensureArticle(articleId: string): Promise<void> {
    const article = await this.articles.findById(articleId);
    if (!article) throw new NotFoundException('ไม่พบบทความ');
  }
}
