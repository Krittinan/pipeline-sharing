# Medium Clone — Monorepo

แพลตฟอร์มเขียน/เผยแพร่บทความสไตล์ Medium: สมัคร → ล็อกอิน → เขียนบทความ (rich text) → publish → คนอื่นอ่าน กด like และคอมเมนต์ได้ พร้อม tag และหน้าโปรไฟล์ผู้เขียน

## Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | Next.js 16 (App Router) · MUI 9 · Zustand · React Query · TipTap |
| Backend | NestJS 11 · Prisma 7 · PostgreSQL |
| Gateway | Kong (DB-less / declarative) |
| Cache/Rate-limit | Redis |
| Monorepo | pnpm workspaces |

```
apps/web    → Next.js  (http://localhost:3006)
apps/api    → NestJS   (http://localhost:3005, Swagger /docs)
Kong        → gateway  (http://localhost:8000/api → api)
packages/shared → types + zod schemas ที่ใช้ร่วมกัน
```

## Prerequisites
- Node >= 20, pnpm 10, Docker

## เริ่มใช้งาน (Local dev)

```bash
# 1. ติดตั้ง dependencies
pnpm install

# 2. เตรียม env (แก้ค่าได้ตามต้องการ)
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 3. รัน infra (postgres + redis + kong) ใน Docker
pnpm infra:up

# 4. สร้าง schema + ข้อมูลตัวอย่าง
pnpm db:migrate
pnpm db:seed

# 5. รันแอป (api + web) บน host
pnpm dev
```

เปิด http://localhost:3006 — บัญชีตัวอย่างจาก seed:
`ada@example.com` / `password123`

## Production (ทุก service ใน Docker)

```bash
pnpm prod:up      # build + run: postgres, redis, kong, api, web
pnpm prod:logs
pnpm prod:down
```

เปิด http://localhost:3006 (web) — เรียก API ผ่าน Kong ที่ http://localhost:8000/api

## Scripts หลัก (root)
- `pnpm infra:up` / `infra:down` — docker infra สำหรับ local
- `pnpm db:migrate` / `db:seed` / `db:reset`
- `pnpm dev` — รัน api + web พร้อมกัน (hot reload)
- `pnpm build` — build ทั้ง monorepo
- `pnpm prod:up` — รันทุก service ผ่าน docker-compose.prod.yml
