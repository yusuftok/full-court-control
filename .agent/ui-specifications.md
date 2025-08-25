# Full Court Control Pro - UI Specifications & Brand Guidelines

## Brand Foundation

### Brand Mission

Empowering construction professionals with reliable, efficient project management tools that simplify complex workflows and enhance team collaboration.

### Brand Values

- **Reliability**: Dependable tools that construction teams can trust
- **Efficiency**: Streamlined workflows that save time and reduce errors
- **Clarity**: Clear, intuitive interfaces that reduce learning curves
- **Collaboration**: Seamless communication across all project roles
- **Industry Expertise**: Built by people who understand construction challenges

### Brand Personality

- **Professional**: Serious about construction business needs
- **Approachable**: Friendly without being casual
- **Confident**: Assured in our industry knowledge
- **Practical**: Focused on real-world construction solutions
- **Trustworthy**: Reliable partner for critical project management

### Brand Voice & Tone

**Voice Characteristics:**

- Clear and direct communication
- Industry-knowledgeable but not jargon-heavy
- Helpful and supportive
- Results-oriented

**Tone Guidelines:**

- **Professional**: Maintain industry credibility
- **Supportive**: Help users succeed
- **Efficient**: Respect users' time constraints
- **Encouraging**: Build confidence in digital adoption

**Writing Style:**

- Use active voice
- Keep sentences concise
- Lead with benefits
- Use construction terminology appropriately
- Provide clear next steps

**Example Voice Applications:**

- Error messages: "Let's fix this quickly so you can get back to work"
- Success messages: "Great! Your team can now see the updated status"
- Onboarding: "Set up your first project in under 5 minutes"
- CTAs: "Start your project," "Invite your team," "Review approvals"

## Visual Identity System

### Logo System

**Primary Logo:**

- Logotype: "Full Court Control Pro" in Inter Bold
- Minimum size: 120px wide (digital), 1 inch wide (print)
- Clear space: 0.5x logo height on all sides

**Secondary Mark:**

- Icon: "FCC Pro" abbreviation in circular badge
- Used for favicons, app icons, small spaces
- Minimum size: 16x16px

**Logo Usage Guidelines:**

- Primary logo on white/light backgrounds
- White logo on dark backgrounds
- Never stretch, rotate, or add effects
- Maintain clear space requirements
- Use official logo files only

### Color Palette

#### Primary Colors

```css
/* Brand Primary - Professional Blue */
--brand-primary: #1e40af; /* Primary actions, headers */
--brand-primary-50: #eff6ff; /* Light backgrounds */
--brand-primary-100: #dbeafe; /* Hover states */
--brand-primary-200: #bfdbfe; /* Disabled states */
--brand-primary-600: #2563eb; /* Interactive elements */
--brand-primary-700: #1d4ed8; /* Pressed states */
--brand-primary-900: #1e3a8a; /* Dark text */

/* Brand Secondary - Construction Orange */
--brand-secondary: #ea580c; /* Accent actions, warnings */
--brand-secondary-50: #fff7ed; /* Light backgrounds */
--brand-secondary-100: #ffedd5; /* Hover states */
--brand-secondary-600: #dc2626; /* Interactive elements */
--brand-secondary-700: #b91c1c; /* Pressed states */
```

#### Functional Colors

```css
/* Success States */
--success: #10b981; /* Green for completed tasks */
--success-50: #ecfdf5;
--success-100: #d1fae5;
--success-700: #047857;

/* Warning States */
--warning: #f59e0b; /* Amber for pending approvals */
--warning-50: #fffbeb;
--warning-100: #fef3c7;
--warning-700: #b45309;

/* Error States */
--error: #ef4444; /* Red for failed/rejected items */
--error-50: #fef2f2;
--error-100: #fee2e2;
--error-700: #c53030;

/* Information */
--info: #3b82f6; /* Blue for informational states */
--info-50: #eff6ff;
--info-100: #dbeafe;
--info-700: #1d4ed8;
```

#### Neutral Palette

```css
/* Gray Scale */
--gray-50: #f9fafb; /* Page backgrounds */
--gray-100: #f3f4f6; /* Card backgrounds */
--gray-200: #e5e7eb; /* Borders, dividers */
--gray-300: #d1d5db; /* Input borders */
--gray-400: #9ca3af; /* Placeholder text */
--gray-500: #6b7280; /* Secondary text */
--gray-600: #4b5563; /* Body text */
--gray-700: #374151; /* Headings */
--gray-800: #1f2937; /* Dark headings */
--gray-900: #111827; /* Primary text */
```

#### Semantic Color Usage

```css
/* Text Colors */
--text-primary: var(--gray-900); /* Main content */
--text-secondary: var(--gray-600); /* Supporting text */
--text-muted: var(--gray-500); /* Captions, metadata */
--text-inverse: #ffffff; /* Text on dark backgrounds */

/* Background Colors */
--bg-primary: #ffffff; /* Main content areas */
--bg-secondary: var(--gray-50); /* Page backgrounds */
--bg-muted: var(--gray-100); /* Subtle backgrounds */

/* Border Colors */
--border-primary: var(--gray-200); /* Default borders */
--border-muted: var(--gray-100); /* Subtle dividers */
--border-strong: var(--gray-300); /* Emphasized borders */
```

### Typography System

#### Font Family

**Primary Font: Inter**

- UI elements, headings, body text
- Modern, highly legible, construction professional-appropriate
- Web font with fallback stack

**System Font Stack:**

```css
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  'Helvetica Neue',
  Arial,
  sans-serif;
```

**Monospace Stack (for data/codes):**

```css
font-family:
  'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New',
  monospace;
```

#### Typography Scale

**Desktop (1024px+)**

```css
/* Display - Marketing/Hero sections only */
--text-display: 48px;
line-height: 1.1;
font-weight: 700;

/* Headings */
--text-h1: 32px; /* Page titles */
line-height: 1.1;
font-weight: 600;

--text-h2: 28px; /* Section headers */
line-height: 1.2;
font-weight: 600;

--text-h3: 24px; /* Subsection headers */
line-height: 1.3;
font-weight: 500;

--text-h4: 20px; /* Card headers */
line-height: 1.4;
font-weight: 500;

/* Body Text */
--text-body-lg: 18px; /* Lead text */
line-height: 1.5;
font-weight: 400;

--text-body: 16px; /* Standard body */
line-height: 1.5;
font-weight: 400;

--text-body-sm: 14px; /* Supporting text */
line-height: 1.4;
font-weight: 400;

/* UI Elements */
--text-caption: 12px; /* Captions, metadata */
line-height: 1.3;
font-weight: 400;

--text-button: 16px; /* Button labels */
line-height: 1;
font-weight: 500;

--text-label: 14px; /* Form labels */
line-height: 1.2;
font-weight: 500;
```

**Tablet (768px-1023px)**

```css
--text-h1: 28px;
--text-h2: 24px;
--text-h3: 20px;
--text-body: 16px;
```

**Mobile (320px-767px)**

```css
--text-h1: 24px;
--text-h2: 20px;
--text-h3: 18px;
--text-body: 16px;
```

#### Font Weight Usage

```css
--font-light: 300; /* Rare accent use only */
--font-regular: 400; /* Body text, captions */
--font-medium: 500; /* UI labels, buttons, H3-H4 */
--font-semibold: 600; /* H1-H2, important UI elements */
--font-bold: 700; /* Logo, display text, emphasis */
```

### Spacing System

#### Base Unit System

