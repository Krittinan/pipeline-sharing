'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

/**
 * รูปปกบทความ — ซ่อนตัวเองอัตโนมัติเมื่อ URL โหลดไม่สำเร็จ
 * (กันไอคอนรูปแตกกรณีผู้ใช้ใส่ URL รูปที่ใช้ไม่ได้)
 */
export default function CoverImage({
  src,
  alt = '',
  sx,
}: {
  src: string;
  alt?: string;
  sx?: SxProps<Theme>;
}) {
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={() => setError(true)}
      sx={sx}
    />
  );
}
