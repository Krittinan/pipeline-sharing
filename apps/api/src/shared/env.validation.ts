/**
 * ตรวจ env ที่จำเป็นตอน boot — ถ้าไม่ครบ/ไม่ปลอดภัย ให้แอปล้มทันที (fail fast)
 * แทนที่จะรันต่อด้วยค่า fallback ที่รู้กันทั่วไป
 */
const WEAK_SECRETS = new Set(['change-me-in-production-please', 'secret', 'changeme']);

export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const errors: string[] = [];

  const jwtSecret = config.JWT_SECRET;
  if (typeof jwtSecret !== 'string' || jwtSecret.length < 16) {
    errors.push('JWT_SECRET ต้องถูกตั้งค่าและยาวอย่างน้อย 16 ตัวอักษร');
  } else if (
    process.env.NODE_ENV === 'production' &&
    WEAK_SECRETS.has(jwtSecret)
  ) {
    errors.push('JWT_SECRET เป็นค่า default ที่ไม่ปลอดภัย — ตั้งค่าใหม่ก่อนขึ้น production');
  }

  if (typeof config.DATABASE_URL !== 'string' || !config.DATABASE_URL) {
    errors.push('DATABASE_URL ต้องถูกตั้งค่า');
  }

  if (errors.length > 0) {
    throw new Error(`ค่า environment ไม่ถูกต้อง:\n- ${errors.join('\n- ')}`);
  }

  return config;
}
