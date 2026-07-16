import { Injectable } from '@nestjs/common';
import { TagMessage } from '../../shared/dto/tag.message';
import { TagRepository } from '../../database/repositories/tag.repository';

@Injectable()
export class TagsService {
  constructor(private readonly tags: TagRepository) {}

  async popular(): Promise<TagMessage[]> {
    const tags = await this.tags.findAllWithPublishedCount();

    const ranked = tags
      .map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        articleCount: t._count.articles,
      }))
      .filter((t) => t.articleCount > 0)
      .sort((a, b) => b.articleCount - a.articleCount)
      .slice(0, 20);

    return TagMessage.fromList(ranked);
  }
}
