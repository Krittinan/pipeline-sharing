# CLAUDE.md

> Rules are grouped by scope: **Global** (whole repo) · **Frontend** (`apps/web`) · **Backend** (`apps/api`).
> Put each new rule under the section that matches where it applies.

## Global — applies to the whole repo

### Response language

Always respond in Thai.

### No guessing — verify from the source first

Never guess, assume, or answer from memory. Always find and check the real, verifiable source before giving any information (read the actual file/code, run the command, query the registry, cite the real advisory). If you cannot verify, say so plainly and state where you will check — do not cover it up with a guess.

### Merge imports from the same module

Never import from the same module/path in more than one statement — always merge them into a single import, to avoid SonarQube `typescript:S3863` ("Imports from the same module should be merged"):

- ❌ `import { useMemo, useState } from "react";` then `import { ReactNode } from "react";`
- ✅ `import { useMemo, useState, ReactNode } from "react";`
- Type and value imports from the same module may be combined (e.g. `import { useMemo, type ReactNode } from "react";`).
- Applies to every module — third-party and internal paths alike; whenever writing or editing a file, check that no module is imported more than once.

### Always use barrel imports

Every module folder must expose a barrel `index.ts` that re-exports its public API, and all imports must go through the folder (the barrel), never the concrete file.

- Each module folder gets an `index.ts` with `export * from './<file>'` (e.g. `src/api/comment/index.ts` re-exports `./comment.api`).
- Import via the folder: `import { addComment } from '@/api/comment'` — **not** `@/api/comment/comment.api`.
- When adding a new file to a module, update that folder's `index.ts` so it stays importable through the barrel.

## Frontend — `apps/web` (Next.js / React)

### Component props must always be read-only

When writing or editing a React component, always declare the props type as read-only to avoid SonarQube `typescript:S6759` ("Mark the props of the component as read-only"):

- **inline type literal** → wrap with `Readonly<{ ... }>`, e.g. `function Foo({ a, b }: Readonly<{ a: string; b?: number }>)`
- **named type/interface** → wrap with `Readonly<Props>` at the usage site, or mark every field `readonly` in the type
- Applies to every component, whether a function component or props received via destructuring.

## Backend — `apps/api` (NestJS)

_No backend-specific rules yet — add them here as they come up._
