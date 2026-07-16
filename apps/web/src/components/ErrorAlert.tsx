'use client';

import { Alert } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { getApiErrorMessage } from '@/lib/api';

/**
 * แสดง error จาก API เป็น Alert — คืน null เมื่อไม่มี error
 * รับได้ทั้ง error object (axios/Error) และข้อความ string ที่เตรียมไว้แล้ว
 */
export default function ErrorAlert({
  error,
  fallback,
  sx = { mb: 2 },
}: {
  error: unknown;
  fallback?: string;
  sx?: SxProps<Theme>;
}) {
  if (!error) return null;
  const message =
    typeof error === 'string' ? error : getApiErrorMessage(error, fallback);
  return (
    <Alert severity="error" sx={sx}>
      {message}
    </Alert>
  );
}
