\# App Flow Document

\#\# Onboarding and Sign-In/Sign-Up

A new user starts by navigating to the Full-Court Control Pro landing page or by using a direct link provided to them. The first screen prompts for an email address and explains that a one-time password (OTP) will be sent for verification. After entering their email, the user receives an OTP via Supabase Auth and enters it on the next screen. Once the OTP is confirmed, the system automatically provisions a new tenant space that is scoped to that company. The newly created tenant admin then sees an onboarding modal that offers to invite teammates and assign initial roles within their organization. To sign back in later, the user simply re-enters their email, requests a new OTP, and continues. A “Resend OTP” link is available if the code expires. Signing out is accomplished by opening the user avatar menu and selecting “Sign Out,” which safely ends the session and returns the user to the email entry screen.

\#\# Main Dashboard or Home Page

After successful authentication, the user lands on the home dashboard. If no projects yet exist, the dashboard presents a clean empty state with a simple headline and a single primary button labeled “Create Project.” Once at least one project is created, the dashboard transforms into a scan-friendly table on desktop or a dense list on mobile. Each row displays project name, start date, and overall percent complete. A fixed left rail on desktop holds the main navigation items such as Projects, Division Templates, Divisions, Tasks, Subcontractors, Analytics, Reports, and Settings. The top bar shows a notifications bell badge and the user avatar for account options. On mobile screens, the left rail is collapsed into a temporary drawer accessible via a menu icon in the top bar. From this dashboard, users can navigate to any part of the app by clicking on the relevant nav item or by selecting a project row to go deeper into that project’s pages.

\#\# Detailed Feature Flows and Page Transitions

\#\#\# Project Creation and Division Template Definition

When the user clicks the primary “Create Project” button, a full-screen form appears with a headline, supporting instructions, and a single “Save” button at the bottom. The user enters project metadata and then opens the division template editor via an inline link. A slide-up sheet reveals a tree view where the user can create and modify hierarchical division template, drag template nodes, rename them inline. Real-time inline errors appear if node names are empty or duplicate. After saving the template, the system returns to the project form where the user confirms and saves the project.

\#\#\# Project Overview and Navigation

Once the project is saved or when an existing project row is clicked from the dashboard, the user arrives at the project overview page. This page shows a summary banner with project details and a row of section links for Division Templates, Divisions, Tasks, Subcontractors, Analytics, and Reports. On desktop, these section links appear as a secondary horizontal nav; on mobile they appear as a dropdown selector. Each link immediately takes the user to that part of the project without page reloads, thanks to Next.js App Router.

\#\#\# Instantiating Actual Divisions

In the Divisions section, the user sees an “Instantiate Divisions” button if the template has not yet been mirrored. Clicking it opens the actual divisions editor, which displays a tree of instantiated nodes. The user can reorder or reparent nodes via accessible drag-and-drop interactions powered by dnd-kit. Inline editing allows renaming. Cursor-based pagination loads siblings on demand, and virtualization keeps the DOM small. After confirming the structure, the user clicks “Save,” which writes the divisions to the database and returns them to the project overview page.

\#\#\# Hierarchical Task Management and Assignment

Within the Tasks section, the user clicks an “Add Task” button to create a new root-level task. A modal prompts for task name, task type(construction/mechanical,electrical), weight, and the target division node. Options allow the user to replicate the task across peer nodes so that identical tasks appear under each chosen division. Sub-tasks can be added beneath any parent task directly in a virtualized list. Each task entry offers fields for assigning a subcontractor, setting a due date, and specifying acceptance criteria. When the user saves, the system performs an optimistic update, checks concurrency via a version column, and then confirms the final state.

\#\#\# Subcontractor Management and Role Assignment

Navigating to the Subcontractors section shows an empty-state list if no subcontractors exist. The user taps “Add Subcontractor” to open a sheet-style form where they enter company details, contact information, and upload a logo. Upon saving, the new entity appears in the list with inline actions to edit or delete. When subcontractor records exist, the Project Overview and Task screens include them in dropdowns for assignment. The user menu under Settings also provides a way to invite or assign roles to individual users within each subcontractor organization.