```css
/* 4px base unit with 8px grid alignment */
--space-0: 0px;
--space-1: 4px; /* Tight spacing */
--space-2: 8px; /* Standard gap */
--space-3: 12px; /* Comfortable spacing */
--space-4: 16px; /* Section spacing */
--space-5: 20px; /* Card padding */
--space-6: 24px; /* Large spacing */
--space-8: 32px; /* Section breaks */
--space-10: 40px; /* Major sections */
--space-12: 48px; /* Page sections */
--space-16: 64px; /* Large page breaks */
--space-20: 80px; /* Hero sections */
```

#### Spacing Usage Guidelines

**Component Spacing:**

- Input padding: `var(--space-3) var(--space-4)` (12px 16px)
- Button padding: `var(--space-3) var(--space-6)` (12px 24px)
- Card padding: `var(--space-6)` (24px)
- Section spacing: `var(--space-8)` (32px)

**Layout Spacing:**

- Grid gap: `var(--space-6)` (24px)
- List item gap: `var(--space-3)` (12px)
- Form field gap: `var(--space-4)` (16px)
- Page margins: `var(--space-6)` (24px mobile), `var(--space-12)` (48px desktop)

### Border Radius System

```css
/* Border Radius Scale */
--radius-none: 0px;
--radius-sm: 4px; /* Small inputs, tags */
--radius-md: 8px; /* Cards, buttons, modals */
--radius-lg: 16px; /* Large cards, panels */
--radius-xl: 24px; /* Hero sections */
--radius-full: 9999px; /* Pills, avatars */
```

#### Border Radius Usage

- **Input fields**: `var(--radius-sm)` (4px)
- **Buttons**: `var(--radius-sm)` (4px)
- **Cards**: `var(--radius-md)` (8px)
- **Modals**: `var(--radius-md)` (8px)
- **Avatars**: `var(--radius-full)` (circular)
- **Status badges**: `var(--radius-full)` (pill shape)

### Shadow System

```css
/* Elevation Shadows */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05); /* Subtle borders */
--shadow-sm:
  0 1px 3px rgba(0, 0, 0, 0.12), /* Cards */ 0 1px 2px rgba(0, 0, 0, 0.24);
--shadow-md:
  0 4px 6px rgba(0, 0, 0, 0.07), /* Dropdowns */ 0 2px 4px rgba(0, 0, 0, 0.12);
--shadow-lg:
  0 10px 15px rgba(0, 0, 0, 0.1), /* Modals */ 0 4px 6px rgba(0, 0, 0, 0.12);
--shadow-xl:
  0 20px 25px rgba(0, 0, 0, 0.15),
  /* Large modals */ 0 10px 10px rgba(0, 0, 0, 0.04);

/* Focus Shadows */
--shadow-focus: 0 0 0 3px rgba(30, 64, 175, 0.1); /* Focus rings */
--shadow-error: 0 0 0 3px rgba(239, 68, 68, 0.1); /* Error states */
```

#### Shadow Usage Guidelines

- **Cards**: `var(--shadow-sm)`
- **Dropdowns**: `var(--shadow-md)`
- **Modals**: `var(--shadow-lg)`
- **Tooltips**: `var(--shadow-md)`
- **Focus states**: `var(--shadow-focus)`
- **Hover states**: Slightly increase existing shadow

## Component Specifications

### Button System

#### Primary Button

```css
.button-primary {
  background-color: var(--brand-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-button);
  font-weight: var(--font-medium);
  min-height: 44px; /* Touch target */
  transition: all 0.2s ease;
}

.button-primary:hover {
  background-color: var(--brand-primary-600);
  box-shadow: var(--shadow-sm);
}

.button-primary:active {
  background-color: var(--brand-primary-700);
  transform: translateY(1px);
}

.button-primary:disabled {
  background-color: var(--gray-200);
  color: var(--gray-400);
  cursor: not-allowed;
}
```

#### Secondary Button

```css
.button-secondary {
  background-color: transparent;
  color: var(--brand-primary);
  border: 1px solid var(--brand-primary);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-button);
  font-weight: var(--font-medium);
  min-height: 44px;
  transition: all 0.2s ease;
}

.button-secondary:hover {
  background-color: var(--brand-primary-50);
}
```

#### Danger Button

```css
.button-danger {
  background-color: var(--error);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-button);
  font-weight: var(--font-medium);
  min-height: 44px;
}
```

### Form Elements

#### Input Fields

```css
.input {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-body);
  color: var(--text-primary);
  min-height: 44px;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: var(--brand-primary);
  box-shadow: var(--shadow-focus);
  outline: none;
}

.input:error {
  border-color: var(--error);
  box-shadow: var(--shadow-error);
}

.input::placeholder {
  color: var(--gray-400);
}
```

#### Form Labels

```css
.label {
  font-size: var(--text-label);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  display: block;
}

.label-required::after {
  content: '*';
  color: var(--error);
  margin-left: var(--space-1);
}
```

### Card System

#### Standard Card

```css
.card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.card-header {
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-muted);
}

.card-title {
  font-size: var(--text-h4);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin: 0;
}
```

#### Status Cards

```css
.card-success {
  border-left: 4px solid var(--success);
}

.card-warning {
  border-left: 4px solid var(--warning);
}

.card-error {
  border-left: 4px solid var(--error);
}
```

### Status System

#### Status Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-caption);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-success {
  background-color: var(--success-100);
  color: var(--success-700);
}

.badge-warning {
  background-color: var(--warning-100);
  color: var(--warning-700);
}

.badge-error {
  background-color: var(--error-100);
  color: var(--error-700);
}

.badge-info {
  background-color: var(--info-100);
  color: var(--info-700);
}

.badge-neutral {
  background-color: var(--gray-100);
  color: var(--gray-700);
}
```

#### Progress Indicators

```css
.progress {
  width: 100%;
  height: 8px;
  background-color: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--brand-primary);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.progress-bar-success {
  background-color: var(--success);
}

.progress-bar-warning {
  background-color: var(--warning);
}
```

### Navigation Elements

#### Sidebar Navigation

```css
.nav-sidebar {
  width: 240px;
  background-color: var(--bg-primary);
  border-right: 1px solid var(--border-primary);
  padding: var(--space-4);
}

.nav-item {
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: var(--font-regular);
  margin-bottom: var(--space-1);
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: var(--gray-50);
  color: var(--text-primary);
}

.nav-item-active {
  background-color: var(--brand-primary-50);
  color: var(--brand-primary);
  font-weight: var(--font-medium);
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: var(--space-3);
}
```

#### Breadcrumbs

```css
.breadcrumb {
  display: flex;
  align-items: center;
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-item:not(:last-child)::after {
  content: '/';
  margin: 0 var(--space-2);
  color: var(--gray-400);
}

.breadcrumb-link {
  color: var(--brand-primary);
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}
```

### Data Display

#### Tables

```css
.table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--bg-primary);
}

.table-header {
  background-color: var(--gray-50);
}

.table-header-cell {
  padding: var(--space-4);
  text-align: left;
  font-weight: var(--font-medium);
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-primary);
}

.table-cell {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-muted);
  font-size: var(--text-body);
  color: var(--text-primary);
}

.table-row:hover {
  background-color: var(--gray-50);
}
```

#### Lists

```css
.list {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
}

