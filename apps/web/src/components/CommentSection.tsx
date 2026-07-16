'use client';

import Link from 'next/link';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentInputSchema, type CommentInput } from '@repo/shared';
import { addComment, fetchComments } from '@/api/comment';
import { useAuth } from '@/lib/useAuth';
import { timeAgo } from '@/lib/date';
import ErrorAlert from './ErrorAlert';
import FormTextField from './FormTextField';
import UserAvatar from './UserAvatar';

export default function CommentSection({ articleId }: { articleId: string }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const commentsKey = ['comments', articleId];

  const { data: comments, isLoading } = useQuery({
    queryKey: commentsKey,
    queryFn: () => fetchComments(articleId),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentInput>({
    resolver: zodResolver(commentInputSchema),
    defaultValues: { body: '' },
  });

  const mutation = useMutation({
    mutationFn: (input: CommentInput) => addComment(articleId, input.body),
    onSuccess: () => {
      reset({ body: '' });
      queryClient.invalidateQueries({ queryKey: commentsKey });
    },
  });

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        ความคิดเห็น ({comments?.length ?? 0})
      </Typography>

      {isAuthenticated ? (
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          sx={{ mb: 4 }}
        >
          <FormTextField
            registration={register('body')}
            error={errors.body}
            placeholder="แสดงความคิดเห็น…"
            fullWidth
            multiline
            minRows={2}
          />
          <ErrorAlert
            error={mutation.error}
            fallback="ส่งความคิดเห็นไม่สำเร็จ"
            sx={{ mt: 1 }}
          />
          <Box sx={{ mt: 1, textAlign: 'right' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isPending}
            >
              ส่งความคิดเห็น
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          <Link href="/login">เข้าสู่ระบบ</Link> เพื่อแสดงความคิดเห็น
        </Typography>
      )}

      <Divider sx={{ mb: 2 }} />

      {isLoading ? (
        <Typography color="text.secondary">กำลังโหลด…</Typography>
      ) : comments && comments.length > 0 ? (
        <Stack spacing={3}>
          {comments.map((c) => (
            <Box key={c.id}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 0.5, alignItems: 'center' }}>
                <UserAvatar
                  name={c.author.name}
                  src={c.author.avatarUrl}
                  sx={{ width: 32, height: 32 }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {c.author.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {timeAgo(c.createdAt)}
                  </Typography>
                </Box>
              </Stack>
              <Typography sx={{ pl: 5.5, whiteSpace: 'pre-wrap' }}>
                {c.body}
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography color="text.secondary">ยังไม่มีความคิดเห็น</Typography>
      )}
    </Box>
  );
}
