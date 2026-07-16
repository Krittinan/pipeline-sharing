'use client';

import { Chip } from '@mui/material';

/** ป้ายสถานะเผยแพร่/ฉบับร่างของบทความ */
export default function PublishStatusChip({ published }: { published: boolean }) {
  return (
    <Chip
      size="small"
      label={published ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
      color={published ? 'success' : 'default'}
      variant="outlined"
    />
  );
}