.list-item {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background-color: var(--gray-50);
}
```

## Layout System

### Grid System

#### CSS Grid Foundation

```css
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Responsive Grid */
@media (max-width: 768px) {
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1023px) {
  .grid-3,
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### Container System

```css
.container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

@media (max-width: 768px) {
  .container {
    padding: 0 var(--space-4);
  }
}

.container-sm {
  max-width: 640px;
}

.container-md {
  max-width: 768px;
}

.container-lg {
  max-width: 1024px;
}
```

### Page Layouts

#### Dashboard Layout

```css
.layout-dashboard {
  display: grid;
  grid-template-areas:
    'sidebar header'
    'sidebar main';
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

.layout-sidebar {
  grid-area: sidebar;
}

.layout-header {
  grid-area: header;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  padding: var(--space-4) var(--space-6);
}

.layout-main {
  grid-area: main;
  padding: var(--space-6);
  background-color: var(--bg-secondary);
}

@media (max-width: 768px) {
  .layout-dashboard {
    grid-template-areas:
      'header'
      'main';
    grid-template-columns: 1fr;
  }

  .layout-sidebar {
    position: fixed;
    top: 0;
    left: -240px;
    height: 100vh;
    transition: left 0.3s ease;
  }

  .layout-sidebar.open {
    left: 0;
  }
}
```

## Responsive Design System

### Breakpoints

```css
/* Mobile First Approach */
:root {
  --breakpoint-sm: 640px; /* Large mobile */
  --breakpoint-md: 768px; /* Tablet */
  --breakpoint-lg: 1024px; /* Desktop */
  --breakpoint-xl: 1280px; /* Large desktop */
  --breakpoint-2xl: 1536px; /* Extra large desktop */
}
```

### Responsive Typography

```css
/* Fluid typography for better responsive scaling */
h1 {
  font-size: clamp(24px, 4vw, 32px);
}

h2 {
  font-size: clamp(20px, 3.5vw, 28px);
}

h3 {
  font-size: clamp(18px, 3vw, 24px);
}

.text-body {
  font-size: clamp(14px, 2.5vw, 16px);
}
```

### Mobile Optimizations

#### Touch Targets

```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Increase spacing on mobile */
@media (max-width: 768px) {
  .button {
    padding: var(--space-4) var(--space-6);
  }

  .nav-item {
    padding: var(--space-4);
  }
}
```

## Animation & Microinteractions

### Professional Delight Philosophy

Full Court Control Pro uses construction-appropriate micro-interactions that:

- **Enhance productivity** without slowing down workflows
- **Provide instant feedback** for user actions
- **Build confidence** through satisfying interactions
- **Celebrate achievements** with subtle, professional animations
- **Guide users** through complex construction workflows

### Transition Standards

```css
:root {
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
  --transition-bounce: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --transition-spring: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Enhanced default transitions with spring physics */
* {
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-normal),
    transform var(--transition-spring);
}
```

### Interactive Button States

```css
/* Primary button with construction-professional micro-interactions */
.button-primary {
  transform: translateY(0);
  transition: all var(--transition-normal);
}

.button-primary:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}

.button-primary:active {
  transform: translateY(0) scale(0.98);
  transition: transform 0.1s ease;
}

.button-primary:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.3);
}

/* Success state animation */
@keyframes success-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.button-success {
  animation: success-pulse 0.6s ease-out;
}
```

### Card Hover & Drag States

```css
/* Interactive project cards */
.card {
  transform: translateY(0) rotate(0deg);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: var(--brand-primary-200);
}

/* Drag state for card reordering */
.card.dragging {
  transform: translateY(-4px) rotate(2deg) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  opacity: 0.95;
}

.card.drag-preview {
  transform: rotate(-1deg);
  opacity: 0.8;
}

/* Drop zone indication */
.drop-zone-active {
  border: 2px dashed var(--brand-primary);
  background-color: var(--brand-primary-50);
  animation: drop-zone-pulse 2s infinite;
}

@keyframes drop-zone-pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}
```

### Tree Node Interactions

```css
/* Expandable tree nodes with smooth animations */
.tree-node {
  transition: all var(--transition-normal);
}

.tree-node:hover {
  background-color: var(--gray-50);
  transform: translateX(2px);
}

.tree-node.selected {
  background-color: var(--brand-primary-50);
  border-left: 4px solid var(--brand-primary);
  transform: translateX(4px);
}

/* Tree expand/collapse animation */
.tree-children {
  overflow: hidden;
  transition: height var(--transition-slow) ease-out;
}

.tree-expand-icon {
  transition: transform var(--transition-normal);
}

.tree-expanded .tree-expand-icon {
  transform: rotate(90deg);
}

/* Drag handle appears on hover */
.tree-drag-handle {
  opacity: 0;
  transform: translateX(-4px);
  transition: all var(--transition-normal);
}

.tree-node:hover .tree-drag-handle {
  opacity: 1;
  transform: translateX(0);
}
```

### Progress Animations

```css
/* Animated progress bars with construction theme */
.progress-bar {
  position: relative;
  overflow: hidden;
  transition: width var(--transition-slow) ease-out;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: progress-shimmer 2s infinite;
}

@keyframes progress-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Milestone celebration */
@keyframes milestone-celebration {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1) rotate(5deg);
  }
  50% {
    transform: scale(1.05) rotate(-3deg);
  }
  75% {
    transform: scale(1.08) rotate(2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.milestone-achieved {
  animation: milestone-celebration 0.8s ease-out;
}
```

### Status Badge Animations

```css
/* Status change animations */
.status-badge {
  transition: all var(--transition-normal);
  position: relative;
}

.status-badge.status-changing {
  animation: status-update 0.6s ease-out;
}

@keyframes status-update {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

/* Approval success animation */
.status-approved {
  animation: approval-success 1s ease-out;
}

@keyframes approval-success {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}
```

### Loading States with Construction Themes

```css
/* Construction-themed loading animations */
@keyframes construction-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.02);
  }
}

.loading-construction {
  animation: construction-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Skeleton loader with shimmer effect */
@keyframes skeleton-shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400px 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

/* Loading spinner with construction hard hat */
@keyframes hard-hat-spin {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg) scale(1.1);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner-construction {
  animation: hard-hat-spin 2s linear infinite;
}
```

### Photo Upload & Preview Animations

```css
/* Photo upload with progress indication */
.photo-upload {
  transition: all var(--transition-normal);
}

.photo-uploading {
  position: relative;
  overflow: hidden;
}

.photo-uploading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(59, 130, 246, 0.3),
    transparent
  );
  animation: upload-progress var(--upload-duration, 3s) ease-out;
}

@keyframes upload-progress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

/* Upload success celebration */
@keyframes upload-success {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.photo-upload-success {
  animation: upload-success 0.6s ease-out;
}
```

### Toast Notification Animations

```css
/* Slide-in toast notifications */
.toast {
  transform: translateX(100%);
  opacity: 0;
  transition: all var(--transition-spring);
}

.toast.toast-enter {
  transform: translateX(0);
  opacity: 1;
}

.toast.toast-exit {
  transform: translateX(100%);
  opacity: 0;
}

/* Success toast with construction checkmark */
.toast-success {
  border-left: 4px solid var(--success);
}

.toast-success .toast-icon {
  animation: checkmark-draw 0.6s ease-out;
}

@keyframes checkmark-draw {
  0% {
    stroke-dasharray: 0, 100;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dasharray: 100, 0;
    stroke-dashoffset: 0;
  }
}
```

### Approval Swipe Animations

```css
/* Mobile swipe-to-approve interactions */
.approval-card {
  position: relative;
  transition: transform var(--transition-normal);
}

.approval-card.swiping-right {
  transform: translateX(var(--swipe-distance, 0));
  background-color: rgba(16, 185, 129, 0.1);
}

.approval-card.swiping-left {
  transform: translateX(var(--swipe-distance, 0));
  background-color: rgba(239, 68, 68, 0.1);
}

/* Swipe action indicators */
.swipe-action {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.swipe-action.visible {
  opacity: 1;
}

.swipe-approve {
  right: 1rem;
  color: var(--success);
}

.swipe-reject {
  left: 1rem;
  color: var(--error);
}
```

### Empty State Animations

```css
/* Construction-themed empty states */
.empty-state-icon {
  animation: gentle-float 3s ease-in-out infinite;
}

@keyframes gentle-float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-state.construction-theme .empty-state-icon {
  animation: construction-work 4s ease-in-out infinite;
}

@keyframes construction-work {
  0%,
  100% {
    transform: rotate(0deg) translateY(0px);
  }
  25% {
    transform: rotate(2deg) translateY(-5px);
  }
  75% {
    transform: rotate(-2deg) translateY(-5px);
  }
}
```

### Confetti Celebration System

```css
/* Subtle confetti for major achievements */
@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--brand-primary);
  animation: confetti-fall 3s linear;
}

.confetti-piece:nth-child(2n) {
  background: var(--success);
  animation-delay: 0.2s;
}

.confetti-piece:nth-child(3n) {
  background: var(--brand-secondary);
  animation-delay: 0.4s;
  width: 6px;
  height: 6px;
}
```

### Performance Considerations

```css
/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .confetti-piece,
  .skeleton,
  .progress-shimmer {
    animation: none !important;
  }
}

/* GPU acceleration for smooth animations */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* Cleanup will-change after animations */
.animation-complete {
  will-change: auto;
}
```

## Accessibility Standards

### Focus Management

```css
.focus-ring {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}

/* Remove default focus, add custom */
*:focus {
  outline: none;
}

*:focus-visible {
  box-shadow: var(--shadow-focus);
}
```

### High Contrast Mode Support

```css
@media (prefers-contrast: high) {
  :root {
    --border-primary: var(--gray-900);
    --text-secondary: var(--gray-900);
  }
}
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Implementation Guidelines

### CSS Custom Properties Structure

```css
:root {
  /* Colors */
  --brand-primary: #1e40af;
  --brand-secondary: #ea580c;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --text-h1: 32px;
  --text-body: 16px;

  /* Spacing */
  --space-4: 16px;
  --space-6: 24px;

  /* Layout */
  --radius-sm: 4px;
  --radius-md: 8px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);

  /* Transitions */
  --transition-fast: 0.15s ease;
}
```

### Design Token Usage

```javascript
// Example usage in Tailwind config
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--brand-primary)',
        'brand-secondary': 'var(--brand-secondary)',
        // ... additional tokens
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        // ... additional spacing
      },
    },
  },
}
```

### Micro-Interaction Implementation Guidelines

1. **Performance First**: All animations must maintain 60fps on mobile devices
2. **Accessibility Compliance**: Respect `prefers-reduced-motion` user preferences
3. **Progressive Enhancement**: Animations should enhance, never block functionality
4. **Construction Context**: All delights should feel appropriate for construction professionals
5. **Battery Consciousness**: Limit resource-intensive animations on mobile
6. **Meaningful Feedback**: Every animation should communicate status or guide user action
7. **Professional Restraint**: Subtle celebration over flashy effects
8. **Cross-Platform Consistency**: Animations work reliably across browsers and devices

### Component Development Standards

1. **Use semantic HTML**: Always start with proper HTML elements
2. **Progressive Enhancement**: Ensure functionality without JavaScript
3. **WCAG 2.1 AA Compliance**: Test with screen readers and keyboard navigation
4. **Performance First**: Optimize for Core Web Vitals
5. **Mobile First**: Design and develop for smallest screens first
6. **Consistent Patterns**: Follow established design patterns
7. **Error States**: Always include error and loading states
8. **Touch Friendly**: Ensure 44px minimum touch targets
9. **Animation Integration**: Include appropriate micro-interactions for all interactive elements
10. **Celebration Moments**: Identify and implement user achievement celebrations

### Testing Checklist

**Visual Testing:**

- [ ] Renders correctly at all breakpoints
- [ ] Colors match brand specifications
- [ ] Typography scales appropriately
- [ ] Spacing follows 8px grid system
- [ ] Shadows and borders are consistent
- [ ] All micro-interactions render smoothly
- [ ] Animations respect reduced-motion preferences

**Accessibility Testing:**

- [ ] Keyboard navigation works completely
- [ ] Screen reader announces all content
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators are visible
- [ ] Touch targets are 44px minimum
- [ ] Animations don't cause vestibular disorders
- [ ] All interactive feedback is accessible

**Performance Testing:**

- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] Images optimized with proper formats
- [ ] CSS and JS optimized and minified
- [ ] Animations maintain 60fps on mobile
- [ ] Memory usage stable during interactions

**Micro-Interaction Testing:**

- [ ] All button hovers provide visual feedback
- [ ] Loading states are informative and engaging
- [ ] Success states celebrate appropriately
- [ ] Error states are helpful and encouraging
- [ ] Drag operations provide clear visual feedback
- [ ] Touch interactions include haptic-like visual response
- [ ] Animations enhance rather than distract from workflows

### Brand Asset Organization

```
/public/brand/
  /logos/
    logo-primary.svg
    logo-white.svg
    logo-icon.svg
    favicon.ico
  /colors/
    brand-palette.json
    css-variables.css
  /fonts/
    Inter-Regular.woff2
    Inter-Medium.woff2
    Inter-SemiBold.woff2
  /icons/
    /system/
    /construction/
