'use client';

import AuthGuard from '@/components/AuthGuard';
import MyArticles from '@/components/MyArticles';

export default function MyArticlesPage() {
  return (
    <AuthGuard>
      <MyArticles />
    </AuthGuard>
  );
}
