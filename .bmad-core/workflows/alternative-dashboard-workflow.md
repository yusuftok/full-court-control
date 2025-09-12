# BMAD Brownfield Workflow: Alternative Dashboard Implementation

## Full-Court Control Pro - Persistent Task List & Agent Instructions

---

## 📋 Master Task List with Agent Commands

### Phase 1: Documentation & Research

#### ✅ Step 1: Document Existing System

**Status**: COMPLETED  
**Agent**: `@architect`  
**Command**: `*document-project`  
**What This Agent Does**:

- Analyzes entire codebase structure
- Documents current dashboard implementation
- Maps component dependencies
- Identifies integration points
- Creates architecture documentation

**Output**: `.bmad-core/dashboard-architecture.md`

---

#### 🔄 Step 2: Market & Competitor Analysis

**Status**: PENDING - READY TO START  
**Agent**: `@trend-researcher`  
**Command**: No specific command - conversational

**What This Agent Does**:

1. **Analyzes market trends**:
   - Construction tech dashboard patterns
   - Successful features in Procore, PlanGrid, Autodesk
   - Industry-specific visualization needs
   - Turkish market requirements

2. **Identifies opportunities**:
   - Gap analysis vs competitors
   - Trending features to incorporate
   - Unique differentiators possible

3. **Provides insights on**:
   - Information hierarchy preferences
   - Mobile vs desktop usage patterns
   - Real-time collaboration features
   - AI-powered insights trends

**Example Questions to Ask**:

- "Analyze successful dashboard patterns in construction tech apps"
- "What are trending features in project management dashboards?"
- "How do Turkish construction companies visualize progress?"

**Output**: Market research insights to inform dashboard design

**To Activate**:

```bash
@trend-researcher
# Then ask your market analysis questions
```

---

#### 🔄 Step 3: User Behavior Research

**Status**: PENDING  
**Agent**: `@ux-researcher`  
**Command**: No specific command - conversational

**What This Agent Does**:

1. **Researches user patterns**:
   - Construction manager dashboard usage
   - Field worker vs office staff needs
   - Critical metrics and KPIs priority
   - Decision-making workflows

2. **Creates user insights**:
   - User journey maps
   - Pain points with current dashboards
   - Feature prioritization based on roles
   - Accessibility requirements

3. **Validates concepts**:
   - Dashboard layout preferences
   - Information density tolerance
   - Alert/notification preferences
   - Mobile-first vs desktop-first

**Example Questions to Ask**:

- "How do construction PMs vs field workers use dashboards differently?"
- "What metrics do construction managers check most frequently?"
- "What causes dashboard abandonment in construction apps?"

**Output**: User behavior patterns and preferences

**To Activate**:

```bash
@ux-researcher
# Then ask your user research questions
```

---

#### 🔄 Step 4: Gather Requirements

**Status**: PENDING  
**Agent**: `@pm` (Product Manager)  
**Command**: `*create-brownfield-prd`

**What This Agent Does**:

1. **Interviews you** about the enhancement:
   - "What specific enhancement or feature do you want to add?"
   - "What problems does the current dashboard have?"
   - "Who are the target users for the alternative dashboard?"
   - "What are the must-have features?"
   - "Are there any existing systems this needs to integrate with?"
   - "What are the critical constraints we must respect?"
   - "What is your timeline?"

2. **Analyzes existing documentation** from Step 1
3. **Assesses complexity** of the enhancement
4. **Creates epic/story structure** for the feature
5. **Identifies risks and integration points**
6. **Generates PRD** with:
   - Business requirements
   - User stories
   - Success criteria
   - Risk assessment
   - Timeline

**Your Input Needed**:

- Describe your vision for the alternative dashboard
- Explain what BMAD principles to apply
- Define success criteria
- Specify any constraints

**Output**: `docs/brownfield-prd.md`

**To Activate**:

```bash
@pm *create-brownfield-prd
```

---

#### Step 5: Create Brownfield Architecture

**Status**: PENDING  
**Agent**: `@architect`  
**Command**: `*create-brownfield-architecture`

**What This Agent Does**:

1. **Reviews the brownfield PRD** from Step 2
2. **Designs integration strategy**:
   - How new dashboard integrates with existing
   - Shared components strategy
   - State management approach
   - Routing architecture
3. **Plans migration approach**:
   - Feature flag implementation
   - Gradual rollout strategy
   - Rollback procedures
4. **Identifies technical risks**:
   - Performance implications
   - Component conflicts
   - State management issues
5. **Defines compatibility requirements**:
   - Browser support
   - Mobile responsiveness
   - Accessibility standards

**Output**: `docs/brownfield-architecture.md`

**To Activate** (after PRD is ready):

```bash
@architect *create-brownfield-architecture
```

---

