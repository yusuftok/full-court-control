\# Project Requirements Document (PRD)

\#\# 1\. Project Overview

Full-Court Control Pro is a multi-tenant, web-based platform designed for medium-to-large construction companies to track the daily progress of on-site tasks across a customizable division hierarchy. It streamlines the logging of start, milestone, and completion check-ins, captures incidents with photo evidence, and enforces a two-level approval workflow (subcontractor and prime contractor). Real-time dashboards and on-demand CSV reports give managers and executives clear, up-to-date insights into finished vs. unfinished tasks at every node of their organizational structure.

We’re building this application to eliminate fragmented spreadsheets and siloed communications. Key objectives include self-service tenant signup, secure role-based access, flexible division templates, hierarchical task management with weights, two-tiered approvals (with in-app, email, and WhatsApp notifications), and a performant analytics dashboard. Success will be measured by user adoption, data accuracy, system responsiveness under large-scale hierarchies, and compliance with data-retention and privacy regulations.

\#\# 2\. In-Scope vs. Out-of-Scope

\#\#\# In-Scope (Version 1\)

\* Self-service tenant signup via email OTP (Supabase Auth)  
\* Role-based user management (system admin, prime/subcontractor engineers, field workers, etc.)  
\* Division hierarchy template definition (drag-and-drop tree, inline renaming, weights)  
\* Instantiation of actual division trees per project  
\* Hierarchical task creation, weighted assignment, and bulk instantiation across peer nodes  
\* Subcontractor CRUD and membership/role assignment  
\* Field check-ins and incident reports (photo upload to Supabase Storage, client-side image compression)  
\* Two-level approval workflows with in-app notifications, email alerts, and WhatsApp messages  
\* Real-time analytics dashboard with customizable filters (date ranges, division levels, subcontractor breakdowns)  
\* On-demand CSV export of project data  
\* Seven-year data retention and append-only audit logs  
\* Turkish-language support at launch, with an i18n foundation

\#\#\# Out-of-Scope (Version 1\)

\* Scheduled or automated CSV/email report exports  
\* Direct ERP, accounting, or external project-management integrations  
\* Row-Level Security (RLS) policies in the database (handled in handlers for PoC)  
\* Additional languages beyond Turkish/English foundation  
\* Advanced machine-learning predictions or forecasting

\#\# 3\. User Flow

When a new construction-company admin arrives, they’re prompted to enter an email on the Sign-In page. They receive a one-time password (OTP) via email (Supabase Auth), confirm it, and the system auto-provisions a tenant space scoped to that organization. An onboarding modal then invites them to invite teammates, create subcontractor companies, assign roles (prime-contractor/system admin, subcontractor engineers, etc.), and create their first project.

After logging in, users land on a dashboard showing projects in a table (desktop) or dense list (mobile). For Prime Contractor Chief Engineers, a prominent “Create Project” button opens a full-screen form to enter metadata and define a division hierarchy template via drag-and-drop. Once saved, Chief Engineers instantiate actual divisions, create hierarchical tasks, assign subcontractors, and monitor progress. Field workers submit check-ins/incidents via WhatsApp; subcontractor and prime engineers review and approve or reject in two tiers. Managers access a real-time analytics dashboard and export CSVs on demand.

\#\# 4\. Core Features

\* \*\*Multi-Tenant Authentication & Roles\*\*\\  
 Email OTP signup, tenant isolation, roles from system admin to field worker.  
\* \*\*Division Template Designer\*\*\\  
 Drag-and-drop UI, inline rename editing, saved as reusable “class hierarchy.”  
\* \*\*Division Instantiation\*\*\\  
 Mirror templates into live project trees, reorder/reparent via accessible drag-and-drop.  
\* \*\*Hierarchical Task Management\*\*\\  
 Create tasks/sub-tasks with weights, bulk instantiate across peer nodes, assign to subcontractors.  
\* \*\*Subcontractor CRUD & Role Assignment\*\*\\  
 Add/edit/remove subcontractor entities, link subcontractor users to scoped roles.  
\* \*\*Field Check-Ins & Incident Reporting\*\*\\  
 Start/milestone/completion check-ins, incident capture with photos, client-side compression, Supabase Storage.  
\* \*\*Two-Level Approval Workflow\*\*\\  
 Subcontractor and prime contractor approval steps, require reasons on rejection, append to audit log.  
\* \*\*Multi-Channel Notifications\*\*\\  
 In-app badges, email alerts, WhatsApp messages for field workers.  
\* \*\*Real-Time Analytics Dashboard\*\*\\  
 Customizable charts (date ranges, division levels, subcontractor filters), server-rendered until scrolled into view, then client-hydrated.  
