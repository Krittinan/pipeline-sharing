'use client';

import { useEffect } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          เกิดข้อผิดพลาด
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          ระบบมีปัญหาชั่วคราว ลองอีกครั้งได้เลย
        </Typography>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => reset()}>
            ลองใหม่
          </Button>
          <Button variant="outlined" href="/">
            กลับหน้าแรก
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
