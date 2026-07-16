'use client';

import { Box, CircularProgress } from '@mui/material';

/** สปินเนอร์กลางจอสำหรับ loading state */
export default function CenteredSpinner({ py = 10 }: { py?: number }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py }}>
      <CircularProgress />
    </Box>
  );
}
