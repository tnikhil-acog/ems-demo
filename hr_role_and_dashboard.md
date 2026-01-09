# HR Dashboard - Role & Responsibilities

## HR's Role in the Platform

HR is responsible for **organizational-level oversight** of employees, projects, and resources across the entire company.

### Core Responsibilities

1. **Employee Lifecycle Management**
   - Onboard new employees
   - Track profile completion
   - Manage employee exits
   - Maintain employee master data

2. **Organizational Resource Oversight**
   - View all employees across all departments
   - Monitor bench (under-utilized employees)
   - Track skills inventory company-wide
   - Identify resource gaps

3. **Project & Allocation Visibility**
   - View all projects (not just own projects like managers)
   - Monitor resource distribution across projects
   - Identify over-allocated employees
   - Ensure balanced workload

4. **Transfer Request Facilitation**
   - Final approval for cross-project transfers
   - Resolve conflicts between managers
   - Ensure fair resource allocation

5. **Analytics & Reporting**
   - Workforce metrics (headcount, joiners, leavers)
   - Skills gap analysis
   - Department-wise utilization
   - Exit trends

---

## HR Dashboard Pages

### 1. HR Dashboard (Home)

**URL:** `/hr/dashboard`

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│  HR DASHBOARD                             Jan 9, 2026       │
│  Welcome, [HR Name]                                         │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  QUICK STATS (4 Cards)                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ ACTIVE   │ │ NEW HIRES│ │ ON BENCH │ │ EXITS    │     │
│  │ EMPLOYEES│ │ (Q1 2026)│ │          │ │ PENDING  │     │
│  │   95     │ │    5     │ │    12    │ │    2     │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│                                                             │
│  ──────────────────────────────────────────────────────────│
│                                                             │
│  ONBOARDING (Left)          EXITS (Right)                   │
│  ┌───────────────────┐     ┌───────────────────┐          │
│  │ 3 Incomplete      │     │ 2 In Process      │          │
│  │                   │     │                   │          │
│  │ John: 25% ████░░░ │     │ Alice: 6 days     │          │
│  │ Jane: 40% ██████░ │     │ Bob: 13 days      │          │
│  │ Mike: 60% █████████│     │                   │          │
│  │                   │     │ [Manage Exits]    │          │
│  │ [View All]        │     │                   │          │
│  └───────────────────┘     └───────────────────┘          │
│                                                             │
│  ──────────────────────────────────────────────────────────│
│                                                             │
│  DEPARTMENT ANALYTICS (Full Width)                          │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Engineering: 35 employees | 97% utilized | 1 bench   │ │
│  │ ████████████████████████░░                            │ │
│  │                                                       │ │
│  │ Operations: 25 employees | 96% utilized | 1 bench    │ │
│  │ ███████████████████████░░░                            │ │
│  │                                                       │ │
│  │ Sales: 15 employees | 87% utilized | 2 bench          │ │
│  │ ████████████████░░░░░░░░░                             │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  TOP SKILLS (Bottom)                                        │
│  React: 28 | TypeScript: 25 | Node.js: 22 | Python: 20     │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Key Insights:**
- Company-wide headcount and trends
- Onboarding progress for new hires
- Upcoming exits requiring attention
- Department utilization rates
- Skills distribution

---

### 2. Employee Directory

**URL:** `/hr/employees`

**Purpose:** Master list of all employees with full CRUD access

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│  EMPLOYEE DIRECTORY (95 employees)                          │
│  [+ Add Employee] [Import CSV] [Export]                     │
│                                                             │
│  FILTERS: [Dept ▼] [Status ▼] [Location ▼]                │
│  Search: [_______________] 🔍                               │
│  ──────────────────────────────────────────────────────────│
│                                                             │
│  ┌────────────────────────────────────────────────────────┐│
│  │ID  │Name        │Dept  │Status│Alloc│Avail│Actions   ││
│  ├────┼────────────┼──────┼──────┼─────┼─────┼──────────┤│
│  │E001│John Smith  │Eng   │Active│100% │  0% │⋮         ││
│  │E002│Jane Doe    │Eng   │Active│ 90% │ 10% │⋮         ││
│  │E003│Mike Chen   │Eng   │Active│ 40% │ 60% │⋮         ││
│  │E025│Alice W.    │Eng   │Exit  │ 60% │ 40% │⋮         ││
│  │...                                                     ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
│  Actions: View Profile, Edit, Initiate Exit, View Projects │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**HR Powers:**
- Add/edit employee details
- View all employees (not just one department)
- Initiate exits
- Import/export employee data

