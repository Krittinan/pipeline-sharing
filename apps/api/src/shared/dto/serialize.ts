import { ClassConstructor, plainToInstance } from 'class-transformer';

const options = { excludeExtraneousValues: true };

/** แปลง plain object -> message DTO โดยตัด field ที่ไม่ได้ @Expose ทิ้ง */
export function toMessage<T>(cls: ClassConstructor<T>, source: unknown): T {
  return plainToInstance(cls, source, options);
}

/** เวอร์ชัน list ของ toMessage */
export function toMessageList<T>(
  cls: ClassConstructor<T>,
  sources: unknown[],
): T[] {
  return plainToInstance(cls, sources, options);
}
