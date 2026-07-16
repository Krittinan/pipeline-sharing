import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * ปล่อยผ่านทั้ง user ที่ล็อกอินและ guest
 * ถ้ามี token ที่ถูกต้อง -> req.user ถูก set, ถ้าไม่มี -> undefined (ไม่ throw)
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(_err: unknown, user: TUser): TUser {
    return user || (undefined as TUser);
  }
}
