# Unified Project Documentation

## Project Requirements Document

### 1. Project Overview

Full-Court Control Pro is a multi-tenant, web-based platform for medium-to-large construction companies to track daily progress across all divisions of their projects. It replaces scattered spreadsheets and siloed communications with a single source of truth. Administrators define a reusable division hierarchy template, then instantiate it for each project. Field workers submit check-ins and incident reports (with photos) via WhatsApp, engineers approve or reject them in two tiers, and executives see real-time dashboards and on-demand CSV reports.

The core success criteria are secure self-service tenant signup, clear role-based access, flexible hierarchy and task management, smooth two-level approvals, multi-channel notifications (in-app, email, WhatsApp), performant analytics under large datasets, and compliance with seven-year data retention and privacy regulations. We’ll measure performance by adoption rates, data accuracy, responsiveness with thousands of hierarchy nodes, and full support for GDPR/KVKK requirements.

### 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1)**

- Self-service tenant signup via email OTP using Supabase Auth
- Role-based user management (system admin, prime/subcontractor engineers, field workers)
- Division hierarchy template design (drag-and-drop tree, inline rename, weights)
- Instantiation of live divisions per project
- Hierarchical task and sub-task creation with weight assignment and peer-node bulk instantiation
- CRUD for subcontractors and membership/role assignment
- Field check-ins and incident reports with client-side photo compression to Supabase Storage
- Two-level approval workflows with in-app, email, and WhatsApp notifications
- Real-time analytics dashboard with customizable filters (date range, division level, subcontractor)
- On-demand CSV exports using keyset pagination
- Append-only audit logs and seven-year data retention
- Turkish-language launch with i18n foundation

**Out-of-Scope (Version 1)**

- Scheduled or automated report exports
- Direct integrations with ERP, accounting, or other project management tools
- Database row-level security (RLS) policies (handled in code, RLS added later if needed)
- Additional languages beyond the Turkish/English base
- Advanced ML forecasting or AI features

### 3. User Flow

When a new company admin arrives, they enter their email on the Sign-In page and receive a one-time password via Supabase Auth. Confirming the OTP auto-provisions a tenant space scoped to that company. An onboarding modal then invites them to invite teammates, assign roles, and create their first project. After the initial setup, users land on a dashboard showing existing projects in a table (desktop) or list (mobile), with a prominent button to create new ones.

Within a project, admins define a reusable division template using a drag-and-drop tree. Once saved, they instantiate actual divisions, create weighted tasks and subtasks across peer nodes, and assign subcontractors. Field workers report progress via WhatsApp, subcontractor and prime engineers review and approve or reject reports in two tiers, and all decisions generate in-app, email, and WhatsApp notifications. Managers monitor a real-time analytics dashboard and pull CSV exports on demand, while settings pages handle personal and organization preferences, notifications, and compliance requests.

### 4. Core Features

- **Multi-Tenant Authentication & Roles**: Passwordless email OTP signup, tenant provisioning, roles from system admin to field worker.
- **Division Template Designer**: Drag-and-drop UI, inline renaming and weight editing, reusable templates.
- **Division Instantiation**: Mirror templates into live project trees with accessible drag-and-drop.
- **Hierarchical Task Management**: Create tasks/subtasks, assign weights, bulk instantiate across peer divisions.
- **Subcontractor Management**: CRUD subcontractor entities, link users with scoped roles and engineers.
- **Field Reporting**: WhatsApp integration for check-ins/incidents, client-side image compression, Supabase Storage.
- **Two-Level Approval Workflow**: Subcontractor and prime contractor approvals, mandatory reasons on rejection, audit log entries.
- **Multi-Channel Notifications**: In-app badges, email alerts, WhatsApp messages.
- **Real-Time Analytics**: Customizable charts and graphs with date, division, and subcontractor filters.
- **On-Demand CSV Export**: Keyset-paginated streaming, background jobs, toast confirmations.
- **Audit Log & Data Retention**: Append-only audit logs, seven-year retention, GDPR/KVKK support.

