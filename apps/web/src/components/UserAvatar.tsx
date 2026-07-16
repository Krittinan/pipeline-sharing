'use client';

import { Avatar } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

/** Avatar ที่ fallback เป็นตัวอักษรแรกของชื่อเมื่อไม่มีรูป */
export default function UserAvatar({
  name,
  src,
  sx,
}: {
  name?: string;
  src?: string | null;
  sx?: SxProps<Theme>;
}) {
  return (
    <Avatar src={src || undefined} sx={sx}>
      {name?.[0]?.toUpperCase()}
    </Avatar>
  );
}
