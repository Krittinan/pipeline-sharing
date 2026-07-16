'use client';

import Link from 'next/link';
import { Chip, type ChipProps } from '@mui/material';
import type { TagDto } from '@repo/shared';

/**
 * Chip ของ tag ที่ลิงก์ไปหน้า feed กรองด้วย tag นั้น
 * - ไม่ส่ง active: ใช้สไตล์ default (filled) — สำหรับแสดงเฉยๆ
 * - ส่ง active: ใช้เป็นตัวกรองที่เลือกได้ (filled+primary เมื่อถูกเลือก, ไม่งั้น outlined)
 */
export default function TagChip({
  tag,
  size,
  active,
}: Readonly<{
  tag: TagDto;
  size?: ChipProps['size'];
  active?: boolean;
}>) {
  const activeProps: Partial<Pick<ChipProps, 'variant' | 'color'>> =
    active === undefined
      ? {}
      : {
          variant: active ? 'filled' : 'outlined',
          color: active ? 'primary' : 'default',
        };

  return (
    <Chip
      label={tag.name}
      component={Link}
      href={`/?tag=${tag.slug}`}
      clickable
      size={size}
      {...activeProps}
    />
  );
}
