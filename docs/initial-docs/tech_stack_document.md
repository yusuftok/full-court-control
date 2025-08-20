# Tech Stack Document

This document explains the technology choices for Full-Court Control Pro in everyday language. It shows what we use on the frontend, backend, hosting, integrations, security, and performance. You don’t need a technical background to understand why each piece was chosen.

## Frontend Technologies

We build the user interface—what you see and click—using these tools:

- **Next.js 14+** (with App Router and React Server Components)
  • Lets us render pages on the server for speed and SEO, while still having interactive bits on the client.
- **React & TypeScript (strict)**
  • React is a popular library for building UI components. TypeScript adds safety by checking our code for mistakes as we type.
- **ESLint & Prettier**
  • Automatically keeps our code style consistent and fixes small formatting issues.
- **ShadCN UI & MUI (fallback)**
  • ShadCN UI provides a clean, minimal look. For any controls we don’t find there (like a tree grid), we use Material UI (MUI).
- **dnd-kit**
  • Makes drag-and-drop interactions smooth and accessible (keyboard support included).
- **react-aria-components**
  • Ensures our components follow accessibility guidelines so screen readers and keyboard users can navigate easily.
- **React Hook Form + Zod**
  • Simplifies building forms with real-time validation (e.g., when renaming a division node).
- **React Query**
  • Handles data loading, caching, and updating when you create or approve tasks, so the UI always shows fresh information.
- **@tanstack/virtual or react-virtuoso**
  • Only renders list items you can see on screen, keeping the page fast even with thousands of divisions or tasks.
- **Next.js Route Handlers & Server Actions**
  • Let us handle form submissions and small operations securely on the server without extra API code.
- **Vercel**
  • Our hosting platform for the frontend, giving us automatic deployments, global CDN, and simple rollbacks.

These choices work together to deliver a fast, accessible, and easy-to-use interface for defining divisions, managing tasks, and viewing dashboards.

## Backend Technologies

Behind the scenes, these tools store your data and run business logic:

- **Supabase (Auth, Postgres, Storage)**
  • Handles user sign-up via email OTP, stores all project data in a Postgres database, and keeps photos in a secure file store.
- **Drizzle ORM + drizzle-kit**
  • A type-safe way in TypeScript to talk to our Postgres database and manage schema changes (migrations).
- **Cursor-based APIs (Postgres ltree + LexoRank)**
  • Efficiently paginate large trees of divisions or tasks without slow OFFSET queries.
- **Redis Cache**
  • Caches frequently accessed lists (e.g., child nodes) to reduce database load and improve response times.

Together, they ensure data is stored reliably, queries stay fast as your projects grow, and file uploads (photos) are managed securely.

## Infrastructure and Deployment

This section covers hosting, continuous integration, and code management:

- **Version Control (Git)**
  • All code lives in a shared repository, so changes are tracked and reviewed before they go live.
- **CI/CD with GitHub Actions & Lighthouse CI**
  • Every code change runs automated tests and performance checks (Web Vitals budgets) before merging.
- **Sentry**
  • Monitors errors and performance issues in both development and production, sending alerts when something goes wrong.
- **Vercel & Supabase Hosting**
  • Frontend deploys automatically to Vercel. Backend services (database, authentication, storage) run on Supabase’s managed platform. Scaling happens behind the scenes.

This setup gives us reliable builds, quick rollbacks, and high availability without manual server management.

## Third-Party Integrations

We connect to a few external services to extend functionality:

- **WhatsApp Business API**
  • Allows field workers to send check-ins and incident reports (with photos) via WhatsApp and receive approval notifications back.
- **Supabase Email**
  • Sends OTP emails for login and notifies users when a check-in is approved or rejected.

These integrations make it easy for on-site teams to report progress using tools they already have, and stay informed in real time.

## Security and Performance Considerations

We’ve built in measures to keep data safe and the app snappy:

- **Authentication & Tenant Isolation**
  • Passwordless email OTP for secure login. Each company has its own tenant space, so data never mixes between organizations.
- **Role-Based Access Control**
  • Specific roles (e.g., prime contractor engineer, subcontractor engineer, field worker) limit who can view or approve tasks and check-ins.
- **Data Protection & Compliance**
  • Audit logs are append-only and stored for 7 years to meet industry regulations and GDPR/KVKK requirements. Users can request data exports or deletions.
- **Optimistic Concurrency**
  • Prevents conflicting updates by checking a version or timestamp before saving changes.
- **Performance Optimizations**
  • Server-rendered shells with client-only hydration (“client islands”) for interactive parts. Virtualized lists, keyset pagination, Redis caching, and edge caching keep pages fast even under heavy load.

These strategies combine to protect your data and maintain a smooth user experience at scale.

## Conclusion and Overall Tech Stack Summary

We chose each technology in Full-Court Control Pro to balance speed, reliability, and ease of use:

- On the **frontend**, Next.js with React, TypeScript, and modern UI libraries deliver an accessible, responsive interface.
- On the **backend**, Supabase, Postgres, and Drizzle ORM provide secure multi-tenant data storage and file handling.
- Our **infrastructure**—Vercel, GitHub Actions, Lighthouse CI, and Sentry—ensures smooth deployments, ongoing performance checks, and proactive error monitoring.
- **Integrations** with WhatsApp and email keep field workers connected without forcing them into a new app.
- **Security** and **performance** practices (tenant isolation, keyset pagination, caching, optimistic updates) guarantee data safety and a snappy experience.

This stack supports our goals of secure, multi-tenant project tracking, flexible division hierarchies, real-time analytics, and an intuitive user journey—all while laying the foundation for future growth and integrations.