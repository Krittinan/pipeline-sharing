import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../../shared/types';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleForm } from './dto/create-article.form';
import { UpdateArticleForm } from './dto/update-article.form';
import { QueryArticleForm } from './dto/query-article.form';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articles: ArticlesService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  feed(@Query() query: QueryArticleForm, @CurrentUser() user?: AuthUser) {
    return this.articles.feed(query, user?.id);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  mine(@CurrentUser() user: AuthUser) {
    return this.articles.findMine(user.id);
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard)
  bySlug(@Param('slug') slug: string, @CurrentUser() user?: AuthUser) {
    return this.articles.findBySlug(slug, user?.id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: AuthUser, @Body() form: CreateArticleForm) {
    return this.articles.create(user.id, form);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() form: UpdateArticleForm,
  ) {
    return this.articles.update(user.id, id, form);
  }

  @Post(':id/publish')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  publish(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.articles.setPublished(user.id, id, true);
  }

  @Post(':id/unpublish')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  unpublish(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.articles.setPublished(user.id, id, false);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.articles.remove(user.id, id);
  }

  @Post(':id/like')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  like(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.articles.like(user.id, id);
  }

  @Delete(':id/like')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  unlike(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.articles.unlike(user.id, id);
  }
}
