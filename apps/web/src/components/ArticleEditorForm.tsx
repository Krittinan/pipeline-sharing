'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  articleInputSchema,
  type ArticleDto,
  type ArticleInput,
} from '@repo/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createArticle,
  invalidateArticleQueries,
  publishArticle,
  unpublishArticle,
  updateArticle,
} from '@/api/article';
import { getApiErrorMessage } from '@/lib/api';
import ErrorAlert from './ErrorAlert';
import FormTextField from './FormTextField';
import TiptapEditor from './TiptapEditor';

// เข้มขึ้นกว่า schema กลาง: content ของ TipTap ที่ว่างจะเป็น "<p></p>"
// จึงเช็คว่ามีข้อความจริงหลังตัด tag
const editorSchema = articleInputSchema.extend({
  content: z
    .string()
    .refine(
      (v) => v.replace(/<[^>]*>/g, '').trim().length > 0,
      'กรุณาเขียนเนื้อหา',
    ),
});
type FormValues = z.infer<typeof editorSchema>;

interface SaveOptions {
  publish?: boolean;
}

export default function ArticleEditorForm({ initial }: { initial?: ArticleDto }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState('');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      title: initial?.title ?? '',
      subtitle: initial?.subtitle ?? '',
      content: initial?.content ?? '',
      coverImageUrl: initial?.coverImageUrl ?? '',
      tags: initial?.tags?.map((t) => t.name) ?? [],
    },
  });

  const toPayload = (v: FormValues): ArticleInput => ({
    title: v.title.trim(),
    subtitle: v.subtitle?.trim() || undefined,
    content: v.content,
    coverImageUrl: v.coverImageUrl?.trim() || undefined,
    tags: v.tags ?? [],
  });

  const saveMutation = useMutation({
    mutationFn: async ({ values, opts }: { values: FormValues; opts: SaveOptions }) => {
      let article = initial
        ? await updateArticle(initial.id, toPayload(values))
        : await createArticle(toPayload(values));
      if (opts.publish && !article.published) {
        article = await publishArticle(article.id);
      }
      return { article, opts };
    },
    onSuccess: ({ article, opts }) => {
      invalidateArticleQueries(queryClient);
      if (opts.publish) router.push(`/article/${encodeURIComponent(article.slug)}`);
      else router.push('/me');
    },
    onError: (e) => setApiError(getApiErrorMessage(e)),
  });

  const unpublishMutation = useMutation({
    mutationFn: () => unpublishArticle(initial!.id),
    onSuccess: () => {
      invalidateArticleQueries(queryClient);
      router.push('/me');
    },
    onError: (e) => setApiError(getApiErrorMessage(e)),
  });

  const submit = (opts: SaveOptions) =>
    handleSubmit((values) => {
      setApiError('');
      saveMutation.mutate({ values, opts });
    });

  const busy = saveMutation.isPending || unpublishMutation.isPending;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack
        direction="row"
        sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Box sx={{ color: 'text.secondary' }}>
          {initial
            ? initial.published
              ? 'กำลังแก้ไข (เผยแพร่แล้ว)'
              : 'กำลังแก้ไขฉบับร่าง'
            : 'เขียนบทความใหม่'}
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={submit({})} disabled={busy}>
            บันทึกฉบับร่าง
          </Button>
          {initial?.published && (
            <Button
              color="warning"
              variant="outlined"
              onClick={() => {
                setApiError('');
                unpublishMutation.mutate();
              }}
              disabled={busy}
            >
              ยกเลิกเผยแพร่
            </Button>
          )}
          <Button variant="contained" onClick={submit({ publish: true })} disabled={busy}>
            เผยแพร่
          </Button>
        </Stack>
      </Stack>

      <ErrorAlert error={apiError} />

      <FormTextField
        placeholder="หัวข้อบทความ"
        registration={register('title')}
        error={errors.title}
        fullWidth
        variant="standard"
        slotProps={{
          input: {
            disableUnderline: true,
            sx: { fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Georgia, serif' },
          },
        }}
        sx={{ mb: 1 }}
      />
      <FormTextField
        placeholder="คำโปรย (subtitle)"
        registration={register('subtitle')}
        error={errors.subtitle}
        fullWidth
        variant="standard"
        slotProps={{
          input: {
            disableUnderline: true,
            sx: { fontSize: '1.2rem', color: 'text.secondary' },
          },
        }}
        sx={{ mb: 3 }}
      />

      <Controller
        control={control}
        name="content"
        render={({ field }) => (
          <TiptapEditor value={field.value} onChange={field.onChange} />
        )}
      />
      <ErrorAlert error={errors.content?.message} sx={{ mt: 1 }} />

      <Stack spacing={2} sx={{ mt: 3 }}>
        <FormTextField
          label="URL รูปปก (ไม่บังคับ)"
          registration={register('coverImageUrl')}
          error={errors.coverImageUrl}
          fullWidth
          placeholder="https://…"
        />
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TextField
              label="แท็ก (คั่นด้วยจุลภาค, สูงสุด 5)"
              value={(field.value ?? []).join(', ')}
              onChange={(e) =>
                field.onChange(
                  e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .slice(0, 5),
                )
              }
              fullWidth
              placeholder="Programming, Life"
              error={!!errors.tags}
              helperText={
                Array.isArray(errors.tags)
                  ? 'แท็กไม่ถูกต้อง'
                  : errors.tags?.message
              }
            />
          )}
        />
      </Stack>
    </Container>
  );
}
