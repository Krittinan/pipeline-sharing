'use client';

import AuthGuard from '@/components/AuthGuard';
import ArticleEditorForm from '@/components/ArticleEditorForm';

export default function NewArticlePage() {
  return (
    <AuthGuard>
      <ArticleEditorForm />
    </AuthGuard>
  );
}
