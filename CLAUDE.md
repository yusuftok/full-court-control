# CLAUDE.md - Full-Court Control Pro

This file provides guidance to Claude Code (claude.ai/code) when working with Full-Court Control Pro.

## Project Overview

**Full-Court Control Pro** is a web-based, multi-tenant platform built for medium-to-large construction companies. It solves the problem of fragmented daily progress tracking by providing a unified system for:

- Defining division hierarchies with reusable templates
- Creating weighted tasks and assigning them to subcontractors
- Logging field check-ins and incidents with photo evidence
- Real-time progress tracking with two-level approval workflows
- Analytics dashboards and CSV exports for reporting

The platform brings all stakeholders—prime contractors, subcontractors, and field workers—onto the same page with real-time visibility into project health.

### Core Features

1. **Multi-Tenant Architecture**: Strict organization isolation with role-based access control
2. **Division Hierarchy Management**: Reusable templates and project-specific instantiations
3. **Task Management**: Hierarchical, weighted tasks with bulk instantiation
4. **Field Operations**: Check-ins (start/milestone/completion) and incident reporting with photos
5. **Two-Level Approval**: Subcontractor → Prime contractor approval workflow
6. **Real-Time Analytics**: Dashboards with charts, tree views, and heatmaps
7. **Reporting**: CSV exports for progress, incidents, performance, and audit logs
8. **Notifications**: Email for managers, WhatsApp for field workers

## Technology Stack

### Frontend

- **Next.js 14+** with App Router & React Server Components
- **TypeScript** (strict mode)
- **React 18+**
- **ShadCN UI** - Primary component library for shell and controls
- **MUI (Material-UI)** - For complex components (TreeList, DataGrid, Pagination)
- **Tailwind CSS** - Utility-first styling
- **dnd-kit** - Drag-and-drop functionality
- **@tanstack/virtual** or **react-virtuoso** - Virtualization
- **React Hook Form** + **Zod** - Forms and validation
- **React Query** (@tanstack/react-query) - Data fetching
- **react-aria-components** - Accessibility primitives
- **ESLint** & **Prettier** - Code quality

### UI Strategy

