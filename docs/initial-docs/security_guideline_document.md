# Full-Court Control Pro: Step-by-Step Implementation Plan

This plan is organized into logical phases with clear deliverables, tasks, and embedded security controls (Security by Design, Least Privilege, Defense in Depth, etc.).

## 1. Project Initialization & Governance

### 1.1. Repository & Tooling Setup

- Initialize monorepo (e.g., TurboRepo) or single Next.js repo.
- Configure TypeScript (strict), ESLint, Prettier, Husky + lint-staged.
- Commit lockfiles (`package-lock.json` / `yarn.lock`).
- Store secrets in Vault / AWS Secrets Manager; inject via environment variables.

### 1.2. Access & Permissions

- Apply principle of least privilege: grant read/write only to required team members.
- Enforce branch protection: code review, status checks (ESLint, type checks).
- Define issue/PR templates including security checklists.

### 1.3. CI/CD Baseline

- Configure GitHub Actions / Vercel Integration.
- Install Lighthouse CI for performance budgets.
- Integrate SCA (e.g., Dependabot) for dependency scanning.

## 2. Infrastructure & Supabase Onboarding

### 2.1. Supabase Project Creation

- Enable Auth, Postgres, Storage.
- Configure strong password policies (Argon2, bcrypt).
- Enforce TLS for all connections.
- Restrict Supabase service role key usage: use only in secure backend.

### 2.2. Database Extensions & Roles

- Enable `ltree` extension for hierarchical queries.
- Create dedicated DB roles with limited privileges:\
  • `app_read` (SELECT)\
  • `app_write` (INSERT/UPDATE/DELETE on owned tables)\
  • `app_admin` (DDL only during migrations)

### 2.3. Redis Cache Deployment

- Deploy Redis with AUTH token.
- Enforce ACLs: separate user for caching, with `read`/`write` only.
- Enable TLS at Redis layer.

## 3. Schema & Data Modeling

### 3.1. Tenancy & Hierarchies

- **Tenants** table: id (UUID), name, settings (JSONB), created_at.
- All core tables include `tenant_id` FK, indexed.
- Division templates + actual hierarchies stored using `ltree`.
- Use LexoRank or ULIDs for task ordering.

### 3.2. User & Role Management

- **Users** table: id, email, password_hash, created_at.
- **Roles** table: role_id, name, permissions (bitmask/JSON).
- **User_Tenant_Roles** mapping table.
- Append-only audit tables for any CRUD on critical entities.

### 3.3. Task & Subcontractor Entities

- Task: id, parent_path (`ltree`), weight, status, assigned_division_id, tenant_id, metadata.
- Subcontractors: id, name, type (enum), contact_info (encrypted JSON), tenant_id.

### 3.4. Field Reports & Media

- Reports: id, reporter_user_id, type (check-in/incident), text (sanitized), timestamp.
- Photos: store in Supabase Storage; generate pre-signed URLs; restrict lifetime.

## 4. Authentication & Authorization

### 4.1. Supabase Auth with Email OTP

- Enable OTP email flow; secure SMTP creds in Secrets Manager.
- Configure rate limiting & CAPTCHA (prevent enumeration/brute-force).
- Enforce multi-factor (TOTP) for Admin & SysAdmin roles.

### 4.2. Session & Token Security

- Use short-lived JWTs + rotating refresh tokens.
- Validate `exp`, `aud`, `iss`.
- Store JWT in Secure, HttpOnly, SameSite=Strict cookies.

### 4.3. RBAC Enforcement

- Implement middleware on Route Handlers:\
  • Validate JWT & extract `tenant_id`, `roles`.\
  • Check required permission bit per endpoint.
- Deny by default; log unauthorized attempts.

## 5. Backend Development (Next.js Route Handlers & Server Actions)

### 5.1. Core API Modules

- **Tenants API:** CRUD with tenant-scoped middleware.
- **Divisions API:** manage templates + instantiations using `ltree`.
- **Tasks API:** keyset-paginated endpoints (LexoRank cursor).
- **Subcontractors API:** strict input validation with Zod.
- **Reports API:** handle file uploads via pre-signed URLs; validate MIME/type/size.