\* \*\*On-Demand CSV Export\*\*\\  
 Keyset-paginated data streaming, background job with toast notification and download link.  
\* \*\*Audit Log & Data Retention\*\*\\  
 Append-only logs (who/when/what changed), 7-year retention, GDPR/KVKK compliance support.

\#\# 5\. Tech Stack & Tools

\* \*\*Frontend\*\*

    \*   Next.js 14+ (App Router, React Server Components)
    \*   React, TypeScript (strict), ESLint, Prettier
    \*   ShadCN UI (shell & controls), MUI fallback (TreeGrid)
    \*   dnd-kit (drag-and-drop with keyboard & collision support)
    \*   react-aria-components (accessibility primitives)
    \*   React Hook Form \+ Zod (forms & validation)
    \*   React Query (data fetching \+ subscriptions)
    \*   @tanstack/virtual or react-virtuoso (list virtualization)
    \*   Next.js Route Handlers & optional Server Actions
    \*   Vercel (hosting & CDN)

\* \*\*Backend & Storage\*\*

    \*   Supabase (Auth OTP, Postgres, Storage)
    \*   Drizzle ORM \+ drizzle-kit migrations
    \*   Cursor-based APIs using Postgres ltree \+ LexoRank
    \*   Redis (hot list caching)
    \*   Node.js environment (via Next.js)

\* \*\*Observability & CI/CD\*\*

    \*   Sentry (error tracking, performance, DSN via env)
    \*   Lighthouse CI (performance budgets, Web Vitals enforcement)
    \*   Logging of slow queries (\>50 ms) to console (dev) and Sentry breadcrumbs (prod)

\* \*\*Testing & Quality\*\*

    \*   Vitest (unit tests, invariants)
    \*   Playwright (E2E tests, DnD, pagination, seeded DB)
    \*   Storybook \+ Chromatic/Percy (visual regression)
    \*   Golden fixtures (canonical trees & API payloads)

\* \*\*Integrations\*\*

    \*   WhatsApp Business API (field-worker reporting & notifications)
    \*   Supabase email (OTP, alerts)

\* \*\*AI-Coding Tools (for development)\*\*

    \*   Cursor, v0, Claude Code, Lovable.dev

\#\# 6\. Non-Functional Requirements

\* \*\*Performance\*\*

    \*   Key queries ≤200 ms, slow queries logged.
    \*   LCP \<2.5s, CLS minimal, INP within budget.
    \*   Virtualized lists keep DOM small even with thousands of nodes.
    \*   Prefetch next cursor page on hover/near viewport.

\* \*\*Security & Compliance\*\*

    \*   Tenant isolation, passwordless OTP, plan for RLS in future.
    \*   GDPR/KVKK support: user data export & deletion.
    \*   7-year data retention for projects & audit logs.

\* \*\*Usability & Accessibility\*\*

    \*   WCAG AA contrast, ≥44 px touch targets, visible focus states.
    \*   Keyboard navigation follows reading order.
    \*   Responsive design: desktop (12-column grid at 1440 px), tablet (1024 px), mobile (390–430 px).
    \*   Single primary CTA per screen, progressive disclosure for advanced options.

\#\# 7\. Constraints & Assumptions

\* Supabase services (Auth, Postgres, Storage) must be provisioned and support Postgres ltree extension.  
\* WhatsApp Business API availability and rate limits for field-worker messaging.  
\* Users operate modern browsers with JS enabled.  
\* Image compression happens client-side; max 10 MB per photo.  
\* No OFFSET pagination—keyset cursors only.  
\* Division hierarchies may reach thousands of nodes; virtualization is required.

\#\# 8\. Known Issues & Potential Pitfalls

\* \*\*Large-Tree Performance\*\*: Must virtualize and paginate, avoid expensive re-renders.  
\* \*\*API Rate Limits\*\*: WhatsApp and Supabase could throttle; implement retry/back-off.  
\* \*\*Optimistic Concurrency\*\*: Use \`updated_at\` or \`version\` checks to prevent stale writes.  
\* \*\*Image Upload Failures\*\*: Validate file types/sizes, show clear error messages on failure.  
\* \*\*Notification Delivery\*\*: Email/SPAM filters and WhatsApp delays—provide in-app fallback.  
\* \*\*Schema Drift\*\*: Golden fixtures and invariant tests guard against unintended DB changes.

This PRD captures all essential requirements for Full-Court Control Pro’s initial release. It is detailed enough for an AI-driven process to generate subsequent documents—tech-stack deep dives, frontend guidelines, backend architecture, file structures, and IDE configurations—without ambiguity.
