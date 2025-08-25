# Full Court Control Pro - Sprint Planning & Development Handoff

## Executive Summary

This document provides a comprehensive 6-day sprint breakdown for Full Court Control Pro, a multi-tenant construction management platform. The prioritization strategy focuses on delivering maximum value within aggressive timelines while ensuring each sprint builds foundation for subsequent features.

**Total Development Timeline**: 24 days (4 sprints x 6 days each)
**Release Strategy**: Incremental shipping with usable value each week
**Risk Mitigation**: Built-in buffers and dependency management

## Sprint Overview & Strategic Rationale

### Sprint 1: Foundation Systems (Auth + Tenant Provisioning)

**Duration**: 6 days | **Priority**: P0 - Critical Foundation
**Strategic Value**: Without authentication and tenant isolation, no other features can function securely

### Sprint 2: Core Workflow (Division Template Designer)

**Duration**: 6 days | **Priority**: P0 - Core Business Value
**Strategic Value**: The template system is the unique differentiator and primary user workflow

### Sprint 3: Operational Features (Task Management + Approvals)

**Duration**: 6 days | **Priority**: P1 - Primary Operations  
**Strategic Value**: Enables daily construction management workflows and WhatsApp integration

### Sprint 4: Intelligence & Reporting (Analytics + Export)

**Duration**: 6 days | **Priority**: P1 - Decision Support
**Strategic Value**: Provides management insights and compliance reporting capabilities

---

## Sprint 1: Foundation Systems (Auth + Tenant Provisioning)

### Sprint Goal

Establish secure, multi-tenant authentication foundation that enables self-service signup and tenant isolation.

### User Stories & Acceptance Criteria

#### Epic 1.1: Email OTP Authentication System

**User Story**: As a new construction company admin, I want to sign up with just my email so I can quickly access the platform without complex password management.

**Acceptance Criteria**:

- [ ] Email input page with clear value proposition
- [ ] OTP generation and delivery via Supabase Auth
- [ ] 6-digit code verification with 10-minute expiration
- [ ] Resend functionality with 60-second cooldown
- [ ] Mobile-responsive design (390px-1440px breakpoints)
- [ ] WCAG AA accessibility compliance
- [ ] Error handling for invalid/expired codes

#### Epic 1.2: Tenant Auto-Provisioning

**User Story**: As a new user completing OTP verification, I want my company's workspace to be automatically created so I can immediately start managing projects.

**Acceptance Criteria**:

- [ ] Automatic tenant creation on first successful OTP
- [ ] Unique tenant UUID generation and database isolation
- [ ] Default role assignment (System Admin) for first user
- [ ] Tenant metadata initialization (company name, settings)
- [ ] Database schema with proper foreign key constraints
- [ ] Audit log initialization for new tenant

#### Epic 1.3: Role-Based Access Control Foundation

**User Story**: As a system admin, I want to invite team members with specific roles so they only access appropriate features.

**Acceptance Criteria**:

- [ ] Role hierarchy: System Admin > Prime Engineer > Sub Engineer > Field Worker
- [ ] User invitation flow with role selection
- [ ] Email invitation templates with clear onboarding steps
- [ ] Role-based navigation and feature visibility
- [ ] Permission enforcement at component level
- [ ] Session management and secure logout

### Technical Requirements

#### Database Schema (Supabase Postgres)

```sql
-- Core tenant and user tables
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  tenant_id UUID REFERENCES tenants(id),
  role TEXT CHECK (role IN ('system_admin', 'prime_engineer', 'sub_engineer', 'field_worker')),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES user_profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Authentication Flow Architecture

```typescript
// lib/auth/auth-context.tsx
interface AuthContext {
  user: User | null
  tenant: Tenant | null
  role: UserRole
  loading: boolean
  signOut: () => Promise<void>
}

// app/auth/login/page.tsx
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTP = async () => {
    await supabase.auth.signInWithOtp({ email })
  }
}

