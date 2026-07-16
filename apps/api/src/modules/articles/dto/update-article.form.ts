import { PartialType } from '@nestjs/swagger';
import { CreateArticleForm } from './create-article.form';

export class UpdateArticleForm extends PartialType(CreateArticleForm) {}