- **ShadCN for shell & surface UX**: Nav bars, modals, cards, buttons, forms — polished, consistent branding
- **MUI for heavy lifting**: TreeList, DataGrid, Pagination (where ShadCN doesn't provide out-of-the-box)
- Use ShadCN UI for shell and controls; if a component isn't available (like TreeGrid), fall back to MUI

### Backend & Database

- **Supabase** (PostgreSQL + Auth)
- **Drizzle ORM** with drizzle-kit for migrations
- **PostgreSQL ltree** extension for hierarchies
- **LexoRank** for stable sorting
- **Redis** for caching hot lists
- **Next.js Route Handlers** for API endpoints

### Infrastructure

- **Vercel** for frontend deployment
- **Supabase** for backend services
- **Sentry** for error tracking
- **GitHub Actions** for CI/CD
- **Lighthouse CI** for performance monitoring

### Testing

- **Vitest** for unit tests
- **Playwright** for E2E tests
- **Storybook** with Chromatic/Percy for visual testing

## Development Commands

### Package Management

```bash
npm install              # Install dependencies
npm ci                   # Clean install for CI
npm audit               # Check for vulnerabilities
```

### Development

```bash
npm run dev             # Start development server (Next.js)
npm run build           # Build for production
npm run start           # Start production server
npm run preview         # Preview production build
```

**⚠️ IMPORTANT - Development Server Port Management:**

- Development server MUST always run on port 3000
- If port 3000 is occupied, kill existing processes first: `kill -9 $(lsof -ti:3000)`
- Then start dev server: `npm run dev`
- Never accept alternative ports for development

### Database

```bash
npm run db:generate     # Generate Drizzle migrations
npm run db:migrate      # Run migrations
npm run db:push         # Push schema to database
npm run db:studio       # Open Drizzle Studio
npm run db:seed         # Seed database with test data
```

### Testing

```bash
npm run test            # Run unit tests (Vitest)
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
npm run test:e2e        # Run E2E tests (Playwright)
npm run test:e2e:ui     # Open Playwright UI
```

### Code Quality

```bash
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier
npm run format:check    # Check formatting
npm run typecheck       # TypeScript type checking
```

### Storybook

```bash
npm run storybook       # Start Storybook dev server
npm run build-storybook # Build Storybook static site
```

### ShadCN UI

```bash
npx shadcn-ui@latest add [component]  # Add a ShadCN component
npx shadcn-ui@latest init             # Initialize ShadCN
```

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/         # Authenticated app pages
│   │   ├── projects/        # Project management
│   │   ├── divisions/       # Division hierarchy
│   │   ├── tasks/           # Task management
│   │   ├── field/           # Field operations
│   │   ├── approvals/       # Approval workflows
│   │   ├── analytics/       # Dashboards
│   │   └── reports/         # CSV exports
│   ├── api/                 # API route handlers
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── divisions/
│   │   ├── tasks/
│   │   ├── field/
│   │   └── reports/
│   ├── layout.tsx
│   └── page.tsx
├── components/              # React components
│   ├── ui/                 # ShadCN UI components (primary)
│   ├── mui/                # MUI components (complex widgets)
│   ├── forms/              # Form components
│   ├── charts/             # Analytics visualizations
│   ├── trees/              # Division/task trees
│   └── layout/             # App layout components
├── lib/                    # Core libraries
│   ├── db/                 # Database setup
│   │   ├── schema.ts       # Drizzle schema
│   │   ├── migrations/     # SQL migrations
│   │   └── seed.ts         # Seed data
│   ├── auth/               # Authentication
│   ├── redis/              # Redis client
│   └── utils/              # Utilities
├── hooks/                  # Custom React hooks
├── services/               # API service layer
├── types/                  # TypeScript types
│   ├── database.ts         # DB types
│   ├── api.ts              # API types
│   └── models.ts           # Domain models
├── constants/              # App constants
└── styles/                 # Global styles & Tailwind
```

## Design System

### Color Palette

- **Primary**: #1976D2 (Blue)
- **Secondary**: #00ACC1 (Teal)
- **Background**: #F5F5F5 (Light Gray)
- **Surface**: #FFFFFF (White)
- **Error**: #D32F2F (Red)
- **Success**: #388E3C (Green)
- **Text Primary**: #212121 (Dark Gray)
- **Text Secondary**: #616161 (Medium Gray)

### Typography

- **Font Family**: Roboto, sans-serif
- **Base Size**: 16px
- **Line Height**: 1.5
- **Headings**: Bold with clear hierarchy

### Layout

- **Desktop**: 12-column grid at 1440px width
- **Margins**: 160-200px outer margins
- **Sidebar**: Max 240px wide
- **Touch Targets**: Minimum 44px
- **Spacing**: 8px increments

## Key Implementation Guidelines

### Database Schema Patterns

1. **Multi-Tenancy**: Every table includes `organization_id` for tenant isolation
2. **Audit Trail**: Use `created_at`, `updated_at`, `created_by`, `updated_by` fields
3. **Soft Deletes**: Use `deleted_at` field instead of hard deletes
4. **Versioning**: Include `version` column for optimistic concurrency control

### API Design Patterns

1. **RESTful Routes**: Follow REST conventions for CRUD operations
2. **Cursor Pagination**: Use keyset/cursor pagination, never OFFSET
3. **Response Format**: Consistent JSON structure with `data`, `error`, `meta` fields
4. **Validation**: Zod schemas for all request/response validation

### Component Guidelines

1. **ShadCN First**: Always check if ShadCN has the component
2. **MUI Fallback**: Use MUI for complex components not in ShadCN
3. **Consistency**: Don't mix styling approaches within a component
4. **Accessibility**: All components must support keyboard navigation

### Performance Requirements

1. **Dashboard Load**: < 1 second on 100 Mbps connection
2. **LCP**: < 2.5 seconds
3. **Tree Virtualization**: Support 1k-100k nodes
4. **Query Performance**: Log queries > 50ms in development

### Security Requirements

1. **Tenant Isolation**: Strict organization-based data separation
2. **Role-Based Access**: Check permissions at handler level
3. **Input Validation**: Sanitize all user inputs
4. **Audit Logging**: Track all data modifications

### UI/UX Standards

1. **Accessibility**: WCAG AA compliance
2. **Responsive Design**:
   - Desktop: ≥1440px
   - Tablet: ≥1024px
   - Mobile: 390-430px
3. **Touch Targets**: Minimum 44px
4. **Material Design**: Follow design principles

## Development Workflow

### Before Starting

1. Review PRD documents in `docs/initial-docs/`
2. Check existing patterns in codebase
3. Ensure database migrations are up to date
4. Set up environment variables from `.env.example`

### During Development

1. Use TypeScript strict mode
2. Write tests for new features
3. Follow existing code patterns
4. Document complex logic
5. Use meaningful commit messages

### Before Committing

1. Run `npm run typecheck`
2. Run `npm run lint:fix`
3. Run `npm run format`
4. Run `npm run test`
5. Check `npm run build` succeeds

## Environment Variables

```env
# Database
DATABASE_URL=
DIRECT_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Redis
REDIS_URL=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# WhatsApp
WHATSAPP_API_KEY=
WHATSAPP_PHONE_NUMBER=

# Email
EMAIL_FROM=
EMAIL_SMTP_HOST=
EMAIL_SMTP_PORT=
EMAIL_SMTP_USER=
EMAIL_SMTP_PASS=
```

## Common Tasks

### Adding a New Feature

1. Create feature branch from `main`
2. Add database schema if needed
3. Generate and run migrations
4. Create API route handlers
5. Build UI components (ShadCN first, MUI if needed)
6. Add tests
7. Update documentation

### Creating a New UI Component

1. Check if ShadCN has the component: `npx shadcn-ui@latest add [component]`
2. If not available, check MUI documentation
3. Create component in appropriate folder
4. Ensure accessibility with react-aria-components
5. Add to Storybook
6. Write component tests

### Adding a New API Endpoint

1. Define Zod schemas for request/response
2. Create route handler in `app/api/`
3. Add service layer logic
4. Implement error handling
5. Add rate limiting if needed
6. Write tests

## Troubleshooting

### Common Issues

1. **ShadCN/MUI Conflicts**
   - Keep ShadCN components in `components/ui/`
   - Keep MUI components in `components/mui/`
   - Don't mix ThemeProviders

2. **Database Connection Errors**
   - Check DATABASE_URL in .env
   - Ensure Supabase project is running
   - Verify network connectivity

3. **Type Errors**
   - Run `npm run db:generate` after schema changes
   - Ensure `npm run typecheck` passes
   - Check for missing type imports

4. **Build Failures**
   - Clear `.next` folder
   - Delete `node_modules` and reinstall
   - Check for ESLint errors

## Important Notes

- **UI Library Priority**: ShadCN → MUI → Custom
- Always maintain strict tenant isolation
- Never use OFFSET pagination
- Log slow queries (>50ms) in development
- Use virtualization for large lists
- Implement optimistic UI updates
- Cache frequently accessed data in Redis
- Follow Material Design guidelines
- Ensure WCAG AA accessibility
- Write tests for critical paths
- Document complex business logic

## Development Workflow Guidelines

### 🔄 Project Awareness & Context

- **Always read project documentation** (`PLANNING.md`, `README.md`, and any `docs/` folder if it exists) at start of conversations to understand the project's architecture, goals, style, and constraints
- **Check task tracking files** before starting new work. If a task isn't listed, add it with a brief description and today's date
- **Use consistent naming conventions, file structure, and architecture patterns** as described in project documentation

### 🧱 Code Structure & Modularity

- **Never create a file longer than 500 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files
- **Organize code into clearly separated modules**, grouped by feature or responsibility
- **Use clear, consistent imports and dependency management**

### 🧪 Testing & Reliability

- **Always create unit tests for new features** (functions, classes, components, routes, etc)
- **After updating any logic**, check whether existing tests need to be updated. If so, do it
- **Tests should mirror the main app structure** and include at least:
  - 1 test for expected use
  - 1 edge case
  - 1 failure case

### ✅ Task Completion

- **Mark completed tasks immediately** after finishing them
- **Add new sub-tasks or TODOs** discovered during development to task tracking

### 📚 Documentation & Explainability

- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer
- **When writing complex logic**, add an inline comment explaining the why, not just the what
- **Update documentation** when new features are added, dependencies change, or setup steps are modified

### 🧠 AI Behavior Rules

- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified packages
- **Always confirm file paths and module names** exist before referencing them in code or tests
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a documented task

## 🇹🇷 **CRITICAL LANGUAGE REQUIREMENT**

**PRIMARY LANGUAGE: TURKISH (Türkçe)**

- ✅ **First Launch**: Application MUST be in Turkish from day 1
- 🌍 **Future**: The architecure and design must support Multi-language from day 1 but Turkish is 1st implementation
- 📝 **All UI Elements**: Buttons, labels, messages, hints, notifications, etc. must be in Turkish
- 🚫 **No English**: Avoid English text in user-facing elements
- 📋 **Forms**: Error messages, validation text, placeholders in Turkish
- 🎯 **Target Users**: Turkish construction industry white-collar professionals

**This requirement is STRICTLY enforced and must be maintained in all development phases.**

## Agent Communication

- `.agent/handoff.md` - Main agent-hnadoff doc
- `.agent/ux-decisions.md` - UX decisions
- `.agent/ui-specifications.md` - UI specifications
- `.agent/component-library.md` - Component library
- `.agent/api-contracts.md` - API Contracts

## Playwright Browser Configuration

**Browser Window Settings:**

- Browser MUST be manually maximized before use
- Let browser use native maximize size (no viewport override)
- DO NOT use `mcp__playwright__browser_resize()` - causes viewport mismatch
- Configuration file: `.claude/playwright-config.js`

**Usage Pattern:**

```javascript
// Correct pattern for Playwright browser usage:
// 1. Manually maximize browser window first
// 2. Then navigate without viewport changes
await mcp__playwright__browser_navigate('http://localhost:3000')
// NO resize needed - browser uses natural maximize size
```

**Why no viewport resize:**

- Manual maximize: Uses actual screen dimensions (e.g., 1440x900 MacBook)
- Viewport resize: Forces artificial dimensions (e.g., 1920x1080)
- Result: Content overflow and hidden interface elements

**Testing Strategy:**

- **Default approach**: Code analysis + dev server logs (faster) + Chrome DEV Tools MCP
- **Playwright usage**: Only when user explicitly requests visual testing
- **Efficiency**: Most fixes can be validated through code review and compile success
- **User feedback**: Primary validation method for UI/UX changes

## Demo Routes

- `/` - Ana sayfa (Demo seçici)
- `/dashboard` - Temel kontrol paneli
- `/advanced-demo` - Gelişmiş demo (tüm özellikler)
- `/projects` - Projeler
- `/templates` - Şablonlar
- `/auth/signin` - Giriş akışı
- implementasyonda çoklu dil desteği her zaman dikkate alınmalı