### 5. Tech Stack & Tools

- **Frontend**
  - Next.js 14+ (App Router, React Server Components)
  - React, TypeScript (strict), ESLint, Prettier
  - ShadCN UI for shell & controls, MUI fallback for missing components (TreeGrid)
  - dnd-kit for drag-and-drop, react-aria-components for accessibility
  - React Hook Form + Zod for forms and validation
  - React Query for data fetching and real-time subscriptions
  - @tanstack/virtual or react-virtuoso for list virtualization
  - Vercel for deployment and edge caching

- **Backend & Storage**
  - Supabase (Auth OTP, Postgres, Storage with ltree extension)
  - Drizzle ORM + drizzle-kit for migrations
  - Cursor-based APIs using Postgres ltree + LexoRank
  - Redis for hot list caching

- **Observability & CI/CD**
  - Sentry for error tracking and performance monitoring
  - Lighthouse CI budgets for Web Vitals (LCP, CLS, INP)
  - Logging slow queries (>50 ms) in dev and as Sentry breadcrumbs in prod

- **Testing & Quality**
  - Vitest for unit and invariant tests
  - Playwright for end-to-end flows (DnD, pagination) with seeded DB and data-testids
  - Storybook + Chromatic/Percy for visual regression
  - Golden fixtures for canonical trees and API payloads

- **Integrations**
  - WhatsApp Business API for field-worker reporting and notifications
  - Supabase email for OTPs and system alerts

- **AI-Coding Tools**
  - Cursor IDE, v0 component builder, Claude Code, Lovable.dev

### 6. Non-Functional Requirements

- **Performance**
  - Queries ≤200 ms; slow queries logged.
  - LCP <2.5 s, minimal CLS, INP within budget.
  - Virtualized trees handle thousands of nodes.
  - Prefetch next cursor page on hover or near viewport.

- **Security & Compliance**
  - Tenant isolation, passwordless OTP, future RLS support.
  - GDPR/KVKK: data export and deletion requests.
  - Seven-year retention for projects, audit logs, and attachments.

- **Usability & Accessibility**
  - WCAG AA contrast, ≥44 px touch targets, visible focus states.
  - Keyboard navigation follows reading order.
  - Responsive design: 12-column grid at 1440 px, tablet at 1024 px, mobile at 390–430 px.
  - Single primary CTA per screen, progressive disclosure for advanced actions.

### 7. Constraints & Assumptions

- Supabase must support Postgres ltree and sufficient storage.
- WhatsApp Business API availability and rate limits.
- Modern browsers with JavaScript enabled.
- No OFFSET pagination; use keyset cursors only.
- Images ≤10 MB, JPEG/PNG/HEIC, compressed client-side.
- Division hierarchies may reach thousands of nodes.

### 8. Known Issues & Potential Pitfalls

- **Large-Tree Performance**: Must virtualize and paginate, avoid heavy re-renders.
- **API Rate Limits**: Implement retry/back-off for WhatsApp and Supabase.
- **Concurrency Conflicts**: Use `updated_at` or `version` checks in mutations.
- **Upload Failures**: Validate file size/type, show clear errors.
- **Notification Delivery**: Account for email spam filters and WhatsApp delays.
- **Schema Drift**: Golden fixtures and invariant tests guard against unintended changes.

## App Flow Document

### Onboarding and Sign-In/Sign-Up

A new user visits the Full-Court Control Pro landing page or follows an invitation link. They enter their email and request a one-time password (OTP) via Supabase Auth. The system emails an OTP and displays an input for code entry. Once the OTP is confirmed, the platform auto-provisions a new tenant space tied to that company. An onboarding modal then prompts the tenant admin to invite teammates and assign initial roles. To sign in later, the user returns to the login screen, enters their email, and requests another OTP. A “Resend OTP” link handles expired codes. Signing out is done through the user avatar menu, which safely ends the session and brings the user back to the email entry screen.

### Main Dashboard or Home Page