#### Step 6: Validate Planning

**Status**: PENDING  
**Agent**: `@po` (Product Owner)  
**Command**: `*execute-checklist-po`

**What This Agent Does**:

1. **Reviews PRD and Architecture** against checklist:
   - Are requirements clear and testable?
   - Is scope well-defined?
   - Are user stories complete?
   - Is architecture sound?
2. **Validates compatibility**:
   - No breaking changes to existing dashboard
   - Preserves all current functionality
   - Maintains performance standards
3. **Checks risk mitigation**:
   - All risks identified?
   - Mitigation strategies in place?
   - Rollback plan defined?
4. **Ensures clear integration**:
   - Integration points documented
   - Dependencies identified
   - API contracts preserved

**Output**: Validation report with pass/fail/concerns

**To Activate** (after architecture is ready):

```bash
@po *execute-checklist-po
```

---

### Phase 2: Story Breakdown

#### Step 7: Shard Documents into Stories

**Status**: PENDING  
**Agent**: `@po`  
**Commands**:

```bash
@po shard docs/brownfield-prd.md
@po shard docs/brownfield-architecture.md
```

**What This Agent Does**:

1. **Breaks down PRD** into:
   - Individual story files
   - Acceptance criteria
   - Technical requirements
   - Dependencies
2. **Creates story structure**:
   ```
   docs/stories/
   ├── alternative-dashboard/
   │   ├── story-1-create-route.md
   │   ├── story-2-update-navigation.md
   │   ├── story-3-build-ui.md
   │   └── story-4-add-persistence.md
   ```
3. **Links stories** to architecture components
4. **Defines story sequence** and dependencies

**Output**: Individual story files in `docs/stories/`

---

### Phase 3: Pre-Development Quality Planning

#### Step 8: Risk Assessment

**Status**: PENDING  
**Agent**: `@qa` (Test Architect - Quinn)  
**Command**: `*risk alternative-dashboard.story-1`

**What This Agent Does**:

1. **Analyzes regression risks**:
   - What existing features might break?
   - Probability × Impact scoring
   - Legacy code dependencies
2. **Identifies integration points**:
   - Shared components affected
   - State management impacts
   - Route conflicts
3. **Assesses data risks**:
   - User preference storage
   - Migration complexity
4. **Evaluates performance risks**:
   - Additional bundle size
   - Rendering performance
   - Memory usage

**Risk Scoring**:

- Score ≥9: FAIL (must address before proceeding)
- Score 6-8: CONCERNS (mitigation required)
- Score <6: ACCEPTABLE

**Output**: `docs/qa/assessments/alternative-dashboard.story-1-risk-{date}.md`

**To Activate** (for each story):

```bash
@qa *risk alternative-dashboard.story-1
@qa *risk alternative-dashboard.story-2
# ... for each story
```

---

#### Step 9: Test Design

**Status**: PENDING  
**Agent**: `@qa`  
**Command**: `*design alternative-dashboard.story-1`

**What This Agent Does**:

1. **Plans regression tests**:
   - Existing dashboard still works
   - Navigation remains functional
   - No performance degradation
2. **Designs new feature tests**:
   - Route rendering
   - Navigation switching
   - Preference persistence
   - UI responsiveness
3. **Creates test matrix**:
   - Unit tests required
   - Integration tests needed
   - E2E test scenarios
   - Performance benchmarks
4. **Defines coverage targets**:
   - Minimum 80% code coverage
   - All critical paths tested
   - Edge cases covered

**Output**: `docs/qa/assessments/alternative-dashboard.story-1-test-design-{date}.md`

**To Activate** (after risk assessment):

```bash
@qa *design alternative-dashboard.story-1
```

---

### Phase 4: Implementation

#### Step 10: Implement Story 1 - Create Alternative Dashboard Route

**Status**: PENDING  
**Agent**: `@developer` or `@frontend-developer`  
**Manual Implementation Required**

**Developer Actions**:

1. **Create new route**:
   - Path: `/src/app/[locale]/(dashboard)/dashboard-v2/page.tsx`
   - Follow existing dashboard structure
   - Use Turkish language for UI text
2. **Setup page component**:
   - Import shared layout components
   - Configure metadata
   - Add loading states
3. **Implement route logic**:
   - Authentication check
   - Data fetching setup
   - Error boundaries

**Success Criteria**:

- [ ] Route accessible at `/tr/dashboard-v2`
- [ ] Uses existing layout wrapper
- [ ] Turkish language text
- [ ] Mobile responsive

---

#### Step 11: Implement Story 2 - Update Navigation Menu

**Status**: PENDING  
**Agent**: `@developer` or `@frontend-developer`  
**Manual Implementation Required**

**Developer Actions**:

1. **Update sidebar navigation**:
   - Add new dashboard menu item
   - Configure icon and label
   - Add "Yeni" (New) badge
2. **Implement active state**:
   - Highlight current dashboard
   - Preserve existing navigation logic
3. **Update mobile drawer**:
   - Ensure menu works on mobile
   - Test touch interactions

**Success Criteria**:

- [ ] Both dashboards in menu
- [ ] Active state indication
- [ ] Mobile responsive
- [ ] Smooth transitions

---

#### Step 12: Implement Story 3 - Build Alternative Dashboard UI

**Status**: PENDING  
**Agent**: `@frontend-developer` or `@ui-designer`  
**Manual Implementation Required**

**Developer Actions**:

1. **Design dashboard layout**:
   - Apply BMAD design principles
   - Different from original dashboard
   - Use ShadCN components
2. **Implement components**:
   - Create new widget layouts
   - Add data visualizations
   - Implement interactions
3. **Apply styling**:
   - Glass morphism effects
   - Consistent color scheme
   - Animation and transitions

**Success Criteria**:

- [ ] Unique dashboard design
- [ ] BMAD principles applied
- [ ] Turkish language UI
- [ ] Performance optimized

---

#### Step 13: Implement Story 4 - Add Preference Persistence

**Status**: PENDING  
**Agent**: `@developer`  
**Manual Implementation Required**

**Developer Actions**:

1. **Implement storage logic**:
   - Local storage for preference
   - Cookie fallback
   - Default handling
2. **Add preference hook**:
   - `usePreferredDashboard()`
   - Get/set functions
   - React context if needed
3. **Implement redirect logic**:
   - Check preference on load
   - Redirect to preferred dashboard
   - Handle first-time users

**Success Criteria**:

- [ ] Preference saved
- [ ] Restored on reload
- [ ] Works across sessions
- [ ] Graceful fallbacks

---

### Phase 5: Quality Assurance

#### Step 14: Requirements Tracing

**Status**: PENDING  
**Agent**: `@qa`  
**Command**: `*trace alternative-dashboard.story-{n}`

**What This Agent Does**:

1. **Maps requirements to implementation**:
   - All PRD requirements covered?
   - Acceptance criteria met?
   - Technical requirements satisfied?
2. **Verifies preservation**:
   - Existing features still work
   - No functionality lost
   - API contracts maintained
3. **Identifies gaps**:
   - Missing test coverage
   - Uncovered edge cases
   - Documentation needs

**When to Run**: Mid-development checkpoint

**To Activate**:

```bash
@qa *trace alternative-dashboard.story-1
```

---

#### Step 15: NFR (Non-Functional Requirements) Validation

**Status**: PENDING  
**Agent**: `@qa`  
**Command**: `*nfr alternative-dashboard.story-{n}`

**What This Agent Does**:

1. **Performance validation**:
   - Load time < 1 second
   - LCP < 2.5 seconds
   - No memory leaks
2. **Security verification**:
   - No new vulnerabilities
   - Auth properly implemented
   - Data properly scoped
3. **Accessibility check**:
   - WCAG AA compliance
   - Keyboard navigation
   - Screen reader support
4. **Compatibility testing**:
   - Browser support
   - Mobile responsiveness
   - Progressive enhancement

**To Activate**:

```bash
@qa *nfr alternative-dashboard.story-1
```

---

#### Step 16: Full Review

**Status**: PENDING  
**Agent**: `@qa`  
**Command**: `*review alternative-dashboard.story-{n}`

**What This Agent Does**:

1. **Deep code analysis**:
   - Code quality review
   - Best practices check
   - Performance analysis
2. **Integration validation**:
   - All touchpoints verified
   - No breaking changes
   - Smooth transitions
3. **Active refactoring**:
   - Suggests improvements
   - Identifies code smells
   - Optimization opportunities
4. **Comprehensive report**:
   - Issues found
   - Recommendations
   - Risk assessment

**Output**:

- QA results in story file
- Gate file: `docs/qa/gates/alternative-dashboard.story-{n}-{slug}.yml`

**To Activate**:

```bash
@qa *review alternative-dashboard.story-1
```

---

#### Step 17: Update Quality Gate

**Status**: PENDING  
**Agent**: `@qa`  
**Command**: `*gate alternative-dashboard.story-{n}`

**What This Agent Does**:

1. **Updates gate decision**:
   - PASS: Ready for production
   - FAIL: Must fix issues
   - WAIVED: Accepted with known issues
2. **Documents decisions**:
   - Technical debt accepted
   - Known limitations
   - Future improvements
3. **Final sign-off**:
   - All criteria met
   - Risks acceptable
   - Ready to deploy

**To Activate** (after addressing review issues):

```bash
@qa *gate alternative-dashboard.story-1
```

---

## 🚀 Quick Command Reference