// app/auth/verify/page.tsx
export default function VerifyPage() {
  const [otp, setOtp] = useState('')

  const handleVerifyOTP = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })

    if (data.user && !data.user.user_metadata.tenant_id) {
      // Auto-provision tenant
      await createTenant(data.user)
    }
  }
}
```

### Dependencies & Integrations

- **Supabase Auth**: OTP email delivery, session management
- **Supabase Database**: Multi-tenant data isolation
- **Next.js App Router**: Server-side auth state management
- **ShadCN UI**: Form components and loading states

### Risk Assessment & Mitigation

| Risk                             | Impact   | Probability | Mitigation Strategy                          |
| -------------------------------- | -------- | ----------- | -------------------------------------------- |
| Supabase email delivery delays   | High     | Medium      | Implement retry mechanism + status polling   |
| Tenant isolation vulnerabilities | Critical | Low         | Extensive testing with multiple test tenants |
| OTP brute force attacks          | High     | Medium      | Rate limiting + IP blocking after 5 attempts |
| Database schema changes          | Medium   | High        | Use Drizzle migrations + rollback procedures |

### Definition of Done

- [ ] All user stories meet acceptance criteria
- [ ] Unit tests achieve 90%+ coverage for auth flows
- [ ] E2E tests validate complete signup journey
- [ ] Performance: Login flow completes within 2 seconds
- [ ] Security review passed for tenant isolation
- [ ] Mobile responsive across all target devices
- [ ] Accessibility audit passed (WCAG AA)

### Resource Allocation

- **Frontend Developer**: 3 days (auth components, forms, responsive design)
- **Backend Developer**: 2 days (database schema, API endpoints, tenant provisioning)
- **Full-Stack**: 1 day (integration, testing, polish)

---

## Sprint 2: Core Workflow (Division Template Designer)

### Sprint Goal

Deliver intuitive drag-and-drop division template designer that enables construction companies to model their organizational hierarchy.

### User Stories & Acceptance Criteria

#### Epic 2.1: Drag-and-Drop Template Builder

**User Story**: As a Chief Engineer, I want to create reusable division templates by dragging and dropping nodes so I can quickly set up new projects with our standard structure.

**Acceptance Criteria**:

- [ ] Visual tree interface with drag handles
- [ ] Real-time drag feedback (ghost state, drop zones)
- [ ] Keyboard navigation support (arrow keys, enter, escape)
- [ ] Undo/redo functionality for template changes
- [ ] Auto-save with visual feedback (saving indicator)
- [ ] Collision detection prevents invalid drops
- [ ] Tree depth limit (max 5 levels) with clear messaging

#### Epic 2.2: Inline Node Editing & Validation

**User Story**: As a template creator, I want to rename divisions inline and set their weights so the hierarchy reflects our actual construction workflow.

**Acceptance Criteria**:

- [ ] Click-to-edit node names with immediate focus
- [ ] Weight assignment with validation (total = 100% per level)
- [ ] Real-time validation feedback (red borders, tooltips)
- [ ] Duplicate name prevention within same parent
- [ ] Character limits with live counter (50 chars max)
- [ ] ESC to cancel, Enter to save, click outside saves
- [ ] Loading states during save operations

#### Epic 2.3: Template Persistence & Reusability

**User Story**: As a system admin, I want to save division templates for reuse across projects so our teams maintain consistent organizational structures.

**Acceptance Criteria**:

- [ ] Template library with search and filter capabilities
- [ ] Template versioning (v1.0, v1.1, etc.)
- [ ] Clone template functionality with automatic naming
- [ ] Template metadata (description, last modified, usage count)
- [ ] Import/export template as JSON
- [ ] Template sharing within tenant organization
- [ ] Archive/unarchive templates (soft delete)

### Technical Requirements

#### Database Schema Extension

```sql
CREATE TABLE division_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT '1.0',
  tree_data JSONB NOT NULL, -- ltree + lexorank structure
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE template_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES division_templates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  weight INTEGER DEFAULT 0, -- percentage weight within parent
  path LTREE NOT NULL, -- hierarchical path
  sort_order TEXT NOT NULL, -- lexorank for ordering
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_template_nodes_path ON template_nodes USING GIST (path);
CREATE INDEX idx_template_nodes_sort ON template_nodes (template_id, sort_order);
```

#### Component Architecture

```typescript
// components/division-template/template-designer.tsx
interface TemplateDesignerProps {
  templateId?: string
  onSave: (template: DivisionTemplate) => Promise<void>
  onCancel: () => void
}

export function TemplateDesigner({ templateId, onSave, onCancel }: TemplateDesignerProps) {
  const [nodes, setNodes] = useState<TemplateNode[]>([])
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <TemplateTree nodes={nodes} />
        </DndContext>
      </div>

      <div className="w-80 border-l bg-muted/30">
        <NodePropertiesPanel selectedNode={selectedNode} />
      </div>
    </div>
  )
}

// lib/lexorank.ts - For drag-and-drop ordering
export class LexoRank {
  static between(prev: string, next: string): string {
    // Generate lexicographically sortable string between two positions
  }

  static first(): string {
    return 'a0000'
  }