After authentication, the user lands on a dashboard. If no projects exist, the page shows an empty state with a clear headline and a primary “Create Project” button. Once projects exist, the dashboard displays them in a scan-friendly table on desktop or a dense list on mobile, showing project name, start date, and percent complete. A fixed left rail on desktop offers navigation to Projects, Division Templates, Divisions, Tasks, Subcontractors, Analytics, Reports, and Settings. On mobile, the rail collapses into a drawer accessible via a menu icon. The top bar houses a notifications bell with badges and the user avatar for account options. Clicking any nav item or project row takes the user directly to that section without a full page reload.

### Detailed Feature Flows and Page Transitions

When the user clicks “Create Project,” a full-screen form opens with project details and an inline link to define a division template. The template editor appears as a slide-up sheet containing a drag-and-drop tree. Users add, rename, and weight nodes with real-time validation. Saving returns them to the project form, where they confirm and save the project. On the project overview page, a secondary nav row links to Division Templates, Divisions, Tasks, Subcontractors, Analytics, and Reports. Each section loads instantly via the Next.js App Router.

Instantiating divisions opens the Divisions editor with a live tree mirroring the template. Accessible drag-and-drop powered by dnd-kit lets users reorder and reparent nodes. Keyset pagination and virtualization keep the interface snappy. Clicking “Save” writes the hierarchy and returns to the overview. In the Tasks section, the user clicks “Add Task” to summon a modal for task name, weight, division node, and peer-node replication. Subtasks are added inline in a virtualized list, with fields for subcontractor assignment and due dates. Optimistic updates show immediate changes, and version checks prevent stale writes.

The Subcontractors section shows an empty state until entities are created via a sheet-style form for company details, contact info, and logo upload. Saved subcontractors appear in lists and dropdowns across tasks. Role invitations and assignments happen in the Settings > Organization tab.

Field workers report check-ins and incidents through WhatsApp. These messages hit a secure API and appear in the Check-Ins & Incidents feed for engineers. The feed is filterable by project, division, date, or type. Clicking a record opens a detail view with lazy-loaded images and metadata. Subcontractor and prime engineers see approval dialogs with Approve/Reject options, require reasons on rejection, and trigger notifications and WhatsApp messages back to the field worker.

In the Analytics section, the dashboard loads server-rendered charts that hydrate into interactive client islands on scroll. A filter sheet customizes date ranges, division levels, and subcontractor breakdowns. React Query subscriptions keep the data fresh. The Reports section lets users pick a project, date range, and columns before clicking “Export CSV.” The data streams via keyset cursors, and a toast confirms the download link.

### Settings and Account Management

Through the user avatar menu, the user selects Settings to update personal info like name, email, and phone number. Notifications settings let them toggle in-app, email, and WhatsApp alerts. Organization settings include language (Turkish), time zone, and date/number formats. A Data Privacy page lets users request full data export or deletion under GDPR/KVKK. After saving, users use the main nav to continue their workflows.

### Error States and Alternate Paths

Invalid or expired OTPs show inline errors with a prompt to resend. Form fields display error messages under inputs until corrected. Loss of network connectivity triggers a banner and disables interactive elements. Unauthorized page access redirects to a forbidden page with a link back to the dashboard. Image uploads over 10 MB or wrong formats trigger a toast and prevent upload. Long operations show skeleton loaders or spinners. Uncaught errors log to Sentry and show a retry prompt.

### Conclusion and Overall App Journey

A construction company admin signs up via email OTP, provisions a tenant, and invites teammates. They create projects, design and instantiate division hierarchies, manage tasks and subcontractors, and rely on WhatsApp for field reports. Engineers approve in two tiers with multi-channel notifications. Managers use real-time dashboards and CSV exports, while settings and audit logs ensure compliance and data integrity.

## Tech Stack Document

### Frontend Technologies

