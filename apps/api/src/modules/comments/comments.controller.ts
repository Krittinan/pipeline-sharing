import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../../shared/types';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentForm } from './dto/create-comment.form';

@ApiTags('comments')
@Controller()
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Get('articles/:id/comments')
  list(@Param('id') articleId: string) {
    return this.comments.list(articleId);
  }

  @Post('articles/:id/comments')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: AuthUser,
    @Param('id') articleId: string,
    @Body() form: CreateCommentForm,
  ) {
    return this.comments.create(user.id, articleId, form);
  }

  @Delete('comments/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() user: AuthUser, @Param('id') commentId: string) {
    return this.comments.remove(user.id, commentId);
  }
}
