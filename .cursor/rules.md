---
description: Apply these rules when creating the project
globs:
alwaysApply: true
---

## Project Overview

- **Type:** Multi-tenant web platform for construction project tracking
- **Description:** A multi-tenant platform enabling construction companies to log daily task progress across division hierarchies, view finished versus unfinished tasks, and gain real-time analytics.
- **Primary Goal:** Provide insights into project progress by simplifying daily task logging and offering customizable analytics dashboards.

## Project Structure

### Framework-Specific Routing

- **Directory Rules:**
  - `Next.js 14+`: Enforce App Router with `app/[route]/page.tsx` and nested folders for layouts and route groups.
  - Example 1: "Next.js 14 (App Router)" → `app/dashboard/tasks/page.tsx`, `app/auth/login/page.tsx` conventions
  - Example 2: "Next.js (Pages Router)" → **Not used** (Pages Router disabled)
  - Example 3: "React Router 6" → **Not used**

### Core Directories

- **Versioned Structure:**
  - `app/` → Next.js 14 App Router pages, layouts, route groups
  - `app/api/` → Next.js 14 Route Handlers for all CRUD and integrations
  - `components/` → Shared React UI components (ShadCN, MUI fallback)
  - `lib/` → Utilities (Supabase client, Drizzle ORM instance, Redis client)
  - `drizzle/` → drizzle-kit migrations and config
  - `public/` → Static assets (icons, images)
  - `styles/` → Global Tailwind CSS and theme config
  - `tests/` → Vitest unit tests and Playwright E2E tests
  - `.storybook/` → Storybook stories and configuration

### Key Files

- **Stack-Versioned Patterns:**
  - `app/layout.tsx` → Next.js 14 root layout with ShadCN UI provider and i18n wrapper
  - `app/page.tsx` → Landing/home page
  - `app/dashboard/layout.tsx` → Dashboard nested layout for authenticated flows
  - `app/auth/login/page.tsx` → Login page using Supabase Auth OTP & Server Actions
  - `app/auth/signup/page.tsx` → Tenant self-service signup page
  - `app/api/tasks/route.ts` → Tasks CRUD route handler with cursor-based pagination
  - `app/api/checkins/route.ts` → Check-ins & incident reporting handler (with file uploads)
  - `app/api/approvals/route.ts` → Two-level approval workflow handler
  - `drizzle.config.ts` → Drizzle ORM configuration for Postgres + ltree
  - `tailwind.config.ts` → Tailwind CSS settings (12-column grid, theme overrides)
  - `next.config.js` → Next.js config (`experimental.appDir: true`, `i18n` for Turkish)

## Tech Stack Rules

- next@14+: App Router required, no `pages/` directory, enable React Server Components & Server Actions
- react@18: Leverage RSCs where possible, use functional components and hooks
- typescript@5.x: `strict` mode, no `any`, prefer `unknown` for external data
- eslint@8.x & prettier@2.x: Use `eslint-config-next`, `prettier-plugin-tailwindcss`, run on pre-commit
- drizzle-kit@latest: Store migrations in `drizzle/migrations`, enforce versioned schema changes
- supabase-js@2.x: Use for Auth (OTP) and Storage (photos), configure RLS for tenant isolation
- @tanstack/react-query@4.x: Client-side data fetching & caching, SSR prefetch in server components
- dnd-kit@latest: Implement drag & drop for hierarchy management
- react-aria-components@latest: Use for all custom interactive primitives (menus, dialogs)
- zod@latest & react-hook-form@latest: Centralize form validation via Zod schemas and RHF resolver
- @tanstack/virtual or react-virtuoso@latest: Virtualize large lists/grids
- Vercel CLI@latest: Deploy App Router projects with environment isolation per tenant
- Redis@latest: Cache analytics results, set TTL aligned with freshness requirements
- Lighthouse CI@latest: Define performance/accessibility budgets, block PR merges on regressions
- Sentry@latest & @sentry/nextjs: Capture client and server errors with source maps
- vitest@latest: Unit tests in `tests/unit`, target ≥90% coverage
- playwright@latest: E2E tests in `tests/e2e` for critical user flows
- storybook@latest & Chromatic/Percy: Visual regression tests for UI components
- whatsapp-business-api@latest: Use webhooks for incoming messages and notifications