- Next.js 14+ (App Router, React Server Components) – combines server-side rendering with client islands for performance.
- React with TypeScript strict mode – ensures type safety and reliable code.
- ShadCN UI for layout and controls; MUI fallback for advanced components (TreeGrid).
- dnd-kit for accessible drag-and-drop interactions with keyboard and collision detection.
- react-aria-components for accessible Tree and TreeItem roles.
- React Hook Form + Zod for form state and schema validation.
- React Query for data fetching, caching, and real-time subscriptions.
- @tanstack/virtual or react-virtuoso for virtualized lists in large trees.
- ESLint and Prettier for consistent code style and linting.
- Vercel for global edge deployment and automatic CI/CD.

### Backend Technologies

- Supabase Auth (email OTP) for passwordless authentication.
- Supabase Postgres with ltree extension for hierarchical data.
- Supabase Storage for photo attachments with client-side compression.
- Drizzle ORM + drizzle-kit for type-safe database migrations.
- Next.js Route Handlers (API routes) and optional Server Actions for one-shot operations.
- Redis for caching hot lists (children arrays, mapped sets).

### Infrastructure and Deployment

- Vercel for frontend and edge caching.
- Supabase hosted Postgres and Storage.
- GitHub Actions or Vercel’s built-in CI for linting, testing, and Lighthouse CI budgets.
- Environment variables for Sentry DSN, Supabase credentials, and WhatsApp API keys.
- Automatic migrations with drizzle-kit on deploy.

### Third-Party Integrations

- WhatsApp Business API for field-worker reporting and outbound notifications.
- Supabase email for OTPs and system alerts.
- Sentry for error tracking, performance tracing, and slow query logging.
- Lighthouse CI for enforcing Web Vitals budgets in CI.
- Chromatic/Percy for Storybook visual regression testing.

### Security and Performance Considerations

- Passwordless OTP and tenant isolation to prevent data leaks.
- Future plan for database RLS policies.
- Seven-year data retention, GDPR/KVKK data export and deletion flows.
- Keyset pagination and virtualization to avoid OFFSET scans.
- Prefetch and edge caching for fast navigation and LCP.
- Memoization (React.memo), stable keys, and lazy loading for charts and attachments.
- Sentry breadcrumbs and DSN-based error capture in production.

### Conclusion and Overall Tech Stack Summary

This stack balances performance, scalability, and developer productivity. Server components keep bundles small, client islands hydrate only interactive parts, and keyset APIs with virtualization handle large hierarchies. Supabase simplifies auth, database, and storage, while Redis and Sentry ensure performance and observability. The result is a lean, accessible, and extensible platform ready for future integrations.

## Frontend Guidelines Document

### Frontend Architecture

The frontend uses Next.js App Router with React Server Components for most pages. Interactive sections (tree editors, forms, drag-and-drop) are client islands that hydrate only where needed. This keeps initial loads fast and JavaScript bundles small. TypeScript enforces types across components and data fetching, while React Query manages all API calls, caching, and real-time updates. The directory structure groups by feature (projects, divisions, tasks) and co-locates server and client code, making it easy to scale and maintain.

### Design Principles

We follow a clean, minimal interface with generous whitespace and clear visual hierarchy: headline, supporting text, then primary action. A single primary CTA per screen prevents decision overload. Progressive disclosure moves advanced options into sheets or dialogs. We enforce WCAG AA contrast ratios, visible focus states, ≥44 px touch targets, and full keyboard navigation aligned with reading order.

### Styling and Theming

We use Tailwind CSS with a design token approach for colors, typography, and spacing. The theme is neutral (grays and whites) with accent colors for primary actions. We follow a flat design with occasional glassmorphism on modals for visual depth. Fonts are system-UI for performance and readability. A 12-column grid at 1440 px width ensures consistency, with gutters visible at all breakpoints. On mobile, the grid collapses to a dense list layout.

### Component Structure

Components live in a `components/` folder, organized by domain (e.g., `TreeEditor`, `TaskForm`, `AnalyticsChart`). Each component includes its styles, tests, and Storybook story. Reusable UI primitives (buttons, inputs, modals) are extracted into a `ui/` folder. This promotes reusability, consistent styling, and easier testing.

### State Management

