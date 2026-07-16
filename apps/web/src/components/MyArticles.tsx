'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ArticleDto } from '@repo/shared';
import {
  deleteArticle,
  invalidateArticleQueries,
  publishArticle,
  unpublishArticle,
  useMyArticles,
} from '@/api/article';
import { formatDate } from '@/lib/date';
import CenteredSpinner from './CenteredSpinner';
import ErrorAlert from './ErrorAlert';
import PublishStatusChip from './PublishStatusChip';

export default function MyArticles() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useMyArticles();

  const invalidate = () => invalidateArticleQueries(queryClient);

  const publishMut = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      published ? unpublishArticle(id) : publishArticle(id),
    onSuccess: invalidate,
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: invalidate,
  });

  let content: ReactNode;
  if (isLoading) {
    content = <CenteredSpinner py={6} />;
  } else if (isError) {
    content = (
      <Alert severity="error" sx={{ my: 4 }}>
        โหลดบทความไม่สำเร็จ ลองรีเฟรชอีกครั้ง
      </Alert>
    );
  } else if (!data || data.length === 0) {
    content = (
      <Typography color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
        ยังไม่มีบทความ — เริ่มเขียนบทความแรกของคุณได้เลย
      </Typography>
    );
  } else {
    content = (
      <Stack divider={<Divider />} spacing={0}>
        {data.map((a: ArticleDto) => (
          <Stack
            key={a.id}
            direction="row"
            spacing={2}
            sx={{ py: 2, alignItems: 'center' }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: 'center' }}>
                <PublishStatusChip published={a.published} />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(a.updatedAt)} · ❤ {a.likeCount} · 💬 {a.commentCount} · 👁 {a.views}
                </Typography>
              </Stack>
              <Typography
                component={a.published ? Link : 'span'}
                href={a.published ? `/article/${encodeURIComponent(a.slug)}` : undefined}
                variant="h6"
                sx={{
                  fontWeight: 700,
                  textDecoration: 'none',
                  color: 'text.primary',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {a.title}
              </Typography>
            </Box>

            <Button
              size="small"
              variant="text"
              onClick={() =>
                publishMut.mutate({ id: a.id, published: a.published })
              }
              disabled={publishMut.isPending && publishMut.variables?.id === a.id}
            >
              {a.published ? 'ยกเลิกเผยแพร่' : 'เผยแพร่'}
            </Button>
            <IconButton component={Link} href={`/editor/${a.id}`} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                if (confirm(`ลบบทความ "${a.title}"?`)) deleteMut.mutate(a.id);
              }}
              disabled={deleteMut.isPending && deleteMut.variables === a.id}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">บทความของฉัน</Typography>
        <Button variant="contained" component={Link} href="/editor">
          เขียนบทความใหม่
        </Button>
      </Stack>

      <ErrorAlert
        error={publishMut.error ?? deleteMut.error}
        fallback="ดำเนินการไม่สำเร็จ"
      />

      {content}
    </Container>
  );
}
