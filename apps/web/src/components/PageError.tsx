'use client';

import { Alert, Container } from '@mui/material';

/** ข้อความ error แบบเต็มหน้า (ใช้ตอนโหลดข้อมูลหลักของเพจไม่สำเร็จ) */
export default function PageError({ message }: { message: string }) {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Alert severity="error">{message}</Alert>
    </Container>
  );
}
