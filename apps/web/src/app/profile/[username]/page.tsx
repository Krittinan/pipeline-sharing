'use client';

import { use } from 'react';
import { Box, Container, Divider, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchFeed } from '@/api/article';
import { fetchProfile } from '@/api/user';
import { formatDate } from '@/lib/date';
import ArticleList from '@/components/ArticleList';
import CenteredSpinner from '@/components/CenteredSpinner';
import PageError from '@/components/PageError';
import UserAvatar from '@/components/UserAvatar';

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  const profileQuery = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchProfile(username),
    retry: false,
  });

  // ทั้งสอง query ขึ้นกับ username เท่านั้น จึงยิงขนานกันได้ (ไม่ต้อง gate)
  const articlesQuery = useQuery({
    queryKey: ['feed', { author: username }],
    queryFn: () => fetchFeed({ author: username, pageSize: 50 }),
  });

  if (profileQuery.isLoading) {
    return <CenteredSpinner />;
  }

  if (profileQuery.isError || !profileQuery.data) {
    return <PageError message="ไม่พบผู้ใช้นี้" />;
  }

  const { user, articleCount } = profileQuery.data;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 4 }}>
        <UserAvatar name={user.name} src={user.avatarUrl} sx={{ width: 84, height: 84 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {user.name}
          </Typography>
          <Typography color="text.secondary">@{user.username}</Typography>
          {user.bio && <Typography sx={{ mt: 1 }}>{user.bio}</Typography>}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            เข้าร่วมเมื่อ {formatDate(user.createdAt)} · {articleCount} บทความ
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <ArticleList
        articles={articlesQuery.data?.items}
        isLoading={articlesQuery.isLoading}
        isError={articlesQuery.isError}
        emptyText="ยังไม่มีบทความที่เผยแพร่"
      />
    </Container>
  );
}
