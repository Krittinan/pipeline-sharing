'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@repo/shared';
import { loginRequest } from '@/api/auth';
import { useAuthMutation } from '@/lib/useAuth';
import AuthCard from '@/components/AuthCard';
import FormTextField from '@/components/FormTextField';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useAuthMutation(loginRequest);

  return (
    <AuthCard
      title="เข้าสู่ระบบ"
      subtitle="ยินดีต้อนรับกลับมา"
      error={mutation.error}
      pending={mutation.isPending}
      submitLabel="เข้าสู่ระบบ"
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
      footer={
        <>
          ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิก</Link>
        </>
      }
    >
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
