'use client';

import { TextField, type TextFieldProps } from '@mui/material';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = Omit<TextFieldProps, 'error' | 'helperText'> & {
  registration: UseFormRegisterReturn;
  error?: FieldError;
};

/** MUI TextField ที่ผูกกับ react-hook-form (จัดการ error/helperText ให้อัตโนมัติ) */
export default function FormTextField({ registration, error, ...props }: Props) {
  return (
    <TextField
      {...registration}
      {...props}
      error={!!error}
      helperText={error?.message}
    />
  );
}