```

This comprehensive brand specification provides the foundation for building Full Court Control Pro with consistent, professional branding that serves construction professionals effectively while maintaining modern usability standards.

---

## Construction-Specific Micro-Interactions & Delightful Moments

### Philosophy: Professional Joy in Construction Workflows

Full Court Control Pro transforms mundane construction management tasks into satisfying, confidence-building experiences. Every interaction reinforces the user's expertise while celebrating their achievements.

### Task Completion Celebrations

```css
/* Task completion with construction checkmark */
.task-complete {
  position: relative;
}

.task-complete::after {
  content: '✓';
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%) scale(0);
  color: var(--success);
  font-weight: bold;
  animation: task-completion 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)
    forwards;
}

@keyframes task-completion {
  0% {
    transform: translateY(-50%) scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: translateY(-50%) scale(1.3) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-50%) scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Division completion with progress milestone */
.division-milestone {
  animation: milestone-achievement 1.2s ease-out;
}

@keyframes milestone-achievement {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(16, 185, 129, 0);
  }
}
```

### Approval Workflow Micro-Interactions

```css
/* Approval button with construction stamp effect */
.approve-button {
  position: relative;
  overflow: hidden;
}

.approve-button:active::before {
  content: 'APPROVED';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0) rotate(-15deg);
  color: var(--success);
  font-weight: bold;
  font-size: 0.8em;
  border: 2px solid var(--success);
  padding: 4px 8px;
  border-radius: 4px;
  animation: approval-stamp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

@keyframes approval-stamp {
  0% {
    transform: translate(-50%, -50%) scale(0) rotate(-15deg);
    opacity: 0;
  }
  60% {
    transform: translate(-50%, -50%) scale(1.2) rotate(-10deg);
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) scale(1) rotate(-12deg);
    opacity: 0.8;
  }
}

/* Reject with gentle shake */
.reject-button:active {
  animation: rejection-shake 0.5s ease-in-out;
}

@keyframes rejection-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
```

### Photo Upload Construction Moments

```css
/* Photo upload with construction site preview */
.photo-upload-area {
  position: relative;
  border: 2px dashed var(--gray-300);
  transition: all var(--transition-normal);
}

.photo-upload-area.dragover {
  border-color: var(--brand-primary);
  background-color: var(--brand-primary-50);
  transform: scale(1.02);
}