---

### 3. Onboarding Manager

**URL:** `/hr/onboarding`

**Purpose:** Track profile completion for new hires

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│  ONBOARDING MANAGER                                         │
│                                                             │
│  Overview: 3 Pending | 5 Completed (Last 30 Days)          │
│  ──────────────────────────────────────────────────────────│
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 👤 John Smith | Developer | Engineering               │ │
│  │ Joined: Jan 5 (3 days ago)                            │ │
│  │                                                       │ │
│  │ Profile Completion: 25% ████░░░░░░░░░░░░░             │ │
│  │                                                       │ │
│  │ Missing:                                              │ │
│  │ ☐ Profile Picture                                     │ │
│  │ ☐ Skills (0/3 required)                               │ │
│  │ ☐ Resume                                              │ │
│  │ ☐ Education                                           │ │
│  │ ☑ Bio                                                 │ │
│  │                                                       │ │
│  │ [Send Reminder] [View Profile]                        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  [Send Bulk Reminder]                                       │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**HR Actions:**
- Monitor all new hires' onboarding progress
- Send reminders to incomplete profiles
- Escalate overdue (>30 days) to managers

---

### 4. Exit Management

**URL:** `/hr/exits`

**Purpose:** Manage employee departures

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│  EXIT MANAGEMENT                        [Initiate New Exit]│
│                                                             │
│  In Progress: 2 | Exited This Month: 3                     │
│  ──────────────────────────────────────────────────────────│
│                                                             │
│  IN PROGRESS                                                │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 👤 Alice Wilson                                       │ │
│  │ Engineering | Software Developer                      │ │
│  │                                                       │ │
│  │ Last Working Day: Jan 15, 2026 (6 days)               │ │
│  │ Exit Initiated: Dec 15, 2025                          │ │
│  │                                                       │ │
│  │ Current Projects: C042 (60%), P005 (40%)              │ │
│  │                                                       │ │
│  │ [View Profile] [View Projects]                        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  EXITED (Last 30 Days)                                      │
│  • Carol Lee - Dec 31 (Finance)                             │
│  • David Park - Dec 28 (Sales)                              │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**HR Actions:**
- Initiate exits for any employee
- Track last working days
- View project handovers needed
- Monitor exits calendar

---

### 5. Skills Inventory

**URL:** `/hr/skills`

**Purpose:** Organization-wide skills view

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│  SKILLS INVENTORY                        [Export Skills]   │
│                                                             │
│  Total Skills: 85 | Trending Up: 12                        │
│  ──────────────────────────────────────────────────────────│
│                                                             │
│  ┌────────────────────────────────────────────────────────┐│
│  │Skill        │# Employees│Avg Rating│Trend              ││
│  ├─────────────┼───────────┼──────────┼───────────────────┤│
│  │React        │    28     │ ★★★★☆   │ ↑↑ High Demand   ││
│  │TypeScript   │    25     │ ★★★★☆   │ ↑↑ Growing       ││
│  │Node.js      │    22     │ ★★★☆☆   │ ↑  Growing       ││
│  │Python       │    20     │ ★★★☆☆   │ →  Stable        ││
│  │...                                                     ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
│  [Skills Gap Analysis] [View by Department]                │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**HR Uses:**
- Identify skill gaps across organization
- Plan training programs
- Support hiring decisions
- Match skills to project needs

---

