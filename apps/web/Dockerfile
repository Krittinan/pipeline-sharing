# build context = repo root
FROM node:22-bookworm-slim

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

# ---- install deps (cached by manifests) ----
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json packages/shared/
COPY apps/web/package.json apps/web/
RUN pnpm install

# ---- copy sources ----
COPY packages/shared packages/shared
COPY apps/web apps/web

# NEXT_PUBLIC_* ถูก bake ตอน build (browser-facing)
ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm --filter @repo/shared build \
  && pnpm --filter @repo/web build

WORKDIR /app/apps/web
ENV NODE_ENV=production
EXPOSE 3006
# ไม่รันเป็น root
USER node
CMD ["pnpm", "start"]