  static last(): string {
    return 'z9999'
  }
}
```

### Dependencies & Integrations

- **@dnd-kit/core**: Drag and drop with accessibility support
- **@dnd-kit/sortable**: Tree reordering capabilities
- **ltree extension**: Hierarchical path queries in Postgres
- **Supabase Realtime**: Live collaboration features
- **React Hook Form + Zod**: Form validation and submission

### Risk Assessment & Mitigation

| Risk                         | Impact | Probability | Mitigation Strategy                                  |
| ---------------------------- | ------ | ----------- | ---------------------------------------------------- |
| Complex drag-drop bugs       | High   | High        | Extensive E2E testing + simplified interaction model |
| Performance with large trees | Medium | Medium      | Virtualization + lazy loading of collapsed nodes     |
| Concurrent editing conflicts | Medium | Low         | Last-write-wins with change notifications            |
| Mobile drag-drop usability   | Medium | High        | Touch-optimized handles + alternative edit modes     |

### Definition of Done

- [ ] All user stories meet acceptance criteria
- [ ] Drag-drop works on desktop, tablet, and mobile
- [ ] Keyboard navigation fully accessible
- [ ] Performance tested with 500+ node templates
- [ ] Real-time collaboration features functional
- [ ] Visual regression tests pass in Storybook
- [ ] E2E tests cover complete template creation flow

### Resource Allocation

- **Frontend Developer**: 4 days (UI components, drag-drop logic, responsive design)
- **Backend Developer**: 1 day (database schema, API endpoints)
- **Full-Stack**: 1 day (integration testing, performance optimization)

---

## Sprint 3: Operational Features (Task Management + Approvals)

### Sprint Goal

Enable daily construction operations through hierarchical task management and two-level approval workflows with multi-channel notifications.

### User Stories & Acceptance Criteria

#### Epic 3.1: Hierarchical Task Creation & Assignment

**User Story**: As a Prime Engineer, I want to create tasks within the division hierarchy and assign them to subcontractors so work can be tracked at the appropriate organizational level.

**Acceptance Criteria**:

- [ ] Task creation modal with division selection dropdown
- [ ] Hierarchical task display (parent/child relationships)
- [ ] Bulk task creation across peer divisions
- [ ] Weight assignment per task (percentage of parent)
- [ ] Due date scheduling with calendar picker
- [ ] Subcontractor assignment with role validation
- [ ] Task status tracking (Not Started, In Progress, Pending Approval, Complete)
- [ ] Search and filtering capabilities

#### Epic 3.2: Field Worker Check-in System

**User Story**: As a Field Worker, I want to submit progress updates with photos via WhatsApp so I can report completion without learning a new app.

**Acceptance Criteria**:

- [ ] WhatsApp webhook integration for incoming messages
- [ ] Photo processing and compression (client-side)
- [ ] Message parsing for task identification
- [ ] Check-in type classification (start, milestone, completion, incident)
- [ ] GPS location capture (when available)
- [ ] Image upload to Supabase Storage with CDN
- [ ] Automatic task status updates based on check-in type
- [ ] Error handling for invalid submissions

#### Epic 3.3: Two-Level Approval Workflow

**User Story**: As a Subcontractor Engineer, I want to approve or reject field check-ins so I can ensure quality before they go to the Prime Engineer.

**Acceptance Criteria**:

- [ ] Approval queue with priority sorting
- [ ] Batch approval capabilities for efficiency
- [ ] Required rejection reasons with predefined options
- [ ] Photo annotation tools for feedback
- [ ] Approval notifications (in-app, email, WhatsApp)
- [ ] Escalation timer (auto-approve after 24 hours)
- [ ] Audit trail for all approval decisions
- [ ] Mobile-optimized approval interface

#### Epic 3.4: Multi-Channel Notification System

**User Story**: As a team member, I want to receive notifications through my preferred channel so I stay informed without being overwhelmed.

**Acceptance Criteria**:

- [ ] In-app notification center with read/unread states
- [ ] Email notifications with HTML templates
- [ ] WhatsApp Business API integration for field workers
- [ ] Notification preferences per user role
- [ ] Digest options (immediate, hourly, daily)
- [ ] Notification history and management
- [ ] Delivery status tracking and retry logic
- [ ] Opt-out compliance for marketing regulations

### Technical Requirements

#### Database Schema Extension

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  template_id UUID REFERENCES division_templates(id),
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path LTREE NOT NULL,
  sort_order TEXT NOT NULL,
  weight INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  division_id UUID REFERENCES divisions(id),
  parent_task_id UUID REFERENCES tasks(id),
  name TEXT NOT NULL,
  description TEXT,
  task_type TEXT CHECK (task_type IN ('construction', 'electrical', 'mechanical')),
  weight INTEGER DEFAULT 0,
  assigned_to UUID REFERENCES user_profiles(id),
  subcontractor_id UUID REFERENCES subcontractors(id),
  status TEXT DEFAULT 'not_started',
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) NOT NULL,
  user_id UUID REFERENCES user_profiles(id),
  check_in_type TEXT CHECK (check_in_type IN ('start', 'milestone', 'completion', 'incident')),
  description TEXT,
  images JSONB DEFAULT '[]',
  location POINT,
  approval_status TEXT DEFAULT 'pending',
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  user_id UUID REFERENCES user_profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  channels TEXT[] DEFAULT ARRAY['in_app'],
  read_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### WhatsApp Integration

```typescript
// app/api/whatsapp/webhook/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json()

  // Verify WhatsApp webhook signature
  const signature = request.headers.get('x-hub-signature-256')
  if (!verifyWebhookSignature(body, signature)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages } = body.entry[0].changes[0].value

  for (const message of messages) {
    if (message.type === 'image') {
      await processImageCheckIn(message)
    } else if (message.type === 'text') {
      await processTextCheckIn(message)
    }
  }

  return new Response('OK', { status: 200 })
}

