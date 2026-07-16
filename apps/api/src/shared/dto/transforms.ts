import { Transform } from 'class-transformer';

/** แปลงค่า Date -> ISO string (idempotent: ถ้าเป็น string อยู่แล้วปล่อยผ่าน) */
export const ToIsoDate = (): PropertyDecorator =>
  Transform(({ value }) =>
    value instanceof Date ? value.toISOString() : value,
  );
