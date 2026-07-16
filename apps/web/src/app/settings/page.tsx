'use client';

import { Alert, Box, Button, Container, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { profileUpdateSchema, type ProfileUpdateInput } from '@repo/shared';
import AuthGuard from '@/components/AuthGuard';
import ErrorAlert from '@/components/ErrorAlert';
import FormTextField from '@/components/FormTextField';
import UserAvatar from '@/components/UserAvatar';
import { updateProfile } from '@/api/user';
import { useAuth } from '@/lib/useAuth';

function SettingsInner() {
  const { user, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    values: {
      name: user?.name ?? '',
      bio: user?.bio ?? '',
      avatarUrl: user?.avatarUrl ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (u) => setUser(u),
  });

  const avatarPreview = watch('avatarUrl');

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        ตั้งค่าโปรไฟล์
      </Typography>

      {mutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          บันทึกโปรไฟล์เรียบร้อยแล้ว
        </Alert>
      )}
      <ErrorAlert error={mutation.error} />

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <UserAvatar
            name={user?.name}
            src={avatarPreview}
            sx={{ width: 64, height: 64 }}
          />
          <Typography color="text.secondary">
            @{user?.username}
          </Typography>
        </Stack>

        <FormTextField
          label="ชื่อที่แสดง"
          registration={register('name')}
          error={errors.name}
          fullWidth
        />
        <FormTextField
          label="แนะนำตัว (bio)"
          registration={register('bio')}
          error={errors.bio}
          fullWidth
          multiline
          minRows={3}
        />
        <FormTextField
          label="URL รูปโปรไฟล์"
          registration={register('avatarUrl')}
          error={errors.avatarUrl}
          fullWidth
          placeholder="https://…"
        />

        <Box>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            บันทึก
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsInner />
    </AuthGuard>
  );
}