\#\#\# Field Worker Check-Ins and Incident Reporting

Field workers do not use the web app directly but report via WhatsApp integration. They send a message with a photo and description, which hits a secure API endpoint. Subcontractor and prime contractor engineers see these records in a unified feed under the Check-Ins & Incidents section. The feed can be filtered by project, division, date, or type. Clicking a record opens a detail view with lazy-loaded images and metadata. Engineers can add notes or update attributes. Every action is recorded in an append-only audit log that captures who made changes and when.

\#\#\# Two-Level Approval Workflow

When a new check-in or incident arrives, the subcontractor-level engineer sees an in-app notification badge on the bell icon and receives an email alert. Opening the record shows a dialog with evidence and two buttons: Approve or Reject. If rejected, a required reason field appears. Once the subcontractor approves, the record flows to the prime contractor level where a similar dialog prompts the final decision. 1st level approvals/rejections generate WhatsApp messages back to the field worker with the approval status and any comments. 2nd level approvals/rejections generate in-app notification back to the subcontractor engineer with the approval status and any comments. Each approval or rejection event is appended to the audit log.

\#\#\# Real-Time Analytics Dashboard

Selecting the Analytics section loads a dashboard with interactive charts and graphs. The charts are server-rendered until scrolled into view, at which point React-hydrated client islands enable hover tooltips and legend toggles. A filter icon opens a sheet where the user can adjust date ranges, pick division levels, or break out data by subcontractor. React Query subscriptions keep key performance indicators up to date without manual refresh. Edge caching and keyset pagination ensure smooth performance even with large data volumes.

\#\#\# On-Demand Reporting and Data Export

In the Reports section, the user clicks “Export CSV” to open a form that lets them select a project, date range, and which columns to include. Pressing the single primary button starts a background job that streams the data using keyset cursors. A toast notification confirms that the export is ready and provides a download link. Users download the file directly from their browser, and the underlying job respects seven-year data retention rules for audit logs and attachments.

\#\# Settings and Account Management

From the user avatar in the top bar, selecting Settings brings up the Account page. Here the user can update personal details such as display name, email address, and phone number. A Notifications tab lets them toggle in-app badges, email alerts, or WhatsApp messages for check-in approvals and rejections. An Organization tab provides tenant-level settings, including language preference (set to Turkish), time zone, and date formats. A Data Privacy section enables users to request full data export or deletion to comply with GDPR and KVKK. After making changes, the user clicks “Save Changes” to persist updates and can use the main navigation to return to any other section of the app.

\#\# Error States and Alternate Paths

If a user enters an invalid or expired OTP, an inline error message appears under the input with guidance to resend the code. Form validation errors appear beneath each field if the input is missing or invalid, preventing the user from saving until corrected. When network connectivity is lost, a banner appears at the top of every page alerting the user and disabling interactive elements until the connection returns. If a user tries to access a page they lack permission for, they are redirected to an error page explaining that access is forbidden and links them back to the dashboard. Image uploads that exceed 10 MB or use unsupported file types trigger a clear toast notification and prevent the upload. Long-running operations show skeleton screens or spinners to indicate progress. All unexpected errors capture details in Sentry and guide the user to retry or contact support.

\#\# Conclusion and Overall App Journey

A typical user life cycle begins with self-service signup via email OTP, automatic tenant provisioning, and initial role assignments. The admin then creates a project, defines a reusable division template, and instantiates the live division hierarchy. Tasks are created and weighted, subcontractors are managed, and on-site progress is reported by field workers via WhatsApp. Subcontractor and prime contractor engineers conduct two-level approvals, triggering in-app, email, and WhatsApp notifications. Managers and executives monitor real-time analytics and export on-demand CSV reports as needed. Throughout, users adjust personal and tenant settings, handle errors gracefully, and rely on audit logs and data retention features to maintain compliance and transparency.
