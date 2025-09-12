# Repository Guidelines

## Project Structure & Module Organization

- App (Next.js App Router): `src/app/**` with locale-aware routes under `src/app/[locale]` and API routes under `src/app/api/**`.
- UI components: `src/components/**`; shared utilities: `src/lib/**`.
- Internationalization: `src/i18n/**` (locales: `tr`, `en`; default: `tr`).
- Styles: `src/app/globals.css`, plus scoped styles in `src/styles/**`.
- Tests: unit/integration co-located in `src/**/*.{test,spec}.{ts,tsx}`; E2E in `e2e/**`.
- Assets: `public/**`; Docs: `docs/**`; Storybook stories: `src/stories/**`.

## Architecture Overview

- App Router with React Server Components by default; client interactivity behind `"use client"`. Locale layout at `src/app/[locale]/layout.tsx`.
- i18n via `next-intl` using middleware (`src/middleware.ts`) for locale routing; messages loaded from `src/i18n/locales/*`.
- Data & state: React Query provider (`src/components/providers/query-provider.tsx`) for client caching; server route handlers in `src/app/api/**` (e.g., streaming CSV export).
- UI system: Tailwind + shadcn/ui + Radix primitives in `src/components/ui/**`; domain components in `src/components/{data,projects,layout}/**`.
- Integrations: WhatsApp webhook at `/api/webhooks/whatsapp` (signature verification placeholder, env-driven tokens).
- Developer experience: Storybook for isolated UI, Vitest/Playwright for tests, path alias `@/*` for imports.

## i18n Usage (next-intl)

- Strings live in `src/i18n/locales/{tr,en}.json`. Use dot-notation keys (e.g., `sidebar.dashboard`). Add to both files.
- Client components:
  ```tsx
  'use client'
  import { useTranslations } from 'next-intl'
  export function Label() {
    const t = useTranslations()
    return <span>{t('sidebar.dashboard')}</span>
  }
  ```
- Server components/handlers:
  ```tsx
  import { getTranslations } from 'next-intl/server'
  export default async function Page() {
    const t = await getTranslations()
    return <h1>{t('common.home')}</h1>
  }
  ```
- Default locale is Turkish (`tr`). See `src/i18n/config.ts` and `src/middleware.ts` for routing.

## Build, Test & Development Commands

- `npm run dev` — Start the local dev server (http://localhost:3000).
- `npm run build` / `npm start` — Production build and serve.
- `npm run lint` / `lint:fix` — Run ESLint (Next + TS rules) and autofix.
- `npm run format` / `format:check` — Prettier write/check.
- `npm run typecheck` — Strict TypeScript checks (no emit).
- `npm run test` / `test:watch` / `test:coverage` — Vitest unit tests.
- `npm run test:e2e` / `test:e2e:ui` — Playwright tests (spawns dev server).
- `npm run storybook` / `build-storybook` — Storybook; `npm run test:storybook` for story tests.

## Coding Style & Naming Conventions

- Language: TypeScript, React function components, Next.js 14.
- Formatting: Prettier (2 spaces, single quotes, no semicolons, width 80). Run `npm run format` before push.
- Linting: ESLint `next/core-web-vitals` with TypeScript.
- Filenames: kebab-case (e.g., `project-card.tsx`); tests: `*.test.tsx` beside code.
- Imports: use `@/*` path alias (see `tsconfig.json`).
- CSS: Tailwind + utilities (`tailwind.config.js`), global styles in `globals.css`.

## Testing Guidelines

- Frameworks: Vitest + Testing Library (`vitest.setup.ts` mocks Next.js, icons, etc.).
- Coverage: `npm run test:coverage` (no hard threshold; keep or increase).
- E2E: Playwright in `e2e/` (baseURL `http://localhost:3000`). Prefer data-testid for selectors.

## Commit & Pull Request Guidelines

- Conventional Commits enforced by commitlint + Husky.
  - Types: feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert
  - Example: `feat(projects): add template selector`
  - Header ≤ 72 chars, no trailing period; lower-case type/scope.
- Pre-commit runs lint-staged and `typecheck`. PRs should include:
  - Clear description, linked issue, and screenshots for UI changes.
  - Tests updated/added; i18n keys added to both `en.json` and `tr.json`.

## Security & Configuration

- Secrets in `.env.local` (e.g., Supabase/Redis/Postgres, Chromatic token). Never commit secrets.
- Prefer stubs/mocks in tests and stories; avoid network calls.

## Agent-Specific Notes

- Keep changes minimal and localized; follow existing patterns and naming.
- Co-locate tests with changes; update docs when behavior changes.
- Run `npm run lint` and `npm run typecheck` before opening a PR.