.photo-upload-area.dragover::before {
  content: '📸 Drop your construction photos here';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 500;
  color: var(--brand-primary);
  animation: photo-drop-hint 0.6s ease-out;
}

@keyframes photo-drop-hint {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Upload progress with construction crane */
.upload-progress {
  position: relative;
  overflow: hidden;
}

.upload-progress::before {
  content: '🏗️';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  animation: crane-lifting var(--upload-duration, 3s) linear forwards;
}

@keyframes crane-lifting {
  0% {
    left: -20px;
  }
  100% {
    left: calc(100% - 20px);
  }
}
```

### WhatsApp Integration Feedback

```css
/* WhatsApp message sent confirmation */
.whatsapp-sent {
  position: relative;
}

.whatsapp-sent::after {
  content: '📱';
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  animation: message-fly-out 1s ease-out forwards;
}

@keyframes message-fly-out {
  0% {
    transform: translateY(-50%) translateX(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-50%) translateX(20px) scale(0.8);
    opacity: 0.7;
  }
  100% {
    transform: translateY(-50%) translateX(50px) scale(0.5);
    opacity: 0;
  }
}

/* WhatsApp response received */
.whatsapp-received {
  animation: message-bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes message-bounce-in {
  0% {
    transform: translateX(-100px) scale(0.8);
    opacity: 0;
  }
  60% {
    transform: translateX(10px) scale(1.05);
    opacity: 0.9;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}
```

### Template Designer Interactions

```css
/* Node creation with construction blueprint feel */
.template-node.newly-created {
  animation: blueprint-reveal 0.8s ease-out;
}

@keyframes blueprint-reveal {
  0% {
    opacity: 0;
    transform: scale(0.8);
    filter: blur(4px);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
    filter: blur(1px);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

/* Tree connection lines drawing */
.tree-connection {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw-connection 0.6s ease-out forwards;
}

@keyframes draw-connection {
  to {
    stroke-dashoffset: 0;
  }
}

/* Node weight adjustment with visual feedback */
.weight-slider {
  position: relative;
}

.weight-slider:active::after {
  content: attr(data-weight) '%';
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gray-900);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  animation: weight-tooltip 0.3s ease-out;
}

@keyframes weight-tooltip {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}
```

### Dashboard Analytics Delights

```css
/* Chart data loading with construction theme */
.chart-loading {
  position: relative;
}

.chart-loading::before {
  content: '⚡';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  animation: data-processing 1.5s ease-in-out infinite;
}

@keyframes data-processing {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
}

/* Progress milestone celebration */
.milestone-reached {
  position: relative;
}

.milestone-reached::after {
  content: '🎯';
  position: absolute;
  top: -10px;
  right: -10px;
  animation: milestone-ping 2s infinite;
}

@keyframes milestone-ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%,
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Chart bar grow animation */
.chart-bar {
  transform-origin: bottom;
  animation: bar-grow 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes bar-grow {
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
}
```

### Error States with Construction Humor

```css
/* Construction-themed error messages */
.error-state {
  position: relative;
}

.error-construction::before {
  content: '🚧';
  position: absolute;
  left: -30px;
  top: 50%;
  transform: translateY(-50%);
  animation: construction-warning 2s ease-in-out infinite;
}

@keyframes construction-warning {
  0%,
  100% {
    transform: translateY(-50%) rotate(-5deg);
  }
  50% {
    transform: translateY(-50%) rotate(5deg);
  }
}

/* Network error with friendly messaging */
.network-error {
  animation: gentle-attention 3s ease-in-out infinite;
}

@keyframes gentle-attention {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.1);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.1);
  }
}
```

### Success Feedback System

```css
/* Project creation success */
.project-created {
  animation: project-launch 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes project-launch {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.02);
    opacity: 1;
    box-shadow: 0 8px 30px rgba(16, 185, 129, 0.3);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
  }
}

/* Team member invitation sent */
.invitation-sent {
  position: relative;
}

.invitation-sent::after {
  content: '✈️';
  position: absolute;
  top: 50%;
  right: -20px;
  transform: translateY(-50%);
  animation: invitation-fly 1.5s ease-out forwards;
}

@keyframes invitation-fly {
  0% {
    transform: translateY(-50%) translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-50%) translateX(100px) rotate(15deg);
    opacity: 0;
  }
}
```

### Mobile Touch Interactions

```css
/* Touch ripple effect for buttons */
.touch-ripple {
  position: relative;
  overflow: hidden;
}

.touch-ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple-expand 0.6s linear;
}

@keyframes ripple-expand {
  to {
    width: 300px;
    height: 300px;
    opacity: 0;
  }
}

/* Long press indication */
.long-press-active {
  animation: long-press-feedback 2s linear;
}

@keyframes long-press-feedback {
  0% {
    box-shadow: inset 0 0 0 0 rgba(30, 64, 175, 0.2);
  }
  100% {
    box-shadow: inset 0 0 0 4px rgba(30, 64, 175, 0.2);
  }
}
```

### Keyboard Navigation Enhancements

```css
/* Focus ring with construction theme */
.focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.3);
  position: relative;
}

.focus-visible::before {
  content: '';
  position: absolute;
  inset: -3px;
  border: 2px solid var(--brand-primary);
  border-radius: inherit;
  animation: focus-pulse 2s infinite;
}

@keyframes focus-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.02);
  }
}

/* Keyboard shortcut hint */
.keyboard-hint {
  position: relative;
}

.keyboard-hint:hover::after {
  content: attr(data-shortcut);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gray-900);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  animation: hint-appear 0.3s ease-out;
}

