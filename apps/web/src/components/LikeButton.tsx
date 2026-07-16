'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  invalidateArticleQueries,
  likeArticle,
  unlikeArticle,
} from '@/api/article';
import { useAuth } from '@/lib/useAuth';

export default function LikeButton({
  articleId,
  initialLiked,
  initialCount,
}: {
  articleId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const mutation = useMutation({
    mutationFn: () => (liked ? unlikeArticle(articleId) : likeArticle(articleId)),
    onSuccess: (data) => {
      setLiked(data.liked);
      setCount(data.likeCount);
      // sync ค่าที่แสดงบน feed/หน้าบทความอื่นๆ ให้ตรงกัน
      invalidateArticleQueries(queryClient);
    },
  });

  const onClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    mutation.mutate();
  };

  return (
    <Button
      onClick={onClick}
      disabled={mutation.isPending}
      color={liked ? 'primary' : 'inherit'}
      startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      sx={{ color: liked ? 'primary.main' : 'text.secondary' }}
    >
      {count}
    </Button>
  );
}
