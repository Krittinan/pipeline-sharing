'use client';

import { Alert, Stack, Typography } from '@mui/material';
import type { ArticleDto } from '@repo/shared';
import ArticleCard from './ArticleCard';
import CenteredSpinner from './CenteredSpinner';

export default function ArticleList({
  articles,
  isLoading,
  isError,
  emptyText = 'ยังไม่มีบทความ',
  showStatus = false,
}: {
  articles?: ArticleDto[];
  isLoading?: boolean;
  isError?: boolean;
  emptyText?: string;
  showStatus?: boolean;
}) {
  if (isLoading) {
    return <CenteredSpinner py={6} />;
  }

  if (isError) {
    return <Alert severity="error">โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง</Alert>;
  }

  if (!articles || articles.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
        {emptyText}
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {articles.map((a) => (
        <ArticleCard key={a.id} article={a} showStatus={showStatus} />
      ))}
    </Stack>
  );
}