@keyframes hint-appear {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(4px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
```

These construction-specific micro-interactions create a professional yet delightful experience that:

- **Celebrates achievements** with appropriate, industry-fitting animations
- **Provides instant feedback** for all user actions
- **Guides users** through complex workflows with visual cues
- **Maintains professionalism** while adding personality
- **Enhances productivity** without being distracting
- **Works across devices** with touch and keyboard optimizations

---

# Complete Component System - Tailwind CSS Implementation

## Navigation Components

### Fixed Sidebar Navigation

**Desktop Sidebar (240px wide)**

```tsx
// Main sidebar container
const Sidebar = () => (
  <nav className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
    {/* Logo section */}
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-sm">FCC</span>
        </div>
        <span className="font-semibold text-gray-900 text-lg">
          Full Court Control Pro
        </span>
      </div>
    </div>

    {/* Navigation items */}
    <div className="flex-1 p-4 space-y-1">
      <NavItem icon={HomeIcon} label="Dashboard" href="/" active />
      <NavItem icon={FolderIcon} label="Projects" href="/projects" />
      <NavItem icon={TemplateIcon} label="Templates" href="/templates" />
      <NavItem icon={UsersIcon} label="Subcontractors" href="/subcontractors" />
      <NavItem icon={ChartIcon} label="Analytics" href="/analytics" />
      <NavItem icon={DocumentIcon} label="Reports" href="/reports" />
      <NavItem icon={CogIcon} label="Settings" href="/settings" />
    </div>
  </nav>
)

// Individual navigation item
const NavItem = ({ icon: Icon, label, href, active = false }) => (
  <a
    href={href}
    className={`
      flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200
      ${
        active
          ? 'bg-blue-50 text-blue-700 border border-blue-200'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }
    `}
  >
    <Icon
      className={`mr-3 h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-400'}`}
    />
    {label}
  </a>
)
```

**Mobile Bottom Navigation**

```tsx
const BottomNavigation = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 md:hidden">
    <div className="flex items-center justify-around">
      <BottomNavItem icon={HomeIcon} label="Home" href="/" active />
      <BottomNavItem icon={FolderIcon} label="Projects" href="/projects" />
      <BottomNavItem icon={CheckIcon} label="Tasks" href="/tasks" />
      <BottomNavItem icon={ChartIcon} label="Analytics" href="/analytics" />
      <BottomNavItem icon={UserIcon} label="Profile" href="/profile" />
    </div>
  </nav>
)

const BottomNavItem = ({ icon: Icon, label, href, active = false }) => (
  <a
    href={href}
    className="flex flex-col items-center py-2 px-3 min-w-0 flex-1"
  >
    <Icon
      className={`h-6 w-6 mb-1 ${active ? 'text-blue-600' : 'text-gray-400'}`}
    />
    <span
      className={`text-xs ${active ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
    >
      {label}
    </span>
  </a>
)
```

**Mobile Drawer Menu**

```tsx
const MobileDrawer = ({ isOpen, onClose }) => (
  <>
    {/* Overlay */}
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    />

    {/* Drawer */}
    <nav
      className={`
      fixed top-0 left-0 h-full w-80 max-w-xs bg-white z-50 md:hidden
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      flex flex-col
    `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <span className="text-lg font-semibold text-gray-900">Menu</span>
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Menu items */}
      <div className="flex-1 px-4 py-6 space-y-1">
        <DrawerNavItem icon={HomeIcon} label="Dashboard" href="/" />
        <DrawerNavItem icon={FolderIcon} label="Projects" href="/projects" />
        <DrawerNavItem
          icon={TemplateIcon}
          label="Templates"
          href="/templates"
        />
        <DrawerNavItem
          icon={UsersIcon}
          label="Subcontractors"
          href="/subcontractors"
        />
        <DrawerNavItem icon={ChartIcon} label="Analytics" href="/analytics" />
        <DrawerNavItem icon={DocumentIcon} label="Reports" href="/reports" />
        <DrawerNavItem icon={CogIcon} label="Settings" href="/settings" />
      </div>
    </nav>
  </>
)
```

### Breadcrumb Navigation

```tsx
const Breadcrumb = ({ items }) => (
  <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        {index > 0 && (
          <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
        )}
        {item.href ? (
          <a
            href={item.href}
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            {item.label}
          </a>
        ) : (
          <span className="text-gray-900 font-medium">{item.label}</span>
        )}
      </div>
    ))}
  </nav>
)

// Usage example:
// <Breadcrumb items={[
//   { label: 'Projects', href: '/projects' },
//   { label: 'Building Alpha', href: '/projects/123' },
//   { label: 'Tasks' }
// ]} />
```

## Card Components

### Standard Card System

```tsx
// Base card component
const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
  >
    {children}
  </div>
)

const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-medium text-gray-900 ${className}`}>
    {children}
  </h3>
)

const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
)

const CardFooter = ({ children, className = '' }) => (
  <div
    className={`px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg ${className}`}
  >
    {children}
  </div>
)
```

### Project Cards

```tsx
const ProjectCard = ({ project }) => (
  <Card className="hover:border-blue-200 cursor-pointer group">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div>
          <CardTitle>{project.name}</CardTitle>
          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>
    </CardHeader>

    <CardContent>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Progress</span>
          <span className="text-gray-900">{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} className="h-2" />
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-4">
        <div>
          <div className="text-lg font-semibold text-gray-900">
            {project.totalTasks}
          </div>
          <div className="text-xs text-gray-500">Total Tasks</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-green-600">
            {project.completedTasks}
          </div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-orange-600">
            {project.pendingApprovals}
          </div>
          <div className="text-xs text-gray-500">Pending</div>
        </div>
      </div>
    </CardContent>

    <CardFooter>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src={project.manager.avatar}
            alt={project.manager.name}
            className="h-6 w-6 rounded-full"
          />
          <span className="text-sm text-gray-600">{project.manager.name}</span>
        </div>
        <span className="text-sm text-gray-500">Due {project.dueDate}</span>
      </div>
    </CardFooter>
  </Card>
)
```

### Status Cards with Color Coding

```tsx
const StatusCard = ({ title, value, status, icon: Icon, trend }) => {
  const statusStyles = {
    success: 'border-l-green-500 bg-green-50',
    warning: 'border-l-yellow-500 bg-yellow-50',
    error: 'border-l-red-500 bg-red-50',
    info: 'border-l-blue-500 bg-blue-50',
    neutral: 'border-l-gray-400 bg-gray-50',
  }

  const iconStyles = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    neutral: 'text-gray-600',
  }

  return (
    <Card className={`border-l-4 ${statusStyles[status]}`}>
      <CardContent className="py-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p
                className={`text-sm flex items-center mt-2 ${
                  trend.direction === 'up'
                    ? 'text-green-600'
                    : trend.direction === 'down'
                      ? 'text-red-600'
                      : 'text-gray-500'
                }`}
              >
                {trend.direction === 'up'
                  ? '↗'
                  : trend.direction === 'down'
                    ? '↘'
                    : '→'}
                <span className="ml-1">{trend.value}</span>
              </p>
            )}
          </div>
          {Icon && (
            <div className={`p-3 rounded-full ${statusStyles[status]}`}>
              <Icon className={`h-6 w-6 ${iconStyles[status]}`} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

## Tree Components (Division/Task Hierarchy)

### Expandable Tree Structure

```tsx
const TreeView = ({ data, onNodeToggle, onNodeSelect, selectedNode }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {data.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          onToggle={onNodeToggle}
          onSelect={onNodeSelect}
          selected={selectedNode === node.id}
        />
      ))}
    </div>
  )
}

const TreeNode = ({ node, level, onToggle, onSelect, selected }) => {
  const hasChildren = node.children && node.children.length > 0
  const indentClass = level > 0 ? `ml-${level * 6}` : ''

  return (
    <div>
      {/* Node row */}
      <div
        className={`
          flex items-center py-3 px-4 border-b border-gray-100 last:border-b-0
          hover:bg-gray-50 cursor-pointer group transition-colors
          ${selected ? 'bg-blue-50 border-blue-200' : ''}
          ${indentClass}
        `}
        onClick={() => onSelect(node.id)}
      >
        {/* Expand/collapse button */}
        {hasChildren ? (
          <button
            onClick={e => {
              e.stopPropagation()
              onToggle(node.id)
            }}
            className="mr-2 p-1 rounded hover:bg-gray-200 transition-colors"
          >
            <ChevronRightIcon
              className={`h-4 w-4 text-gray-400 transform transition-transform ${
                node.expanded ? 'rotate-90' : ''
              }`}
            />
          </button>
        ) : (
          <div className="w-6 mr-2" /> // Spacer for alignment
        )}

        {/* Drag handle (visible on hover) */}
        <div className="opacity-0 group-hover:opacity-100 mr-3 cursor-move transition-opacity">
          <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Node icon */}
        <div className="mr-3">
          {node.type === 'division' && (
            <FolderIcon className="h-5 w-5 text-blue-500" />
          )}
          {node.type === 'task' && (
            <CheckSquareIcon className="h-5 w-5 text-green-500" />
          )}
          {node.type === 'category' && (
            <TagIcon className="h-5 w-5 text-purple-500" />
          )}
        </div>

        {/* Node content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-900 truncate">
                {node.name}
              </span>
              {node.weight && (
                <span className="text-sm text-gray-500">({node.weight}%)</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {node.assignee && (
                <span className="text-sm text-gray-500">{node.assignee}</span>
              )}
              {node.status && <StatusBadge status={node.status} size="sm" />}
              {node.dueDate && (
                <span className="text-sm text-gray-400">{node.dueDate}</span>
              )}
            </div>
          </div>
          {node.description && (
            <p className="text-sm text-gray-500 mt-1 truncate">
              {node.description}
            </p>
          )}
        </div>
      </div>

      {/* Children nodes */}
      {hasChildren && node.expanded && (
        <div>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onSelect={onSelect}
              selected={selected}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

## Button System

### Primary, Secondary, and Danger Buttons

```tsx
// Primary button for main actions
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-500 shadow-sm hover:shadow-md active:transform active:scale-[0.98]',
    secondary:
      'bg-white text-blue-700 border border-blue-700 hover:bg-blue-50 focus:ring-blue-500 shadow-sm hover:shadow-md',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md active:transform active:scale-[0.98]',
    ghost:
      'text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
    outline:
      'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300 shadow-sm',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-6 py-2.5 text-sm min-h-[44px]',
    lg: 'px-8 py-3 text-base min-h-[48px]',
    xl: 'px-10 py-4 text-lg min-h-[56px]',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  )
}