## PRD Compliance

- "Completed projects and their data retained for at least 7 years with append-only audit logs.": Implement immutable audit log tables, retention policies in Supabase and Drizzle migrations.
- "Turkish Language will be enabled at launch.": Configure Next.js `i18n` with `locales: ['tr', 'en']`, default `en`.
- "GDPR/KVKK compliance.": Provide cookie consent banner, data-export and deletion endpoints, document data flows.

## App Flow Integration

- Auth Flow → `app/auth/login/page.tsx` uses Next.js Server Actions calling Supabase Auth OTP, then redirects to `/dashboard`.
- Tenant Signup → `app/auth/signup/page.tsx` server action creates tenant and admin user with role assignment.
- Dashboard Flow → `app/dashboard/tasks/page.tsx` uses React Query for paginated tasks (cursor-based ltree + LexoRank).
- Check-in Flow → `app/dashboard/checkins/page.tsx` client component for photo upload hitting `app/api/checkins/route.ts` storing in Supabase Storage.
- Approval Workflow → `app/api/approvals/route.ts` server action to advance check-ins through subcontractor and prime contractor approvals, triggers email and WhatsApp notifications.

## Best Practices

- Next.js 14+
  - Enforce App Router only; avoid `pages/` directory
  - Use Layouts for shared UI and RSC streaming
  - Favor server components for data loading
- TypeScript
  - Enable `strict` flags; avoid `any`
  - Use Zod schemas for runtime validation and type inference
- ESLint & Prettier
  - Integrate with Husky and lint-staged
  - Use Tailwind-specific formatting plugin
- React
  - Use hooks and memoization (useMemo/useCallback)
  - Leverage RSCs and client-only boundary components
- ShadCN UI & MUI
  - Primary: ShadCN Tailwind primitives
  - Fallback: MUI TreeGrid with theme override
- dnd-kit
  - Use accessibility sensors; minimal re-renders in sortable lists
- react-aria-components
  - Use for ARIA attributes; ensure WCAG AA compliance
- Zod & React Hook Form
  - Centralize schema definitions; validate both client and server
- React Query
  - Use stale-while-revalidate patterns; prefetch in server components
- Virtualization
  - Virtualize large node trees; avoid rendering hidden branches
- Route Handlers & Server Actions
  - Keep handlers focused; use streaming for large payloads
- Vercel
  - Preview deployments per PR; environment variables via Vercel dashboard
- Drizzle ORM
  - Write type-safe queries; track migration history in source control
- Supabase
  - Enforce RLS for tenant isolation; use functions for audit logging
- Redis
  - Cache frequent analytics queries; define TTLs
- Lighthouse CI
  - Block PR merges on performance or accessibility regressions
- Sentry
  - Capture both client and server-side errors; configure release tracking
- Vitest & Playwright
  - Cover critical business logic and user flows
- Storybook & Chromatic/Percy
  - Capture visual snapshots for key components
- WhatsApp Business API
  - Implement idempotent webhooks; handle rate limits gracefully

## Rules

- Derive folder and file patterns **directly** from techStackDoc versions.
- If Next.js 14 App Router: enforce `app/` directory with nested route folders; **do not** include `pages/`.
- Mirror the App Router logic for any additional frameworks if introduced.
- Cursor-based APIs must implement Postgres ltree + LexoRank consistently in route handlers.
- All styling via Tailwind CSS; CSS modules or SCSS are **disallowed**.
- All server-side code in TypeScript strict mode; no `any` or non-null assertions.
- Use Supabase RLS and database functions for tenant isolation and audit logging.

## Rules Metrics

Before starting project development, create a metrics file in the root called `cursor_metrics.md`.

### Instructions:

- Each time a cursor rule is used as context, update `cursor_metrics.md`.
- Use the following format for `cursor_metrics.md:`

  # Rules Metrics

  ## Usage

  The number of times rules is used as context
  - rule-name.mdc: 5
  - another-rule.mdc: 2
  - ...other rules
