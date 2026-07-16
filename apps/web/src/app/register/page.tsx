'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@repo/shared';
import { registerRequest } from '@/api/auth';
import { useAuthMutation } from '@/lib/useAuth';
import AuthCard from '@/components/AuthCard';
import FormTextField from '@/components/FormTextField';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', username: '', name: '', password: '' },
  });

  const mutation = useAuthMutation(registerRequest);

  return (
    <AuthCard
      title="สมัครสมาชิก"
      subtitle="เริ่มต้นเขียนและแบ่งปันเรื่องราวของคุณ"
      error={mutation.error}
      pending={mutation.isPending}
      submitLabel="สมัครสมาชิก"
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
      footer={
        <>
          มีบัญชีอยู่แล้ว? <Link href="/login">เข้าสู่ระบบ</Link>
        </>
      }
    >
      <FormTextField
        label="ชื่อที่แสดง"
        registration={register('name')}
        error={errors.name}
        fullWidth
      />
      <FormTextField
        label="username"
        registration={register('username')}
        error={errors.username}
        fullWidth
      />
      <FormTextField
        label="อีเมล"
        type="email"
        registration={register('email')}
        error={errors.email}
        fullWidth
      />
      <FormTextField
        label="รหัสผ่าน"
        type="password"
        registration={register('password')}
        error={errors.password}
        fullWidth
      />
    </AuthCard>
  );
}
