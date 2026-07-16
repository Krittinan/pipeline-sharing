'use client';

import { use } from 'react';
import AuthGuard from '@/components/AuthGuard';
import ArticleEditorForm from '@/components/ArticleEditorForm';
import CenteredSpinner from '@/components/CenteredSpinner';
import PageError from '@/components/PageError';
import { useMyArticles } from '@/api/article';

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <AuthGuard>
      <EditInner id={id} />
    </AuthGuard>
  );
}

function EditInner({ id }: { id: string }) {
  const { data, isLoading, isError } = useMyArticles();

  if (isLoading) {
    return <CenteredSpinner />;
  }

  const article = data?.find((a) => a.id === id);

  if (isError || !article) {
    return <PageError message="ไม่พบบทความ หรือคุณไม่มีสิทธิ์แก้ไข" />;
  }

  return <ArticleEditorForm initial={article} />;
}