### 5.2. Notifications Service

- Abstract service to push In-App, Email (via SendGrid), WhatsApp (via official API).
- Queue messages (BullMQ on Redis) with retry and dead-letter handling.
- Validate and sanitize message templates.

### 5.3. Approval Workflow

- Two-level workflow engine: store state transitions; enforce participants can only act on their level.
- Emit domain events for notifications and audit logging.

### 5.4. Security Controls

- Apply rate limiting and IP whitelists on sensitive endpoints.
- Validate redirect URIs against a whitelist.
- Use parameterized queries via Drizzle ORM to prevent SQL injection.
- Central error handler: sanitize error messages; report to Sentry without PII.

## 6. Frontend Development (Next.js App Router)

### 6.1. Layout & Theming

- Mobile-first design with Tailwind + ShadCN UI.
- Fallback to MUI TreeGrid with lazy loading & virtualization (`@tanstack/virtual`).
 - Internationalization setup (next-intl) with Turkish (default) and English locales.

### 6.2. Auth Flows & Protected Routes

- Implement Supabase client on Server Components; wrap pages in AuthProvider.
- Client-side guard: redirect unauthenticated.
- Role-based UI toggles (React Context + feature flags).

### 6.3. Forms & Validation

- Use React Hook Form + Zod resolvers.
- Sanitize all inputs; encode outputs in JSX.

### 6.4. Data Fetching & Caching

- React Query with stale-while-revalidate.
- Invalidate caches on mutation; use suspense/loading fallbacks.

### 6.5. Drag & Drop & Virtualization

- dnd-kit for hierarchy reordering; update LexoRank on drop.
- Virtualize large lists/grids to maintain performance.

### 6.6. Accessibility & Security Headers

- Leverage `react-aria-components`.
- Add meta tags & HTTP headers via `next.config.js`:\
  • Content-Security-Policy\
  • Strict-Transport-Security\
  • X-Content-Type-Options\
  • X-Frame-Options\
  • Referrer-Policy

## 7. Analytics & Reporting

- Real-time dashboards with aggregated queries (materialized views + Redis caching).
- Customizable filters; keyset pagination on lists.
- CSV export via streaming endpoint; enforce tenant scope.
- Audit log viewer (read-only) for SysAdmins.

## 8. Testing & Quality Assurance

### 8.1. Unit & Integration Tests

- Vitest for utilities, Zod schemas, Drizzle queries.
- Mock Supabase and Redis clients.

### 8.2. End-to-End Tests

- Playwright for critical user flows: signup, login, task CRUD, approval.
- Test multi-tenant isolation.

### 8.3. Visual Regression

- Storybook + Chromatic/Percy for key components and screens.

### 8.4. Performance & Accessibility

- Automated Lighthouse CI checks (score >= 90).
- Axe-based accessibility audits (WCAG AA compliance).

## 9. Observability & Monitoring

- Sentry for error tracking; redact PII in events.
- Application logs to structured JSON (stdout), aggregated in ELK/Datadog.
- Redis & Postgres health checks (alert on slow queries >200 ms).
- Uptime monitoring (e.g., Pingdom).

## 10. Security Hardening & Compliance

- Harden Next.js server config; disable X-Powered-By.
- Enforce HTTPS and HSTS on Vercel.
- Rotate keys/secrets quarterly.
- Penetration test plan (3rd-party assessment).
- Data retention policy enforcement (archival + secure deletion after 7 years).
- GDPR/KVKK compliance: consent logs, data subject request endpoints.

## 11. Deployment & Rollout

- Use Vercel preview deployments per branch.
- Blue/Green or Canary for production.
- Automate schema migrations via `drizzle-kit` in CI/CD.
- Post-deployment smoke tests.

## 12. Documentation & Handoff

- Maintain developer docs in `/docs`: architecture diagrams, API specs (OpenAPI), env var definitions.
- User guides for Admin & Field Workers.
- Security runbook: incident response, key rotation, backup restore.

**By following this phased approach, we ensure Ful-Court Control Pro is built securely, resiliently, and with scalability for multi-tenant enterprise use.**