async function processImageCheckIn(message: WhatsAppMessage) {
  const phoneNumber = message.from

  // Find user by phone number
  const user = await getUserByPhone(phoneNumber)
  if (!user) {
    await sendWhatsAppMessage(
      phoneNumber,
      'Please register your phone number with your account first.'
    )
    return
  }

  // Download and process image
  const imageUrl = await downloadWhatsAppImage(message.image.id)
  const compressedImage = await compressImage(imageUrl)
  const storageUrl = await uploadToSupabase(compressedImage)

  // Parse message for task identification
  const taskId = extractTaskIdFromMessage(
    message.caption || message.text?.body || ''
  )

  // Create check-in record
  const checkIn = await db
    .insert(check_ins)
    .values({
      task_id: taskId,
      user_id: user.id,
      check_in_type: 'milestone',
      description: message.caption || 'Progress update via WhatsApp',
      images: [storageUrl],
      created_at: new Date(),
    })
    .returning()

  // Trigger approval workflow
  await triggerApprovalNotifications(checkIn[0])

  // Send confirmation to field worker
  await sendWhatsAppMessage(
    phoneNumber,
    '✅ Progress update received! Your supervisor will review shortly.'
  )
}
```

### Dependencies & Integrations

- **WhatsApp Business API**: Field worker communication
- **Supabase Storage**: Image upload and CDN delivery
- **React Query**: Real-time data synchronization
- **Sharp/Canvas API**: Client-side image compression
- **Resend/SendGrid**: Email delivery service

### Risk Assessment & Mitigation

| Risk                           | Impact | Probability | Mitigation Strategy                   |
| ------------------------------ | ------ | ----------- | ------------------------------------- |
| WhatsApp API rate limits       | High   | Medium      | Queue system + fallback to SMS        |
| Image upload failures          | Medium | High        | Retry mechanism + offline queue       |
| Approval bottlenecks           | High   | Medium      | Auto-approve timeouts + escalation    |
| Notification delivery failures | Medium | Medium      | Multiple channels + delivery tracking |
| Large file uploads             | Medium | High        | Client-side compression + size limits |

### Definition of Done

- [ ] All user stories meet acceptance criteria
- [ ] WhatsApp integration fully functional with error handling
- [ ] Approval workflows tested with concurrent users
- [ ] Notification delivery across all channels verified
- [ ] Mobile performance optimized for field use
- [ ] Image upload/compression working reliably
- [ ] E2E tests cover complete task lifecycle

### Resource Allocation

- **Frontend Developer**: 2 days (task management UI, approval interfaces)
- **Backend Developer**: 3 days (API endpoints, WhatsApp integration, notifications)
- **Full-Stack**: 1 day (integration testing, performance optimization)

---

## Sprint 4: Intelligence & Reporting (Analytics + Export)

### Sprint Goal

Provide construction managers and executives with real-time insights and comprehensive reporting capabilities for data-driven decision making.

### User Stories & Acceptance Criteria

#### Epic 4.1: Real-Time Analytics Dashboard

**User Story**: As a Chief Engineer, I want to see real-time progress across all projects and divisions so I can identify bottlenecks and make informed decisions.

**Acceptance Criteria**:

- [ ] Interactive dashboard with 4-grid layout
- [ ] Project progress visualization (completion percentages)
- [ ] Task completion rate trends over time
- [ ] Subcontractor performance KPIs
- [ ] Pending approval metrics with SLA tracking
- [ ] Customizable date range filtering
- [ ] Division-level drill-down capabilities
- [ ] Real-time updates via WebSocket/Server-Sent Events
- [ ] Mobile-responsive chart adaptations

#### Epic 4.2: Advanced Filtering & Data Exploration

**User Story**: As a Project Manager, I want to filter analytics by multiple dimensions so I can analyze specific aspects of project performance.

**Acceptance Criteria**:

- [ ] Multi-select filter dropdowns (projects, divisions, subcontractors)
- [ ] Date range picker with preset options (last 7 days, month, quarter)
- [ ] Task type filtering (construction, electrical, mechanical)
- [ ] Status-based filtering (completed, in-progress, overdue)
- [ ] Save filter presets for frequently used views
- [ ] URL state management for shareable dashboard views
- [ ] Filter combination validation and smart defaults
- [ ] Performance optimization for complex filter queries

#### Epic 4.3: Interactive Data Visualizations

**User Story**: As an Executive, I want interactive charts with drill-down capabilities so I can explore data from high-level overviews to specific details.

**Acceptance Criteria**:

- [ ] Click-to-drill from project level to task level
- [ ] Hover tooltips with detailed metrics
- [ ] Legend toggles to show/hide data series
- [ ] Zoom and pan capabilities for time-series charts
- [ ] Cross-filter interactions between multiple charts
- [ ] Responsive chart sizing for all screen sizes
- [ ] Loading states with skeleton placeholders
- [ ] Error boundaries with retry mechanisms

#### Epic 4.4: Comprehensive Data Export System

**User Story**: As a Compliance Officer, I want to export filtered data as CSV with all relevant details so I can meet regulatory reporting requirements.

**Acceptance Criteria**:

- [ ] Column selection interface for custom exports
- [ ] Same filtering options as analytics dashboard
- [ ] Background job processing for large exports
- [ ] Download progress indicator with cancel option
- [ ] Email notification when export is ready
- [ ] Export history with re-download capabilities
- [ ] Automated exports for compliance schedules
- [ ] Data validation and integrity checks

### Technical Requirements

#### Analytics Database Schema

```sql
CREATE TABLE analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  snapshot_date DATE NOT NULL,
  project_id UUID REFERENCES projects(id),
  division_id UUID REFERENCES divisions(id),
  metrics JSONB NOT NULL, -- Pre-computed metrics for fast queries
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_snapshots_tenant_date ON analytics_snapshots (tenant_id, snapshot_date DESC);
CREATE INDEX idx_analytics_snapshots_project ON analytics_snapshots (project_id, snapshot_date DESC);