// Icon button variant
const IconButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  ...props
}) => (
  <Button variant={variant} size={size} className="p-2" {...props}>
    <Icon
      className={`h-${size === 'sm' ? '4' : size === 'lg' ? '6' : '5'} w-${size === 'sm' ? '4' : size === 'lg' ? '6' : '5'}`}
    />
  </Button>
)
```

### Floating Action Button (Mobile)

```tsx
const FloatingActionButton = ({ onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className="
      fixed bottom-20 right-6 z-50 md:hidden
      w-14 h-14 bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl
      flex items-center justify-center transition-all duration-200
      hover:bg-blue-800 active:scale-95
    "
    aria-label={label}
  >
    <Icon className="h-6 w-6" />
  </button>
)
```

## Form Components

### Input Fields with Floating Labels

```tsx
const FloatingLabelInput = ({
  id,
  label,
  type = 'text',
  error,
  required = false,
  value,
  onChange,
  className = '',
  ...props
}) => {
  const hasValue = value && value.length > 0

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          peer w-full px-4 pt-6 pb-2 text-gray-900 bg-white border rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          placeholder-transparent transition-all duration-200
          ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          }
          ${hasValue ? 'pt-6 pb-2' : 'pt-4 pb-4'}
        `}
        placeholder={label}
        {...props}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none
          peer-placeholder-shown:text-base peer-placeholder-shown:top-4
          peer-focus:text-xs peer-focus:top-2 peer-focus:text-blue-600
          ${hasValue || value ? 'text-xs top-2' : 'text-base top-4'}
          ${error ? 'peer-focus:text-red-600' : ''}
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

// Textarea variant
const FloatingLabelTextarea = ({
  id,
  label,
  rows = 4,
  error,
  required = false,
  value,
  onChange,
  className = '',
  ...props
}) => {
  const hasValue = value && value.length > 0

  return (
    <div className={`relative ${className}`}>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          peer w-full px-4 pt-6 pb-2 text-gray-900 bg-white border rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          placeholder-transparent transition-all duration-200 resize-vertical
          ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          }
        `}
        placeholder={label}
        {...props}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none
          peer-placeholder-shown:text-base peer-placeholder-shown:top-4
          peer-focus:text-xs peer-focus:top-2 peer-focus:text-blue-600
          ${hasValue ? 'text-xs top-2' : 'text-base top-4'}
          ${error ? 'peer-focus:text-red-600' : ''}
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}
```

### Select Dropdown with Search

```tsx
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-full bg-white border rounded-md pl-4 pr-10 py-3 text-left
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-200
            ${
              error
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300'
            }
          `}
        >
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
            {/* Search input */}
            <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Options list */}
            <div>
              {filteredOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                    setSearch('')
                  }}
                  className={`
                    w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                    ${value === option.value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}
                  `}
                >
                  {option.label}
                </button>
              ))}

              {filteredOptions.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}
```

### Form Validation States

```tsx
const FormField = ({ children, error, success, className = '' }) => (
  <div className={`space-y-1 ${className}`}>
    {children}
    {error && (
      <div className="flex items-center space-x-2 text-red-600 text-sm">
        <ExclamationCircleIcon className="h-4 w-4" />
        <span>{error}</span>
      </div>
    )}
    {success && (
      <div className="flex items-center space-x-2 text-green-600 text-sm">
        <CheckCircleIcon className="h-4 w-4" />
        <span>{success}</span>
      </div>
    )}
  </div>
)
```

## Chart Components (Using Recharts)

### Progress Chart

```tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const ProgressChart = ({ data, title }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={value => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={value => [`${value}%`, 'Progress']}
          />
          <Bar
            dataKey="progress"
            fill="#1e40af"
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)
```

### Task Completion Trend

```tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const TaskCompletionTrend = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Task Completion Rate</CardTitle>
      <p className="text-sm text-gray-500">Weekly completion percentage</p>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="week"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={value => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={value => [`${value}%`, 'Completion Rate']}
          />
          <Line
            type="monotone"
            dataKey="completion"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)
```

## Table Components

### Sortable Data Table

```tsx
const DataTable = ({
  columns,
  data,
  sortKey,
  sortDirection,
  onSort,
  onRowClick,
  loading = false,
}) => {
  if (loading) {
    return <TableSkeleton />
  }

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`
                    px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}
                  `}
                  onClick={() => column.sortable && onSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUpIcon
                          className={`h-3 w-3 ${
                            sortKey === column.key && sortDirection === 'asc'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                        />
                        <ChevronDownIcon
                          className={`h-3 w-3 -mt-1 ${
                            sortKey === column.key && sortDirection === 'desc'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                className={`
                  hover:bg-gray-50 transition-colors
                  ${onRowClick ? 'cursor-pointer' : ''}
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                `}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map(column => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400">
              <DocumentIcon className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm">
                There are no items to display at this time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Table skeleton for loading state
const TableSkeleton = () => (
  <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
    <div className="animate-pulse">
      <div className="bg-gray-50 px-6 py-3">
        <div className="flex space-x-8">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="px-6 py-4 border-t border-gray-200">
          <div className="flex space-x-8">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
)
```

## Status Badge System

### Construction Status Badges

```tsx
const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const statusConfig = {
    // Task statuses
    'not-started': {
      label: 'Not Started',
      className: 'bg-gray-100 text-gray-700 border border-gray-200',
      icon: ClockIcon,
    },
    'in-progress': {
      label: 'In Progress',
      className: 'bg-blue-100 text-blue-700 border border-blue-200',
      icon: PlayIcon,
    },
    'pending-approval': {
      label: 'Pending Review',
      className: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      icon: ExclamationTriangleIcon,
    },
    completed: {
      label: 'Completed',
      className: 'bg-green-100 text-green-700 border border-green-200',
      icon: CheckCircleIcon,
    },
    'on-hold': {
      label: 'On Hold',
      className: 'bg-red-100 text-red-700 border border-red-200',
      icon: PauseIcon,
    },

    // Approval statuses
    approved: {
      label: 'Approved',
      className: 'bg-green-100 text-green-700 border border-green-200',
      icon: CheckCircleIcon,
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-700 border border-red-200',
      icon: XCircleIcon,
    },
    'needs-revision': {
      label: 'Needs Revision',
      className: 'bg-orange-100 text-orange-700 border border-orange-200',
      icon: ExclamationTriangleIcon,
    },
  }

  const config = statusConfig[status] || statusConfig['not-started']
  const Icon = config.icon

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <span
      className={`
      inline-flex items-center space-x-1 rounded-full font-medium
      ${config.className} ${sizes[size]} ${className}
    `}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </span>
  )
}

// Priority badge variant
const PriorityBadge = ({ priority, size = 'md' }) => {
  const priorityConfig = {
    low: {
      label: 'Low',
      className: 'bg-gray-100 text-gray-600',
      dot: 'bg-gray-400',
    },
    medium: {
      label: 'Medium',
      className: 'bg-yellow-100 text-yellow-700',
      dot: 'bg-yellow-400',
    },
    high: {
      label: 'High',
      className: 'bg-orange-100 text-orange-700',
      dot: 'bg-orange-500',
    },
    urgent: {
      label: 'Urgent',
      className: 'bg-red-100 text-red-700',
      dot: 'bg-red-500',
    },
  }

  const config = priorityConfig[priority] || priorityConfig['medium']

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
      <span>{config.label}</span>
    </span>
  )
}
```

## Progress Bar Components

### Multi-segment Progress Bar

```tsx
const ProgressBar = ({
  value,
  max = 100,
  segments,
  className = '',
  showLabel = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  if (segments) {
    // Multi-segment progress bar for project phases
    return (
      <div className={`w-full ${className}`}>
        {showLabel && (
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden">
          {segments.map((segment, index) => {
            const segmentWidth = (segment.value / max) * 100
            const colors = [
              'bg-blue-500',
              'bg-green-500',
              'bg-yellow-500',
              'bg-purple-500',
              'bg-indigo-500',
            ]

            return (
              <div
                key={index}
                className={`${colors[index % colors.length]} transition-all duration-500`}
                style={{ width: `${segmentWidth}%` }}
                title={`${segment.label}: ${segment.value}%`}
              ></div>
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          {segments.map((segment, index) => (
            <span key={index}>{segment.label}</span>
          ))}
        </div>
      </div>
    )
  }

  // Single progress bar
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Completion</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            percentage >= 100
              ? 'bg-green-500'
              : percentage >= 75
                ? 'bg-blue-500'
                : percentage >= 50
                  ? 'bg-yellow-500'
                  : 'bg-orange-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

// Circular progress indicator
const CircularProgress = ({
  value,
  max = 100,
  size = 'md',
  showLabel = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const circumference = 2 * Math.PI * 45 // radius of 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <div className={`relative ${sizes[size]}`}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r="45"
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx="50%"
          cy="50%"
          r="45"
          stroke="#1e40af"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-semibold text-gray-900 ${textSizes[size]}`}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}
