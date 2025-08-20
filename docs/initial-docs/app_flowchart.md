flowchart TD
    Start[Start] --> Auth{Authenticated}
    Auth -- No --> LoginSignup[Login or Signup]
    LoginSignup --> Auth
    Auth -- Yes --> RoleSelect{Select Role}
    RoleSelect -- System Admin --> SysAdmin[System Admin Dashboard]
    RoleSelect -- Chief Engineer --> ChiefEng[Chief Engineer Dashboard]
    RoleSelect -- Prime Engineer --> PrimeEng[Prime Contractor Engineer Dashboard]
    RoleSelect -- Subcontractor Engineer --> SubEng[Subcontractor Engineer Dashboard]
    RoleSelect -- Field Worker --> FieldWorker[Field Worker via WhatsApp]
    SysAdmin --> CreateSubs[CRUD Subcontractors]
    SysAdmin --> InviteUsers[Invite Users and Assign Roles]
    SysAdmin --> SysDashboard[Main Dashboard]
    ChiefEng --> CreateProject[Create or Modify Project]
    ChiefEng --> DefTemplate[Define Division Hierarchy Template]
    ChiefEng --> Instantiate[Instantiate Division Hierarchy]
    ChiefEng --> CreateTasks[Create Tasks and Subtasks]
    ChiefEng --> ChiefDashboard[Chief Engineer Main]
    SubEng --> ViewTasks[View Assigned Tasks]
    SubEng --> ApproveCheckins[Approve or Reject Checkins]
    SubEng --> SubDashboard[Subcontractor Engineer Main]
    PrimeEng --> ReviewSubApprovals[Review Subcontractor Approvals]
    PrimeEng --> ApproveCheckinsPrime[Approve or Reject Checkins]
    PrimeEng --> PrimeDashboard[Prime Engineer Main]
    FieldWorker --> SendCheckin[Send Checkin or Incident]
    SendCheckin --> SubEng
    SysDashboard --> Analytics[View Analytics Dashboard]
    ChiefDashboard --> Analytics
    SubDashboard --> Analytics
    PrimeDashboard --> Analytics
    Analytics --> Reporting[Export Reports]
    Reporting --> Logout[Logout]
    Analytics --> Logout
    SysDashboard --> Logout
    ChiefDashboard --> Logout
    SubDashboard --> Logout
    PrimeDashboard --> Logout
    FieldWorker --> End[End]