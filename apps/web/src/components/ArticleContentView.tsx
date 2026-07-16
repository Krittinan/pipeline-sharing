'use client';

import { useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { Box } from '@mui/material';

export default function ArticleContentView({ html }: { html: string }) {
  const clean = useMemo(() => DOMPurify.sanitize(html), [html]);
  return (
    <Box
      className="article-content"
      sx={{ color: 'text.primary' }}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