```

## Empty State Components

### Construction-themed Empty States

```tsx
const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  illustration = 'construction',
}) => {
  const illustrations = {
    construction: (
      <div className="mx-auto w-24 h-24 text-gray-300">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      </div>
    ),
    documents: (
      <div className="mx-auto w-24 h-24 text-gray-300">
        <DocumentIcon />
      </div>
    ),
    tasks: (
      <div className="mx-auto w-24 h-24 text-gray-300">
        <CheckSquareIcon />
      </div>
    ),
  }

  return (
    <div className="text-center py-12">
      {Icon ? (
        <Icon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
      ) : (
        illustrations[illustration]
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">{description}</p>
      {action && action}
    </div>
  )
}

// Specific empty states for construction app
const NoProjectsEmptyState = ({ onCreateProject }) => (
  <EmptyState
    illustration="construction"
    title="No projects yet"
    description="Get started by creating your first construction project. Set up divisions, assign tasks, and track progress."
    action={
      <Button onClick={onCreateProject} size="lg">
        <PlusIcon className="mr-2 h-5 w-5" />
        Create Your First Project
      </Button>
    }
  />
)

const NoTasksEmptyState = ({ onAddTask }) => (
  <EmptyState
    illustration="tasks"
    title="No tasks assigned"
    description="This division doesn't have any tasks yet. Add tasks to start tracking work progress."
    action={
      <Button variant="secondary" onClick={onAddTask}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Add First Task
      </Button>
    }
  />
)

const NoApprovalsEmptyState = () => (
  <EmptyState
    icon={CheckCircleIcon}
    title="All caught up!"
    description="No pending approvals at this time. New submissions will appear here for your review."
  />
)
```

## Loading States

### Skeleton Components

```tsx
const CardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <div className="h-5 bg-gray-300 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
      <div className="h-6 bg-gray-300 rounded-full w-20"></div>
    </div>
    <div className="space-y-3">
      <div className="h-2 bg-gray-200 rounded-full"></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center space-y-2">
          <div className="h-6 bg-gray-300 rounded w-8 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
        </div>
        <div className="text-center space-y-2">
          <div className="h-6 bg-gray-300 rounded w-8 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
        </div>
        <div className="text-center space-y-2">
          <div className="h-6 bg-gray-300 rounded w-8 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
        </div>
      </div>
    </div>
  </div>
)

const ListSkeleton = ({ items = 5 }) => (
  <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200 animate-pulse">
    {[...Array(items)].map((_, i) => (
      <div key={i} className="p-4">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-300 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>
        </div>
      </div>
    ))}
  </div>
)
```

## Modal and Dialog Components

### Confirmation Dialog

```tsx
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Dialog */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="flex space-x-3 justify-end">
              <Button variant="outline" onClick={onClose}>
                {cancelLabel}
              </Button>
              <Button
                variant={variant}
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Responsive Layout Patterns

### Dashboard Grid Layout

```tsx
const DashboardLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    {/* Desktop Sidebar */}
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col">
      <Sidebar />
    </div>

    {/* Mobile header */}
    <div className="md:hidden">
      <MobileHeader />
    </div>

    {/* Main content */}
    <div className="md:pl-60">
      <main className="p-4 md:p-8">{children}</main>
    </div>

    {/* Mobile bottom navigation */}
    <BottomNavigation />
  </div>
)

// Grid system for responsive cards
const ResponsiveGrid = ({ children, className = '' }) => (
  <div
    className={`
    grid gap-6
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
    ${className}
  `}
  >
    {children}
  </div>
)

// Two-column layout with sidebar
const TwoColumnLayout = ({ sidebar, main }) => (
  <div className="flex flex-col lg:flex-row gap-8">
    <aside className="lg:w-80 flex-shrink-0">{sidebar}</aside>
    <main className="flex-1 min-w-0">{main}</main>
  </div>
)
```

## Interactive States and Microinteractions

### Hover and Focus States

```tsx
// Enhanced button with microinteractions
const InteractiveButton = ({ children, onClick, variant = 'primary' }) => (
  <button
    onClick={onClick}
    className={`
      inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium
      rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
      transform hover:scale-[1.02] active:scale-[0.98]
      ${
        variant === 'primary'
          ? 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-500 shadow-sm hover:shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300'
      }
    `}
  >
    {children}
  </button>
)

// Card with hover animation
const AnimatedCard = ({ children, onClick }) => (
  <div
    onClick={onClick}
    className="
      bg-white border border-gray-200 rounded-lg p-6 cursor-pointer
      transition-all duration-200 hover:shadow-lg hover:-translate-y-1
      hover:border-gray-300 group
    "
  >
    {children}
  </div>
)
```

## Notification System

### Toast Notifications

```tsx
const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: 'bg-green-100 border-green-500 text-green-800',
    error: 'bg-red-100 border-red-500 text-red-800',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800',
  }

  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  }

  const Icon = icons[type]

  return (
    <div
      className={`
      fixed top-4 right-4 z-50 max-w-sm w-full
      border-l-4 p-4 rounded-md shadow-lg
      transform transition-all duration-300 ease-in-out
      ${typeStyles[type]}
    `}
    >
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
```

This comprehensive component system provides all the building blocks needed for Full Court Control Pro, with exact Tailwind CSS classes that follow the established design system. Each component includes responsive variants, interactive states, loading states, and accessibility considerations appropriate for construction professionals working across desktop and mobile devices.