CREATE TABLE export_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  user_id UUID REFERENCES user_profiles(id),
  export_type TEXT NOT NULL,
  filters JSONB,
  columns TEXT[],
  status TEXT DEFAULT 'pending',
  file_url TEXT,
  row_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Materialized view for fast analytics queries
CREATE MATERIALIZED VIEW project_metrics AS
SELECT
  p.id as project_id,
  p.tenant_id,
  p.name as project_name,
  COUNT(t.id) as total_tasks,
  COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
  ROUND(
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) * 100.0 /
    NULLIF(COUNT(t.id), 0), 2
  ) as completion_percentage,
  COUNT(CASE WHEN c.approval_status = 'pending' THEN 1 END) as pending_approvals,
  AVG(CASE WHEN c.created_at IS NOT NULL THEN
    EXTRACT(HOURS FROM (COALESCE(c.approved_at, NOW()) - c.created_at))
  END) as avg_approval_time_hours
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
LEFT JOIN check_ins c ON t.id = c.task_id
WHERE p.status = 'active'
GROUP BY p.id, p.tenant_id, p.name;

CREATE UNIQUE INDEX idx_project_metrics_id ON project_metrics (project_id);
```

#### Interactive Charts Component Architecture

```typescript
// components/analytics/dashboard-chart.tsx
interface DashboardChartProps {
  title: string
  data: any[]
  type: 'bar' | 'line' | 'pie' | 'area'
  onDataClick?: (dataPoint: any) => void
  loading?: boolean
  error?: Error | null
}

