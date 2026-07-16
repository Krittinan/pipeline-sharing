import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * ใช้ ioredis ตรงๆ เพื่อรองรับทั้ง INCR (view count) และ cache แบบ JSON (feed)
 * ออกแบบให้ degrade ได้ถ้า redis ล่ม (ไม่ทำให้ request พัง)
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  readonly client: Redis;

  constructor() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    this.client = new Redis(url, {
      maxRetriesPerRequest: 2,
      enableOfflineQueue: false,
      lazyConnect: false,
    });
    this.client.on('error', (err) => this.logger.warn(`redis: ${err.message}`));
  }

  async incrViews(articleId: string): Promise<number> {
    return this.safe(() => this.client.incr(`article:views:${articleId}`), 0);
  }

  async getViews(articleId: string): Promise<number> {
    return this.safe(async () => {
      const v = await this.client.get(`article:views:${articleId}`);
      return this.toCount(v);
    }, 0);
  }

  async getViewsMany(ids: string[]): Promise<Record<string, number>> {
    if (ids.length === 0) return {};
    return this.safe(
      async () => {
        const vals = await this.client.mget(
          ids.map((id) => `article:views:${id}`),
        );
        const out: Record<string, number> = {};
        ids.forEach((id, i) => {
          out[id] = this.toCount(vals[i]);
        });
        return out;
      },
      Object.fromEntries(ids.map((id) => [id, 0])),
    );
  }

  private toCount(v: string | null): number {
    return v ? parseInt(v, 10) : 0;
  }

  async cacheGetJson<T>(key: string): Promise<T | null> {
    return this.safe(async () => {
      const v = await this.client.get(key);
      return v ? (JSON.parse(v) as T) : null;
    }, null);
  }

  async cacheSetJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await this.safe(async () => {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }, undefined);
  }

  async delByPattern(pattern: string): Promise<void> {
    await this.safe(async () => {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) await this.client.del(...keys);
    }, undefined);
  }

  /** รัน redis op แล้ว degrade เป็น fallback ถ้าล้มเหลว (กัน request พังเมื่อ redis ล่ม) */
  private async safe<T>(op: () => Promise<T>, fallback: T): Promise<T> {
    try {
      return await op();
    } catch {
      return fallback;
    }
  }

  onModuleDestroy(): void {
    this.client.disconnect();
  }
}
