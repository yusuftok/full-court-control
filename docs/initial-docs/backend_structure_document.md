# Backend Structure Document for Full-Court Control Pro

## 1. Backend Architecture

The backend for Full-Court Control Pro is built around a serverless, edge-enabled approach powered by Supabase and Next.js. Key aspects:

- **Edge Functions + BFF (Backend-for-Frontend)**
  - Business logic lives in Supabase Edge Functions (Node.js + TypeScript).
  - Next.js Route Handlers on Vercel serve as a thin BFF layer for orchestrating requests and handling authentication tokens.

- **Design Patterns & Frameworks**
  - Modular service layers: separate modules for authentication, tenancy, tasks, check-ins, notifications, analytics.
  - Drizzle ORM for type-safe database access and migrations (`drizzle-kit`).
  - Cursor-based pagination with Postgres ltree and LexoRank for ordered hierarchies.

- **Scalability**
  - Serverless Edge Functions auto-scale on demand.
  - Supabase Postgres scales vertically and horizontally with connection pooling.
  - Redis caching layer for frequently accessed queries.

- **Maintainability**
  - Clear separation of concerns per module.
  - Strict TypeScript ensures type safety end-to-end.
  - Zod schemas validate all incoming payloads.

- **Performance**
  - Edge caching of responses at Vercel’s CDN.
  - Keyset pagination reduces large offset queries.
  - Virtualized data fetching on the frontend (`@tanstack/virtual`).

## 2. Database Management

- **Database Technology**
  - SQL: PostgreSQL hosted by Supabase.

- **ORM & Migrations**
  - Drizzle ORM for writing queries and mapping results.
  - `drizzle-kit` manages versioned SQL migrations.

- **Multi-tenant Data Isolation**
  - Each table includes an `organization_id` (tenant) column.
  - Row-Level Security (RLS) policies enforce scoping by `organization_id`.
  - Simple `organizations` and `memberships` tables manage tenant metadata and user roles.

- **Storage**
  - Supabase Storage for photo attachments (JPEG, PNG, HEIC), with client-side compression before upload.

- **Data Management Practices**
  - Append-only `audit_logs` for every create/update/delete—retained for 7 years.
  - Optimistic concurrency control using versioning fields.
  - Regular backup & point-in-time restore via Supabase’s backup tools.

## 3. Database Schema

### Human-Readable Overview

• **organizations**: tenants, with settings and language preferences. • **users**: staff and field workers, linked to `memberships` and `roles`. • **memberships**: join table between `organizations` and `users`, assigns a `role_id`. • **roles**: predefined roles (admin, field*worker, subcontractor*... etc.). • **division_templates**: reusable templates defining a hierarchical division structure. • **divisions**: instantiated divisions per organization, using Postgres ltree to track path. • **tasks**: hierarchical tasks with weights (LexoRank) and `division_id`. • **task_assignments**: links tasks to subcontractors. • **check_ins**: field worker submissions, with status and approval workflow. • **incidents**: issue reports created during check-ins, attachments stored separately. • **audit_logs**: append-only log of all writes for compliance. • **notifications**: pending in-app/email/WhatsApp messages.

### SQL Schema (PostgreSQL)

`-- Organizations (Tenants) CREATE TABLE organizations ( id UUID PRIMARY KEY, name TEXT NOT NULL, language TEXT DEFAULT 'tr', created_at TIMESTAMPTZ DEFAULT NOW() ); -- Users CREATE TABLE users ( id UUID PRIMARY KEY, email TEXT UNIQUE NOT NULL, phone TEXT, full_name TEXT, created_at TIMESTAMPTZ DEFAULT NOW() ); -- Roles CREATE TABLE roles ( id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL ); -- Memberships CREATE TABLE memberships ( id UUID PRIMARY KEY, user_id UUID REFERENCES users(id), organization_id UUID REFERENCES organizations(id), role_id INT REFERENCES roles(id), created_at TIMESTAMPTZ DEFAULT NOW() ); -- Division Templates CREATE TABLE division_templates ( id UUID PRIMARY KEY, organization_id UUID REFERENCES organizations(id), name TEXT NOT NULL, definition JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW() ); -- Divisions (Instantiated) CREATE EXTENSION IF NOT EXISTS ltree; CREATE TABLE divisions ( id UUID PRIMARY KEY, template_id UUID REFERENCES division_templates(id), organization_id UUID REFERENCES organizations(id), parent_path LTREE, name TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW() ); -- Tasks CREATE TABLE tasks ( id UUID PRIMARY KEY, organization_id UUID REFERENCES organizations(id), division_path LTREE, parent_rank TEXT, rank TEXT NOT NULL, -- LexoRank name TEXT NOT NULL, weight NUMERIC, status TEXT DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT NOW() ); -- Task Assignments CREATE TABLE task_assignments ( id UUID PRIMARY KEY, task_id UUID REFERENCES tasks(id), subcontractor_id UUID REFERENCES memberships(id), assigned_at TIMESTAMPTZ DEFAULT NOW() ); -- Check-ins & Incidents CREATE TABLE check_ins ( id UUID PRIMARY KEY, task_id UUID REFERENCES tasks(id), worker_id UUID REFERENCES users(id), status TEXT DEFAULT 'pending', comments TEXT, created_at TIMESTAMPTZ DEFAULT NOW() ); CREATE TABLE incidents ( id UUID PRIMARY KEY, check_in_id UUID REFERENCES check_ins(id), description TEXT, created_at TIMESTAMPTZ DEFAULT NOW() ); -- Photo Attachments CREATE TABLE attachments ( id UUID PRIMARY KEY, incident_id UUID REFERENCES incidents(id), storage_path TEXT, mime_type TEXT, size_bytes INT, uploaded_at TIMESTAMPTZ DEFAULT NOW() ); -- Audit Logs CREATE TABLE audit_logs ( id BIGSERIAL PRIMARY KEY, table_name TEXT, record_id UUID, action TEXT, changes JSONB, performed_by UUID REFERENCES users(id), performed_at TIMESTAMPTZ DEFAULT NOW() ); -- Notifications Queue CREATE TABLE notifications ( id BIGSERIAL PRIMARY KEY, organization_id UUID REFERENCES organizations(id), user_id UUID REFERENCES users(id), channel TEXT, -- 'in_app', 'email', 'whatsapp' payload JSONB, sent BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW() );`