### 6. All Projects View

**URL:** `/hr/projects`

**Purpose:** See all company projects (read-only, limited edit)

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│  ALL PROJECTS (35 active)                                   │
│                                                             │
│  FILTERS: [Type ▼] [Status ▼] [Department ▼]              │
│  ──────────────────────────────────────────────────────────│
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐       │
│  │ C042 - Analytics     │  │ C055 - Mobile App    │       │
│  │ Manager: Sarah J.    │  │ Manager: Tom Brown   │       │
│  │ Team: 7 | Avg: 65%   │  │ Team: 5 | Avg: 80%   │       │
│  │ Status: ✓ Healthy    │  │ Status: ⚠️ At Risk   │       │
│  │ [View Details]       │  │ [View Details]       │       │
│  └──────────────────────┘  └──────────────────────┘       │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**HR Access:**
- View all projects across all managers
- See resource distribution
- Identify over/under-utilized teams
- Support transfer decisions

---

### 7. Transfer Requests (HR Approval)

**URL:** `/hr/transfer-requests`

**Purpose:** Final approval for transfers

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│  TRANSFER REQUESTS - HR APPROVAL                            │
│                                                             │
│  Pending HR Approval: 2                                     │
│  ──────────────────────────────────────────────────────────│
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Alice Wilson Transfer                                 │ │
│  │                                                       │ │
│  │ From: E004 (Karen's project) - 40% → 10%             │ │
│  │ To: C042 (Sarah's project) - +30%                     │ │
│  │ Duration: 4 weeks                                     │ │
│  │                                                       │ │
│  │ Approvals:                                            │ │
│  │ ✓ Source Manager (Karen): Approved                   │ │
│  │ ✓ Target Manager (Sarah): Requested                  │ │
│  │ ⏳ HR: Pending                                        │ │
│  │                                                       │ │
│  │ Impact:                                               │ │
│  │ • Alice: 100% → 100% (redistribution)                │ │
│  │ • No overallocation                                   │ │
│  │ • Both projects agree                                 │ │
│  │                                                       │ │
│  │ [Approve] [Reject] [Request More Info]                │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**HR Role:**
- Final approval/rejection
- Resolve manager conflicts
- Ensure no overallocation
- Maintain fairness

---

### 8. Analytics & Reports

**URL:** `/hr/analytics`

**Purpose:** Workforce insights

**Charts:**
- Headcount Trend (line chart)
- Joiners vs Leavers (bar chart)
- Department Distribution (pie chart)
- Bench Trend Over Time (line chart)
- Skills Gap Analysis (table)
- Utilization Distribution (histogram)

---

## HR vs Manager: Key Differences

| Aspect | HR | Manager/Lead |
|--------|----|--------------| 
| **Employee Scope** | All employees company-wide | Direct reports only |
| **Project Scope** | All projects (read-only) | Own projects (full edit) |
| **Onboarding** | Monitor all new hires | Monitor own team only |
| **Exits** | Initiate any exit | Request exit for own team |
| **Transfers** | Final approval | Request/approve for own projects |
| **Skills** | Company-wide view | Team skills view |
| **Analytics** | Organization-level | Project/team-level |
| **CRUD Access** | Full employee CRUD | View-only for most |

---

## Summary

**HR handles 3 main areas:**

1. **People Operations** (70%)
   - Employee master data
   - Onboarding tracking
   - Exit management
   - Directory maintenance

2. **Resource Oversight** (20%)
   - Skills inventory
   - Bench monitoring
   - Utilization analytics
   - Transfer approvals

3. **Organizational Analytics** (10%)
   - Workforce metrics
   - Department analytics
   - Trends and reporting

**HR does NOT:**
- Manage day-to-day projects (that's manager's job)
- Assign employees to projects (managers do this)
- Track project deliverables (manager's responsibility)
- Write project reports

**HR's value:**
- Organizational-level visibility
- Fair resource distribution
- Data-driven workforce decisions
- Employee lifecycle support
