# Frontend Guideline Document for Full-Court Control Pro

This document describes the frontend setup, design principles, and technologies for the Full-Court Control Pro platform. It’s written in everyday language so anyone can understand how the frontend works and why we chose certain tools.

## 1. Frontend Architecture

### 1.1 Overview

- We use **Next.js 14+** with the **App Router** and **React Server Components** to build pages and layouts. This gives us a solid foundation for server-rendered and client-rendered parts of the app.
- **TypeScript (strict mode)** ensures we catch errors early and keep our codebase consistent.
- We enforce code style with **ESLint** and **Prettier**.

### 1.2 Key Libraries

- **React** for building user interfaces.
- **ShadCN UI** as our primary component library (built on Tailwind CSS).
- **MUI TreeGrid** fallback for complex hierarchical tables.
- **dnd-kit** for drag-and-drop interactions.
- **react-aria-components** for accessible UI primitives.
- **Zod** and **React Hook Form** for form validation and handling.
- **React Query (@tanstack/react-query)** for fetching, caching, and syncing server data.
- **@tanstack/virtual** or **react-virtuoso** for windowed lists and grids.

### 1.3 Scalability, Maintainability, Performance

- **Server Components** keep the bundle size small on the client, improving load times.
- **Next.js Route Handlers** and **Server Actions** let us colocate data fetching and mutations with UI code.
- **Modular directory structure** (see Component Structure) makes it easy to onboard new developers.
- **Vercel** deployment with automatic previews and zero-config scaling.

---

## 2. Design Principles

1. **Usability**: Clear layouts, single primary CTA per screen, consistent interactions.
2. **Accessibility (WCAG AA)**: Keyboard-navigable components, proper ARIA roles (via react-aria), color contrast checks.
3. **Responsiveness**: Mobile-first CSS, breakpoints for tablet and desktop (up to 1440px grid).
4. **Clarity & Minimalism**: Only show what’s needed; avoid clutter.
5. **Consistency**: Reuse the same components, colors, and typography throughout.

**How We Apply Them:**

- Forms highlight errors with clear messages (Zod + React Hook Form).
- Buttons and focus states follow a consistent pattern from ShadCN UI.
- Drag-and-drop flows give visual hints and remain keyboard-accessible.

---

## 3. Styling and Theming

### 3.1 Styling Approach

- **Tailwind CSS** (via ShadCN UI) for utility-first styling.
- No global CSS files—styles live alongside components or in shared config.
- Use **CSS resets** provided by ShadCN.

### 3.2 Theming

- A single light theme at launch, with a CSS variable approach to swap colors later.

### 3.3 Visual Style

- **Overall Look:** Flat, modern, minimalist.
- **Grid:** 1440px max width, centered content, 12-column layout.
- **Shadows & Borders:** Subtle shadows for elevation; 1px borders for inputs.

### 3.4 Color Palette

- Primary: #2563EB (blue)
- Secondary: #10B981 (green)
- Accent: #F59E0B (amber)
- Background: #F9FAFB (light gray)
- Surface: #FFFFFF (white)
- Text Primary: #111827 (dark gray)
- Text Secondary: #6B7280 (mid gray)
- Success: #10B981, Warning: #F59E0B, Error: #EF4444

### 3.5 Typography

- **Font Family:** Inter, sans-serif.
- **Sizes:**
  - H1: 2.25rem (36px)
  - H2: 1.875rem (30px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)
- **Line Height:** 1.5 for body text.

---

## 4. Component Structure

### 4.1 Directory Layout

```
/app                  # Next.js App Router
  /dashboard          # Feature folders
    /components       # Feature-specific UI
    /routes
/components          # Reusable UI components
  /ui                 # ShadCN overrides (buttons, inputs)
  /layout             # App layouts (headers, footers)
  /hooks              # Custom React hooks
  /utils              # Helpers, formatters
/public               # Static assets
```

### 4.2 Reusability

- **Atoms** (buttons, inputs) live under `/components/ui`.
- **Molecules** (form groups, navigation items) combine atoms.
- **Organisms** (sidebars, dashboards) compose molecules.

**Why Component Architecture Matters:**

- Easy to find and update a UI piece.
- Promotes consistency—one source of truth for styles and behavior.
- Simplifies testing—test small pieces in isolation.

---

## 5. State Management

### 5.1 Server State

- **React Query** manages all data fetching, caching, and sync with server APIs.
- Queries live in `/app/(features)/hooks/useXYZQuery.ts`.
- Mutations use React Query’s `useMutation`, with automatic cache invalidation.

### 5.2 Client/UI State

- **React Context** for global flags (e.g., theme, layout collapsed state).
- Local component state for ephemeral UI details (e.g., open/close modals).

### 5.3 Form State

- **React Hook Form** + **Zod** handle form values, validation schema, and error messaging.

---

## 6. Routing and Navigation

### 6.1 Routing

- **Next.js App Router** with file-based routes under `/app`.
- Nested layouts for shared UI (e.g., sidebar, top bar).
- Dynamic routes for tenant IDs, project IDs: `/[tenant]/projects/[projectId]`.

### 6.2 Navigation Structure

- **Main Sidebar**: links for Dashboard, Projects, Tenants, Settings.
- **Breadcrumbs** at the top of deep pages for context.
- **Top Bar**: tenant selector, notifications, user menu.

Users click sidebar items to load new pages; route changes prefetch data and code.

---

## 7. Performance Optimization

1. **Server Components** to minimize client JS.
2. **Dynamic Imports** for heavy components (e.g., TreeGrid falls back to MUI only when needed).
3. **Code Splitting & Route-level Bundles** by default in Next.js.
4. **Image Optimization** using Next.js `<Image>` (automatic resizing & format selection).
5. **Virtualized Lists** (`@tanstack/virtual` or `react-virtuoso`) for large tables.
6. **Asset Compression** (enabled on Vercel) and HTTP/2.
7. **Lighthouse CI Budgets** in CI pipeline to catch regressions.

These strategies keep load times low and interactions smooth.

---

## 8. Testing and Quality Assurance

### 8.1 Unit Testing

- **Vitest** for component and utility tests.
- Aim for ~80% coverage on critical modules.

### 8.2 Integration Testing

- **React Testing Library** (with Vitest) for component interactions.

### 8.3 End-to-End Testing

- **Playwright** for user flows (signin, task creation, approvals).

### 8.4 Visual Regression

- **Storybook** for isolated component development.
- **Chromatic** or **Percy** for snapshot testing of UI states.

### 8.5 Accessibility Checks

- **axe-core** integrated in Storybook and tests to catch WCAG violations.

---

## 9. Conclusion and Overall Frontend Summary

Full-Court Control Pro’s frontend uses modern Next.js features, a strict TypeScript setup, and a utility-first styling approach with Tailwind CSS and ShadCN UI. Our component-based architecture, backed by React Query and React Hook Form, ensures a maintainable and high-performance codebase. We follow clear design principles—usability, accessibility, and responsiveness—to serve construction teams effectively. Testing at every level (unit, integration, E2E, visual) keeps our UI reliable. Finally, our performance optimizations guarantee a fast, smooth experience for all users. This setup aligns with our goals of scalability, clarity, and compliance (GDPR/KVKK), setting us up for successful growth and future enhancements.