## 4. API Design and Endpoints

All endpoints follow a RESTful style using Next.js Route Handlers. Each request is authenticated via Supabase JWT and scoped by `organization_id`.

- **Authentication & Tenancy**
  - POST `/api/auth/sign-up` – self-service tenant signup (email OTP).
  - POST `/api/auth/verify-otp` – validate OTP and return JWT.
  - GET `/api/organizations` – list accessible organizations.

- **Users & Roles**
  - GET `/api/users` – list users in tenant.
  - POST `/api/users` – invite or create user.
  - PATCH `/api/memberships/:id/role` – change user role.

- **Division Templates & Instances**
  - POST `/api/templates` – create a division template.
  - GET `/api/templates/:id` – fetch template definition.
  - POST `/api/templates/:id/instantiate` – instantiate under tenant.

- **Divisions & Tasks**
  - GET `/api/divisions` – fetch hierarchical divisions (cursor pagination).
  - POST `/api/tasks` – create single or bulk tasks under division.
  - GET `/api/tasks` – list tasks with filters (division, status).

- **Check-Ins & Incidents**
  - POST `/api/check-ins` – field worker check-in with attachments.
  - GET `/api/check-ins` – list pending approvals.
  - POST `/api/check-ins/:id/approve` – subcontractor approval.
  - POST `/api/check-ins/:id/reject` – with comments.
  - POST `/api/check-ins/:id/final-approve` – prime contractor final approval.

- **Notifications**
  - GET `/api/notifications` – fetch unread in-app notifications.
  - POST `/api/notifications/send` – trigger email/WhatsApp via background job.

- **Analytics & Reporting**
  - GET `/api/analytics/progress` – real-time summary with customizable filters.
  - GET `/api/exports/csv` – on-demand CSV export of project data.

- **File Uploads**
  - GET `/api/uploads/sign` – generate pre-signed URL for Supabase Storage.

## 5. Hosting Solutions

- **Vercel (Frontend & BFF)**
  - Automatic global CDN, edge caching, and auto-scaling.
  - Instant rollbacks & preview deployments for every PR.

- **Supabase (Backend & Data)**
  - Managed Postgres with built-in Auth, Storage, Edge Functions.
  - Automatic backups, point-in-time restores, RLS policies.

- **Redis (Caching)**
  - Hosted on Redis Cloud or similar, fast in-memory store.
  - Reduces load on Postgres for hot reads (e.g., dashboard queries).

## 6. Infrastructure Components

- **Load Balancer & CDN**
  - Vercel’s global edge network routes requests to nearest region.

- **Caching**
  - Redis caches query results and session data.
  - Edge caching of static API responses where safe (e.g., templates).

- **Content Delivery**
  - Vercel CDN for frontend assets.
  - Supabase Storage with CDN-enabled buckets for photos.

- **Background Workers**
  - Supabase Edge Functions invoked on insert to `notifications` table.
  - Retries and dead-letter logic for WhatsApp/email delivery.

## 7. Security Measures

- **Authentication**
  - Supabase Auth with email OTP flow.
  - JWT tokens on every request; token rotation.

- **Authorization**
  - Role-Based Access Control (RBAC) via `roles` and `memberships`.
  - Row-Level Security in Postgres to isolate tenant data.

- **Data Encryption**
  - TLS for all in-transit connections.
  - At-rest encryption for Postgres and Supabase Storage.

- **Input Validation & Sanitization**
  - Zod schemas validate request bodies on every route.

- **Secure Headers & CORS**
  - Helmet middleware on Next.js BFF routes.
  - CORS limited to approved front-end domains.

- **Audit & Compliance**
  - Append-only `audit_logs` for full traceability (7-year retention).
  - GDPR & KVKK compliant export/deletion endpoints.

## 8. Monitoring and Maintenance

- **Error Tracking**
  - Sentry captures exceptions in Edge Functions and BFF.

- **Performance Monitoring**
  - Supabase built-in metrics for Postgres.
  - Redis monitoring via Redis Cloud dashboard.
  - Vercel analytics (latency, error rates).

- **Testing & Quality Gates**
  - Unit tests with Vitest.
  - E2E tests with Playwright.
  - Visual regression with Storybook + Chromatic/Percy.
  - Lighthouse CI budgets enforce performance budgets on every build.

- **Deployment Workflow**
  - Changes merged to `main` auto-deploy to production.
  - Preview environments for every feature branch.

- **Maintenance**
  - Scheduled health checks on Edge Functions.
  - Periodic schema reviews & cleanup of unused columns.

## 9. Conclusion and Overall Backend Summary

Full-Court Control Pro’s backend is a robust, serverless architecture built for multi-tenant scalability, performance, and compliance. Supabase provides a unified platform for data, authentication, and storage, while Next.js on Vercel offers a fast, edge-delivered BFF layer. Redis caching and careful use of cursor-based pagination ensure responsive dashboards even with large data sets. Security is enforced at every layer—RLS, RBAC, encrypted transit/storage, and audit logging. Together, these components deliver a maintainable, high-performance backend that meets the needs of construction teams, supports real-time insights, and ensures data integrity over a 7-year retention horizon.
