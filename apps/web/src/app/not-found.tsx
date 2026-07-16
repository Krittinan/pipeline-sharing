import { Box, Button, Container, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
          404
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          ไม่พบหน้าที่คุณกำลังมองหา
        </Typography>
        <Button variant="contained" href="/">
          กลับหน้าแรก
        </Button>
      </Box>
    </Container>
  );
}