### Research Phase

```bash
# Step 2: Market Analysis
@trend-researcher
# Ask about construction dashboard trends, competitors, etc.

# Step 3: User Research
@ux-researcher
# Ask about user behavior, preferences, pain points
```

### Planning Phase

```bash
# Step 4: Requirements
@pm *create-brownfield-prd

# Step 5: Architecture
@architect *create-brownfield-architecture

# Step 6: Validation
@po *execute-checklist-po

# Step 7: Sharding
@po shard docs/brownfield-prd.md
@po shard docs/brownfield-architecture.md
```

### Quality Planning

```bash
# Step 8: Risk Assessment
@qa *risk alternative-dashboard.story-1

# Step 9: Test Design
@qa *design alternative-dashboard.story-1
```

### Quality Validation

```bash
# Step 14: Requirements Tracing
@qa *trace alternative-dashboard.story-1

# Step 15: NFR Validation
@qa *nfr alternative-dashboard.story-1

# Step 16: Full Review
@qa *review alternative-dashboard.story-1

# Step 17: Gate Update
@qa *gate alternative-dashboard.story-1
```

---

## 📊 Progress Tracking

| Step                     | Status     | Agent             | Command                          | Output  |
| ------------------------ | ---------- | ----------------- | -------------------------------- | ------- |
| 1. Document Existing     | ✅ DONE    | @architect        | \*document-project               | Created |
| 2. Market Analysis       | 🔄 READY   | @trend-researcher | Conversational                   | Pending |
| 3. User Research         | ⏸️ WAITING | @ux-researcher    | Conversational                   | -       |
| 4. Gather Requirements   | ⏸️ WAITING | @pm               | \*create-brownfield-prd          | -       |
| 5. Create Architecture   | ⏸️ WAITING | @architect        | \*create-brownfield-architecture | -       |
| 6. Validate Planning     | ⏸️ WAITING | @po               | \*execute-checklist-po           | -       |
| 7. Shard Documents       | ⏸️ WAITING | @po               | shard                            | -       |
| 8. Risk Assessment       | ⏸️ WAITING | @qa               | \*risk                           | -       |
| 9. Test Design           | ⏸️ WAITING | @qa               | \*design                         | -       |
| 10. Story 1: Route       | ⏸️ WAITING | Developer         | Manual                           | -       |
| 11. Story 2: Navigation  | ⏸️ WAITING | Developer         | Manual                           | -       |
| 12. Story 3: UI          | ⏸️ WAITING | Developer         | Manual                           | -       |
| 13. Story 4: Persistence | ⏸️ WAITING | Developer         | Manual                           | -       |
| 14. Requirements Trace   | ⏸️ WAITING | @qa               | \*trace                          | -       |
| 15. NFR Validation       | ⏸️ WAITING | @qa               | \*nfr                            | -       |
| 16. Full Review          | ⏸️ WAITING | @qa               | \*review                         | -       |
| 17. Gate Update          | ⏸️ WAITING | @qa               | \*gate                           | -       |

---

## 📝 Important Notes

### When to Use Each Agent

**PM Agent**:

- Creating requirements
- Planning features
- Risk assessment from business perspective

**Architect Agent**:

- Technical documentation
- System design
- Integration planning

**PO Agent**:

- Validation and approval
- Story breakdown
- Priority decisions

**QA Agent (Quinn)**:

- Risk assessment
- Test planning
- Quality validation
- Gate decisions

**Developer Agents**:

- Actual implementation
- Code writing
- Bug fixing

### BMAD Principles to Apply

1. **Documentation First**: Always understand before changing
2. **Risk Assessment Early**: Identify issues before coding
3. **Test Design Upfront**: Plan tests before implementation
4. **Continuous Validation**: Check quality throughout
5. **Gate Decisions**: Clear go/no-go checkpoints

### Success Criteria for Alternative Dashboard

- [ ] Both dashboards accessible
- [ ] Seamless switching via menu
- [ ] No impact on existing dashboard
- [ ] Turkish language maintained
- [ ] Mobile responsive
- [ ] Performance unchanged
- [ ] User preference persisted
- [ ] All tests passing
- [ ] Quality gates passed

---

## 🎯 Next Action

**YOU NEED TO**: Start with market research to inform your vision:

```bash
@trend-researcher
```

Ask the agent about:

- Construction tech dashboard trends
- Competitor analysis (Procore, PlanGrid, etc.)
- Successful dashboard patterns
- Turkish market preferences

Then continue with user research:

```bash
@ux-researcher
```

After research, you'll have a clear, informed vision for the PM agent.

---

_This workflow document is saved at: `.bmad-core/workflows/alternative-dashboard-workflow.md`_  
_Access it anytime by asking: "Show me my alternative dashboard workflow"_
