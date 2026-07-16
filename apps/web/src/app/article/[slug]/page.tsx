'use client';

import { use } from 'react';
import Link from 'next/link';
import { Box, Button, Container, Divider, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useQuery } from '@tanstack/react-query';
import { fetchArticleBySlug } from '@/api/article';
import { formatDate } from '@/lib/date';
import { useAuth } from '@/lib/useAuth';
import ArticleContentView from '@/components/ArticleContentView';
import CenteredSpinner from '@/components/CenteredSpinner';
import CoverImage from '@/components/CoverImage';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';
import PageError from '@/components/PageError';
import TagChip from '@/components/TagChip';
import UserAvatar from '@/components/UserAvatar';

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { user } = useAuth();

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchArticleBySlug(slug),
    retry: false,
  });

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (isError || !article) {
    return <PageError message="ไม่พบบทความนี้" />;
  }

  const isAuthor = user?.id === article.author.id;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5 }}>
        {article.title}
      </Typography>
      {article.subtitle && (
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 400 }}>
          {article.subtitle}
        </Typography>
      )}

      <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        <Box component={Link} href={`/profile/${article.author.username}`} sx={{ display: 'flex' }}>
          <UserAvatar name={article.author.name} src={article.author.avatarUrl} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            component={Link}
            href={`/profile/${article.author.username}`}
            sx={{ fontWeight: 600, textDecoration: 'none', color: 'text.primary' }}
          >
            {article.author.name}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ color: 'text.secondary', alignItems: 'center' }}>
            <Typography variant="body2">
              {formatDate(article.publishedAt ?? article.createdAt)}
            </Typography>
            <Typography variant="body2">·</Typography>
            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">{article.views}</Typography>
          </Stack>
        </Box>
        {isAuthor && (
          <Button
            component={Link}
            href={`/editor/${article.id}`}
            startIcon={<EditIcon />}
            size="small"
            variant="outlined"
          >
            แก้ไข
          </Button>
        )}
      </Stack>

      {article.coverImageUrl && (
        <CoverImage
          src={article.coverImageUrl}
          sx={{ width: '100%', borderRadius: 2, mb: 3, maxHeight: 440, objectFit: 'cover' }}
        />
      )}

      <ArticleContentView html={article.content} />

      <Stack direction="row" spacing={1} sx={{ mt: 4, flexWrap: 'wrap', rowGap: 1 }}>
        {article.tags.map((t) => (
          <TagChip key={t.id} tag={t} />
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      <LikeButton
        articleId={article.id}
        initialLiked={article.liked}
        initialCount={article.likeCount}
      />

      <CommentSection articleId={article.id} />
    </Container>
  );
}