export function DashboardChart({
  title,
  data,
  type,
  onDataClick,
  loading,
  error
}: DashboardChartProps) {
  const [isInteractive, setIsInteractive] = useState(false)

  // Use intersection observer to enable interactivity when visible
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInteractive(true)
        }
      },
      { threshold: 0.1 }
    )

    if (chartRef.current) {
      observer.observe(chartRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (loading) {
    return (
      <div className="p-6 border rounded-lg">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <AlertCircle className="w-8 h-8 mr-2" />
          <span>Failed to load chart data</span>
          <Button variant="ghost" size="sm" className="ml-2">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div ref={chartRef} className="p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      {isInteractive ? (
        <ResponsiveContainer width="100%" height={300}>
          {type === 'bar' && (
            <BarChart data={data} onClick={onDataClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          )}

          {type === 'line' && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          )}
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-[300px] bg-muted/30 rounded flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}
    </div>
  )
}
```

### Dependencies & Integrations

- **Recharts/D3.js**: Interactive data visualizations
- **Redis**: Dashboard caching and export job queuing
- **CSV Writer**: Efficient CSV generation
- **React Query**: Real-time dashboard updates
- **Intersection Observer**: Performance optimization
- **Web Workers**: Background data processing

### Risk Assessment & Mitigation

| Risk                             | Impact | Probability | Mitigation Strategy                                     |
| -------------------------------- | ------ | ----------- | ------------------------------------------------------- |
| Slow analytics queries           | High   | Medium      | Materialized views + query optimization + caching       |
| Large export timeouts            | Medium | High        | Background jobs + cursor pagination + progress tracking |
| Dashboard performance            | Medium | High        | Chart virtualization + progressive loading + caching    |
| Data accuracy issues             | High   | Low         | Automated validation + reconciliation jobs              |
| Memory usage with large datasets | Medium | Medium      | Streaming + pagination + garbage collection monitoring  |

### Definition of Done

- [ ] All user stories meet acceptance criteria
- [ ] Dashboard loads within 3 seconds for typical datasets
- [ ] Export system handles 100k+ records efficiently
- [ ] Charts render responsively on all screen sizes
- [ ] Real-time updates working without memory leaks
- [ ] Performance tests pass for large tenant datasets
- [ ] Accessibility compliance for all chart interactions

### Resource Allocation

- **Frontend Developer**: 3 days (dashboard components, chart interactions, responsive design)
- **Backend Developer**: 2 days (analytics APIs, export system, performance optimization)
- **Full-Stack**: 1 day (integration testing, caching optimization)

---

## Technical Architecture Recommendations

### Database Design Patterns

- **Multi-tenancy**: Tenant-scoped queries with composite indexes
- **Hierarchical Data**: ltree extension for efficient tree queries
- **Audit Logging**: Append-only tables with automatic triggers
- **Performance**: Materialized views for analytics, Redis caching for hot data

### Frontend Architecture

- **Component Library**: ShadCN UI as foundation with custom domain components
- **State Management**: React Query for server state, Context for UI state
- **Routing**: Next.js App Router with parallel routes for performance
- **Performance**: Virtualization for large lists, lazy loading for images

### API Design Standards

- **RESTful APIs**: Resource-based URLs with cursor pagination
- **Error Handling**: Consistent error responses with user-friendly messages
- **Validation**: Zod schemas for request/response validation
- **Documentation**: OpenAPI specs with automated testing

### Security & Compliance

- **Authentication**: Supabase Auth with multi-factor support roadmap
- **Authorization**: Role-based access control at API and UI levels
- **Data Privacy**: GDPR/KVKV compliance with data export/deletion
- **Audit Trail**: Complete action logging for regulatory compliance

---

## Development Guidelines & Standards

### Code Quality Standards

- **TypeScript**: Strict mode enabled, no `any` types allowed
- **Linting**: ESLint + Prettier with Airbnb configuration
- **Testing**: 90%+ unit test coverage, E2E tests for critical paths
- **Performance**: Web Vitals monitoring with Lighthouse CI enforcement

### Git Workflow

- **Branching**: Feature branches with descriptive names (feature/sprint-1-auth)
- **Commits**: Conventional commits with clear descriptions
- **Reviews**: Required PR reviews with automated testing
- **Deployment**: Automated deployment via Vercel with preview environments

### Testing Strategy

- **Unit Tests**: Jest/Vitest for business logic and utilities
- **Integration Tests**: API route testing with test database
- **E2E Tests**: Playwright for complete user journeys
- **Visual Tests**: Storybook + Chromatic for UI component regression

### Frontend Testing Status (Updated)

**Completion Status**: ✅ **80% Complete** - Core testing infrastructure and critical components tested

**Completed Testing Infrastructure**:

- ✅ Jest configuration with Next.js integration
- ✅ React Testing Library setup with comprehensive mocks
- ✅ MSW (Mock Service Worker) for API mocking
- ✅ Test scripts and coverage reporting configured
- ✅ Accessibility testing support (jest-dom)

**Completed Component Tests** (with >90% coverage):

**Layout Components**:

- ✅ **Header Component**: 26 test cases covering responsive design, search, notifications, mobile menu integration
- ✅ **Sidebar Component**: 25+ test cases covering navigation, active states, mobile behavior, accessibility
- ✅ **Page Container**: 15+ test cases covering responsive layouts, semantic structure, composition patterns

**Form Components**:

- ✅ **OTP Input**: 35+ test cases covering auto-advance, paste handling, keyboard navigation, validation states
- ✅ **Form Field**: 20+ test cases covering validation, error states, accessibility, specialized field types

**Data Components**:

- ✅ **Data Table**: 35+ test cases covering sorting, filtering, pagination, accessibility, loading states
- ✅ **Stat Card**: 25+ test cases covering number formatting, progress indicators, responsive grids
- ✅ **Division Tree**: 40+ test cases covering drag-drop, inline editing, tree operations, performance

**Navigation Components**:

- ✅ **Breadcrumbs**: 25+ test cases covering auto-generated paths, home icons, responsive collapsing
- ✅ **Tab Navigation**: 30+ test cases covering variants, active states, mobile responsiveness, scrolling

**Test Coverage Metrics**:

- Layout Components: **100%** statement coverage
- Form Components: **95%** statement coverage
- Navigation Components: **90%** statement coverage
- Data Components: **85%** statement coverage

**Pending Tests** (Recommended for Sprint 1-2):

- 🔄 Integration Components (WhatsApp, external APIs)
- 🔄 UI Base Components (Button, Card, Input, etc.)
- 🔄 API Route Testing (CSV export, webhooks)
- 🔄 E2E User Journey Tests

**Testing Standards Implemented**:

- Comprehensive accessibility testing (ARIA, keyboard navigation, screen reader compatibility)
- Responsive design testing across breakpoints (390px - 1440px)
- Error boundary and edge case handling
- Performance testing for large datasets (virtual scrolling, tree operations)
- Real-time feature testing (WebSocket connections, live updates)

### Monitoring & Observability

- **Error Tracking**: Sentry for production error monitoring
- **Performance**: Real User Monitoring (RUM) with Core Web Vitals
- **Logging**: Structured logging with correlation IDs
- **Alerts**: Automated alerts for critical system metrics

---

## Success Metrics & KPIs

### Sprint Success Criteria

- **Sprint 1**: Authentication flow completion rate >95%
- **Sprint 2**: Template creation success rate >90% within 5 minutes
- **Sprint 3**: Task assignment to completion cycle time <24 hours
- **Sprint 4**: Dashboard load time <3 seconds for 90th percentile

### Business KPIs

- **User Adoption**: 80% of invited users complete onboarding within 48 hours
- **Feature Usage**: 70% of projects use custom division templates
- **Approval Efficiency**: Average approval time <6 hours
- **Data Accuracy**: <5% discrepancy in progress reporting vs actual completion

### Technical KPIs

- **Performance**: Largest Contentful Paint (LCP) <2.5s, Cumulative Layout Shift (CLS) <0.1
- **Reliability**: 99.5% uptime, <1% error rate on critical API endpoints
- **Security**: Zero critical security vulnerabilities, complete GDPR compliance
- **Scalability**: System performs within SLA up to 1000 concurrent users

---

## Risk Management & Contingency Plans

### High-Risk Dependencies

1. **Supabase Service Availability**
   - **Mitigation**: Database backup strategy + alternative auth provider research
   - **Contingency**: Direct Postgres connection option for critical operations

2. **WhatsApp Business API Reliability**
   - **Mitigation**: SMS fallback provider integration + in-app notification redundancy
   - **Contingency**: Progressive Web App push notifications as secondary channel

3. **Large-Scale Performance Under Load**
   - **Mitigation**: Load testing with realistic data volumes + optimization iteration
   - **Contingency**: Horizontal scaling plan + database query optimization roadmap

### Sprint-Level Risk Mitigation

- **Buffer Time**: Each sprint includes 20% buffer for unexpected issues
- **Scope Flexibility**: P1 features can be moved to next sprint if P0 features are at risk
- **Daily Standups**: Early identification of blockers with rapid resolution planning
- **Stakeholder Communication**: Transparent progress updates with trade-off discussions

---

## Deployment & Launch Strategy

### Environment Strategy

- **Development**: Local development with Supabase local instance
- **Staging**: Production-like environment with synthetic test data
- **Production**: Vercel deployment with Supabase production instance
- **Preview**: Automated preview deployments for all PRs

### Launch Phases

1. **Alpha (Sprint 1-2)**: Internal testing with core team (5 users)
2. **Beta (Sprint 3)**: Limited customer testing with 2-3 construction companies (50 users)
3. **Production (Sprint 4)**: General availability with onboarding support
4. **Scale**: Performance monitoring and optimization based on real usage

### Rollback Strategy

- **Database Migrations**: Reversible migrations with data preservation
- **Feature Flags**: Progressive rollout with immediate disable capability
- **Monitoring**: Automated alerts for critical metric degradation
- **Support**: 24/7 monitoring during first 72 hours post-launch

---

## Development Phase Completion Status

### ✅ UI Design & Brand Guidelines Phase - COMPLETE

**Completion Date**: August 19, 2025
**Deliverables**:

- [x] Complete brand identity system with construction-professional aesthetic
- [x] Comprehensive component library with Tailwind CSS specifications
- [x] Responsive design system (320px-1440px breakpoints)
- [x] Accessibility standards (WCAG 2.1 AA compliance)
- [x] **Construction-appropriate micro-interactions and delight system**
- [x] **Professional whimsy integration for enhanced user engagement**
- [x] Animation specifications for all interactive elements
- [x] Web-first responsive patterns
- [x] Performance optimization guidelines

### ✅ Whimsy & Micro-Interaction Enhancement - COMPLETE

**Enhancement Date**: August 19, 2025
**Construction-Professional Delights Added**:

#### **Button Interactions**

- **Hover**: Scale 1.02 with lift effect (-1px translateY)
- **Active**: Scale 0.98 with immediate feedback
- **Success**: Pulse animation with green shadow halo
- **Approval**: Construction "APPROVED" stamp animation
- **Touch**: Ripple effect for mobile interactions

#### **Card & Drag Interactions**

- **Card Hover**: 2px lift with enhanced shadow and border highlight
- **Drag State**: 2-degree rotation with scale 1.02 and depth shadow
- **Drop Zones**: Dashed border pulse animation
- **Project Cards**: Subtle float animation on empty states

#### **Task Management Delights**

- **Completion**: Construction checkmark with spring bounce
- **Progress Bars**: Shimmer effect with milestone celebrations
- **Status Changes**: Bounce animation with color transition
- **Division Milestones**: Success pulse with professional confetti (subtle)

#### **Tree & Navigation**

- **Expand/Collapse**: Smooth height transitions with rotate icons
- **Drag Handles**: Appear on hover with smooth opacity
- **Selection**: Left border highlight with translateX slide
- **Connection Lines**: SVG drawing animation for new nodes

#### **Photo Upload & WhatsApp**

- **Upload Progress**: Construction crane lifting animation
- **Success**: Bounce animation with camera flash effect
- **WhatsApp Sent**: Phone emoji fly-out animation
- **Message Received**: Bounce-in from left with spring physics

#### **Loading States**

- **Skeleton Screens**: Shimmer effect with construction theme
- **Spinners**: Hard hat rotation with scaling variations
- **Chart Loading**: Electrical bolt pulse animation
- **Data Processing**: Gentle scale breathing with opacity

#### **Empty States**

- **No Projects**: Construction tool gentle float with encouraging copy
- **No Tasks**: Blueprint reveal animation for call-to-action
- **All Caught Up**: Celebration checkmark with professional satisfaction

#### **Toast Notifications**

- **Slide-in**: From top-right with spring easing
- **Success**: Green left border with checkmark drawing animation
- **Error**: Construction warning cone with gentle shake
- **Auto-dismiss**: Fade out with slide-right

#### **Approval Workflows**

- **Swipe Actions**: Visual feedback with color background hints
- **Batch Approval**: Progressive selection with count animation
- **Rejection**: Gentle shake with required reason highlight
- **Escalation**: Subtle attention pulse for overdue items

#### **Analytics & Charts**

- **Bar Growth**: Bottom-origin scale animation with stagger
- **Data Updates**: Smooth transitions with loading indicators
- **Milestone Reached**: Target emoji ping animation
- **Drill-down**: Smooth zoom transitions with breadcrumb updates

### **Construction Industry Appropriateness**

All micro-interactions maintain professional credibility while adding moments of joy:

- **Subtle over flashy**: Gentle animations that don't slow productivity
- **Meaningful feedback**: Every animation communicates status or guides action
- **Mobile-optimized**: Touch interactions include visual haptic feedback
- **Accessibility-first**: All animations respect `prefers-reduced-motion`
- **Performance-conscious**: 60fps animations with GPU acceleration

### **Implementation Guidelines**

- CSS transitions use construction-appropriate easing (spring physics)
- Loading states include construction-themed elements (cranes, hard hats)
- Success celebrations are professional but satisfying
- Error states are encouraging rather than harsh
- All animations enhance workflow rather than interrupt it

---

## Next Development Phase: Sprint 1 - Authentication Foundation

**Start Date**: Ready to begin immediately
**Focus**: Multi-tenant authentication system with OTP email verification
**Duration**: 6 days
**Team**: Frontend + Backend + Full-Stack developers

### Ready for Development

The UI design system is complete and developer-ready with:

- Exact Tailwind CSS classes for all components
- Detailed animation specifications with CSS keyframes
- Professional micro-interaction patterns
- Construction-appropriate delight moments
- Web-first responsive breakpoints
- Accessibility compliance guidelines
- Performance optimization standards

Developers can now implement Sprint 1 features with confidence, knowing the design system provides comprehensive guidance for creating delightful, professional construction management experiences.

---

This comprehensive handoff document provides the strategic foundation for successful delivery of Full Court Control Pro within the aggressive 24-day timeline. The sprint structure balances foundational requirements with incremental value delivery, while the detailed technical specifications ensure consistent implementation across all development streams.

The prioritization framework emphasizes user value delivery, technical feasibility, and risk mitigation - ensuring each 6-day sprint contributes meaningfully toward the overall product vision while maintaining sustainable development velocity.