Local component state (form inputs, drag-and-drop state) uses React Hook Form or `useState`. Global server data comes through React Query, which handles caching, refetching, and subscriptions. We avoid complex client-side stores; React Query’s cache is sufficient for shared state like current project or user.

### Routing and Navigation

Next.js App Router handles file-based routing. The main layout defines a fixed sidebar and header. Nested layouts manage project-scoped routes under `/projects/[id]`. We use `Link` components for client-side navigation and edge caching to speed up shell loads. Mobile navigation collapses the sidebar into a drawer.

### Performance Optimization

We use server components for non-interactive views, client islands for interactive widgets, and virtualization for large lists. Keyset pagination avoids OFFSET scans. We prefetch next pages on hover. Images are lazy-loaded with IntersectionObserver. We memoize rows with `React.memo` and stable keys. Lighthouse budgets run in CI to enforce Web Vitals.

### Testing and Quality Assurance

Unit tests use Vitest for functions, hooks, and components. Integration tests cover form flows and tree editing. End-to-end tests use Playwright with seeded databases and data-testids for DnD, pagination, and approval flows. Visual regression runs Storybook stories through Chromatic/Percy to catch UI drift. Golden fixtures ensure schema and contract stability.

### Conclusion and Overall Frontend Summary

Our frontend setup prioritizes performance, accessibility, and maintainability. Server components keep bundles lean, client islands hydrate interactive areas, and TypeScript plus React Query ensure robust data handling. Tailwind CSS and a clear component structure deliver a consistent, scalable UI that meets our project goals.

## Implementation Plan

1.  **Initialize Repository & Tooling**: Set up Next.js 14+ with TypeScript, ESLint, Prettier, Tailwind CSS, and ShadCN UI.
2.  **Auth & Tenant Provisioning**: Integrate Supabase Auth OTP, implement sign-in/sign-up flow, and automatic tenant creation.
3.  **Database Schema & ORM**: Define Postgres schema with ltree for hierarchies, audit log tables, roles, tasks, and subcontractors. Configure Drizzle ORM and initial migrations.
4.  **Division Template Editor**: Build drag-and-drop tree component (dnd-kit + react-aria), inline rename/weight form with React Hook Form + Zod. Persist template via API route.
5.  **Division Instantiation**: Mirror templates into live divisions view, add keyset pagination, virtualization, and save functionality.
6.  **Task Management Module**: Implement hierarchical task creation modal, peer-node instantiation logic, subcontractor assignment, optimistic updates, and concurrency checks.
7.  **Subcontractor CRUD & Roles**: Create subcontractor list and form, role invitation UI, and backend handlers enforcing tenant scope.
8.  **WhatsApp Integration & Field Reporting**: Set up WhatsApp Business API webhooks, map incoming messages to check-ins/incidents, and build feed UI for engineers.
9.  **Approval Workflows**: Create two-level approval dialogs, implement notifications via in-app, email, and WhatsApp, and record audit log entries.
10. **Analytics Dashboard**: Server-render chart endpoints, client hydration on scroll, filter sheet implementation, and real-time updates via React Query subscriptions.
11. **CSV Export**: Build reports form, background job streaming data with keyset cursors, and toast notification for download.
12. **Settings & Compliance**: Implement account and organization settings pages, i18n foundation for Turkish, data export/deletion flows for GDPR/KVKK.
13. **Observability & CI/CD**: Configure Sentry, Lighthouse CI budgets, slow query logging, and deploy pipelines to Vercel with drizzle-kit migrations.
14. **Testing & QA**: Write Vitest unit tests, Playwright E2E tests, Storybook stories, and visual regression with Chromatic/Percy.
15. **Performance & Accessibility Audit**: Run Lighthouse audits, address any LCP/CLS/INP issues, and verify WCAG AA compliance.
16. **Beta Launch & Monitoring**: Release to a pilot group, monitor Sentry and user feedback, fix critical issues, and prepare for public launch.

This step-by-step plan will guide the team from setup through beta launch, ensuring feature completeness, performance, and compliance with our core requirements.
