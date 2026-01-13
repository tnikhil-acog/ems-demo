# Aganitha EMS – Employee Management System

A modern, role-based Employee Management System built with **Next.js 16**, **React 18**, and **TypeScript**. The system provides comprehensive dashboards for Employees, Managers, and HR administrators with features for resource allocation, project tracking, onboarding management, and CSV data export.

## 🎯 Project Overview

**Aganitha EMS** is a demo Employee Management System that showcases:

- **Three distinct user roles** with role-specific dashboards
- **Real-time employee and project data** management
- **Advanced resource allocation** tracking with dependency scores
- **Employee onboarding and exit management** workflows
- **Skills inventory** and department analytics
- **CSV data export** capabilities for HR analytics
- **Project health tracking** with sentiment analysis
- **Responsive UI** with dark/light mode support

The system is currently in **MVP stage** with JSON-based data storage, designed to scale to a PostgreSQL backend with JWT + LDAP authentication in production.

---

## 🏗️ Architecture Overview

### Tech Stack

**Frontend:**

- **Framework:** Next.js 16 (App Router) + Turbopack
- **Language:** React 18 + TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **UI Library:** shadcn/ui (40+ components)
- **Icons:** lucide-react
- **Forms:** React Hook Form + Zod validation
- **State Management:** Custom hooks (useData, useToast, useMobile)
- **Charts:** Recharts for data visualization
- **Notifications:** Sonner toast notifications

**Data Layer:**

- **Current (MVP):** JSON file (`/public/data.json`) with client-side fetching
- **Future (Production):** PostgreSQL 14+ database with RESTful APIs

**Development:**

- **Language:** TypeScript 5
- **Build Tool:** Turbopack (52-second builds)
- **CSS Preprocessor:** PostCSS with Tailwind CSS 4
- **Package Manager:** pnpm

---

## 📂 Project Structure

```
ems-ui/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Home - Role selection
│   ├── layout.tsx                    # Root layout with theme provider
│   ├── globals.css                   # Global styles
│   │
│   ├── manager/                      # Manager Dashboard
│   │   ├── page.tsx                 # Manager dashboard
│   │   ├── team/page.tsx            # Team members list
│   │   ├── projects/page.tsx        # Projects overview
│   │   ├── resources/page.tsx       # Resource search & allocation
│   │   └── requests/page.tsx        # Transfer requests
│   │
│   ├── hr/                          # HR Dashboard
│   │   ├── page.tsx                 # HR dashboard with analytics
│   │   ├── directory/page.tsx       # Employee directory
│   │   ├── onboarding/page.tsx      # Onboarding tracker
│   │   ├── exits/page.tsx           # Exit management
│   │   ├── skills/page.tsx          # Skills inventory
│   │   ├── analytics/page.tsx       # HR analytics & reports
│   │   └── settings/page.tsx        # HR settings
│   │
│   ├── employee/                    # Employee Dashboard
│   │   └── page.tsx                 # Employee dashboard
│   │
│   ├── projects/page.tsx            # All projects (shared across roles)
│   ├── profile/page.tsx             # User profile management
│   ├── search/page.tsx              # Global search
│   ├── settings/page.tsx            # User settings
│   ├── attendance/page.tsx          # Attendance tracking
│   ├── reports/page.tsx             # Reports & analytics
│   └── reports-old/                 # Legacy reports
│
├── components/                       # React Components
│   ├── modals/
│   │   ├── employee-detail-modal.tsx    # Employee profile modal
│   │   └── project-detail-modal.tsx     # Project details modal
│   │
│   ├── manager/                     # Manager-specific components
│   │   ├── quick-stats.tsx          # Quick stats cards
│   │   ├── project-card.tsx         # Project cards
│   │   ├── pending-actions.tsx      # Pending actions list
│   │   └── team-member.tsx          # Team member cards
│   │
│   ├── hr/                          # HR-specific components
│   │   ├── onboarding-list.tsx      # Onboarding employees
│   │   ├── exit-list.tsx            # Exit management
│   │   ├── skills-list.tsx          # Skills inventory
│   │   └── department-summary.tsx   # Department analytics
│   │
│   ├── ui/                          # shadcn/ui Components (40+)
│   │   ├── button.tsx, card.tsx, dialog.tsx
│   │   ├── table.tsx, tabs.tsx, form.tsx
│   │   ├── avatar.tsx, badge.tsx, progress.tsx
│   │   └── [more ui components...]
│   │
│   ├── dashboard-layout.tsx         # Main dashboard wrapper
│   ├── sidebar.tsx                  # Navigation sidebar
│   ├── header.tsx                   # Page header
│   ├── theme-provider.tsx           # Dark/light mode
│   └── stat-card.tsx               # Statistics card
│
├── hooks/                           # React Hooks
│   ├── use-data.ts                 # Data fetching hook
│   ├── use-toast.ts                # Toast notifications
│   └── use-mobile.ts               # Mobile detection
│
├── lib/                             # Utilities
│   ├── csv-export.ts               # CSV export functions
│   │   ├── exportEmployeesCSV()    # Export employees data
│   │   ├── exportProjectsCSV()     # Export projects data
│   │   └── exportAllocationsCSV()  # Export allocations data
│   └── utils.ts                    # Helper utilities
│
├── public/                          # Static assets
│   └── data.json                   # Mock data (MVP)
│       ├── employees (10 records)
│       ├── projects (6 records)
│       ├── project_allocations (10 records)
│       ├── reports (7 records)
│       └── attendance_records
│
├── styles/                          # Global styles
│   └── globals.css                 # Tailwind directives
│
├── next.config.mjs                 # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── postcss.config.mjs              # PostCSS configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── components.json                 # shadcn/ui configuration
├── package.json                    # Dependencies
└── README.md                        # This file
```

---

## 👥 User Roles & Features

### 1. **Employee Dashboard** (`/employee`)

**Who:** Regular employees

**Features:**

- View assigned projects and allocations
- Check onboarding progress
- Submit weekly reports (planned)
- Manage personal profile
- View team members and skills
- Track project assignments
- View availability status

**Key Metrics:**

- Current Projects Count
- Allocation Percentage
- Onboarding Progress
- Active Projects

---

### 2. **Manager Dashboard** (`/manager`)

**Who:** Team managers and tech leads

**Features:**

- **Quick Stats:** Team size, active projects, allocated resources, utilization rate
- **Team Overview:** List of team members with allocations and skills
- **Project Management:** View and manage projects with team allocations
- **Resource Search:** Search and allocate resources across projects
- **Pending Actions:** View pending transfer requests and approvals
- **Project Details Modal:** View detailed project metrics including:
  - Allocated resources count
  - Total allocation percentage
  - Billable resources count
  - Team allocations with roles (Lead/Team)
  - Dependency scores
  - Transferability scores

**Key Metrics:**

- Team Size
- Active Projects
- Allocated Resources
- Utilization Rate

---

### 3. **HR Dashboard** (`/hr`)

**Features:**

- **Quick Stats:** Active employees, onboarding employees, exits initiated, top skills
- **Onboarding Tracker:** Track new employee onboarding progress
- **Exit Management:** Manage employee exits and exit reasons
- **Skills Inventory:** Top skills across the organization
- **Department Analytics:**
  - Department utilization rates
  - Employee distribution by department
  - Skills gap analysis
- **CSV Export Capabilities:**
  - Export all employees (13 columns)
  - Export projects (10 columns)
  - Export allocations (18 columns)
- **Employee Directory:** Search and view all employees
- **Analytics & Reports:** Department-wise analytics and trends

**Key Metrics:**

- Active Employees
- Onboarding Progress
- Exits Initiated
- Top Skills

**CSV Export Columns:**

| Type            | Columns                                                                                                                                                                                                            | Format                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| **Employees**   | ID, Name, Designation, Department, Email, Phone, Location, Reporting To, Join Date, Status, Employment Type, Onboarding Progress, Skills                                                                           | RFC 4180, UTF-8 with BOM |
| **Projects**    | ID, Name, Code, Status, Health, Type, Team Size, Budget, Budget Used, Description                                                                                                                                  | RFC 4180, UTF-8 with BOM |
| **Allocations** | Allocation ID, Employee ID, Project ID, Allocation %, Date Allocated, Period, Utilization Status, Billability, Availability Date, Is Lead, Dependency Score, Transferable, Is Client Facing, Transferability Score | RFC 4180, UTF-8 with BOM |

---

## 📊 Data Model

### Employees

```typescript
{
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  reportingTo: string;
  joinDate: string;
  status: "active" | "exit-initiated" | "exited";
  employmentType: "Full-time" | "Contract";
  onboardingProgress: number; // 0-100
  exitDate?: string;
  exitReason?: string;
  skills: Skill[];
}
```

### Projects

```typescript
{
  id: string;
  name: string;
  code: string;
  status: "active" | "paused" | "completed";
  health: "healthy" | "at-risk" | "blocked";
  teamSize: number;
  members: string[]; // Employee IDs
  budget: number;
  budgetUsed: number;
  allocation: number; // Percentage
  description: string;
}
```

### Project Allocations

```typescript
{
  allocation_id: string;
  emp_id: string;
  project_id: string;
  allocation_percentage: number;
  date_allocated: string;
  period: string;
  utilization_status: "idle" | "partially-allocated" | "fully-allocated";
  billability: "Billable" | "Non-Billable";
  is_lead: boolean;
  is_client_facing: boolean;
  dependency_score: number; // 1-5 scale
  transferability_score: number; // 0-100 scale
}
```

### Weekly Reports

```typescript
{
  id: string;
  emp_id: string;
  week: string;
  summary: string; // Required, max 500 chars
  sentiment: "positive" | "neutral" | "negative"; // Required
  blockers?: string; // Optional, max 1000 chars
  nextWeekPlan?: string; // Optional, max 1000 chars
  submittedAt: string;
}
```

---

## 🔢 Key Calculations & Metrics

### Transferability Score

**Formula:** `100 - (8×dependency + 10×client + 5×lead + 0.2×allocation%)`

- **Scale:** 0-100 (higher = easier to transfer)
- **Example:** Junior dev = 80/100, Tech lead = 25/100
- **Components:**
  - Dependency: Weight 8 (critical dependencies increase required context)
  - Client Facing: Weight 10 (client relationships reduce transferability)
  - Lead Role: Weight 5 (leadership responsibilities reduce flexibility)
  - Allocation: Weight 0.2 (higher allocation means harder to transfer)

### Dependency Score

- **Scale:** 1-5 (manager-assigned)
- **1:** Minimal dependencies
- **5:** Critical/blocking dependencies

### Project Health

- **Aggregates team sentiment** from weekly reports
- **Healthy (🟢):** Positive sentiment from team
- **At-Risk (🟡):** Neutral sentiment
- **Blocked (🔴):** Negative sentiment

### Department Utilization

- **Formula:** Average allocation percentage across all employees in department
- **Purpose:** Track department resource efficiency

### On-Bench Count

- **Definition:** Employees with zero skills assigned
- **Purpose:** Identify available resource pool for training

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** 18.x or higher
- **pnpm:** 8.x or higher (or npm/yarn)
- **Git:** For version control

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd ems-ui
```

2. **Install dependencies:**

```bash
pnpm install
# or: npm install / yarn install
```

3. **Run development server:**

```bash
pnpm dev
# or: npm run dev
```

4. **Open in browser:**

```
http://localhost:3000
```

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server with hot reload

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Linting & Quality
pnpm lint             # Run ESLint

# Build Info
# Output: 52-second build time, 25 routes, 0 errors
```

---

## 🎨 UI Components & Features

### Component Library

The project uses **shadcn/ui** with 40+ pre-built components:

**Layout Components:**

- Card, Dialog, Drawer, Sheet, Modal
- Tabs, Accordion, Collapsible
- Sidebar, Navigation Menu

**Form Components:**

- Input, Textarea, Select, Checkbox, Radio
- Toggle, Switch, Slider
- Calendar, Date Picker, Input OTP

**Data Display:**

- Table, Pagination, Progress Bar
- Badge, Avatar, Skeleton
- Breadcrumb, Command

**Interactive:**

- Button, Button Group, Tooltip
- Hover Card, Popover, Context Menu
- Alert, Alert Dialog

### Theming

- **Dark/Light Mode:** Via next-themes
- **Color System:** Tailwind CSS 4 with custom palette
- **Responsive:** Mobile-first design with Tailwind breakpoints

---

## 📈 Features in Detail

### 1. CSV Export

**Location:** `/lib/csv-export.ts`

**Features:**

- RFC 4180 compliant CSV format
- UTF-8 encoding with BOM for Excel compatibility
- Timestamped filenames (YYYY-MM-DD)
- Browser download via Blob API
- 3 export types: Employees, Projects, Allocations

**Usage:**

```typescript
import { exportEmployeesCSV } from "@/lib/csv-export";

// Export with button click
const handleExport = () => {
  exportEmployeesCSV(data.employees);
};
```

### 2. Enhanced Project Modal

**Location:** `/components/modals/project-detail-modal.tsx`

**Features:**

- Project overview and description
- 3-card metrics section:
  - Allocated Resources (count)
  - Total Allocation (%)
  - Billable Resources (count)
- Team allocations table (6 columns):
  - Employee name + avatar
  - Department
  - Allocation percentage
  - Role badge (Lead/Team)
  - Billability status
  - Period

### 3. Data Fetching

**Location:** `/hooks/use-data.ts`

**Features:**

- Single hook for centralized data management
- Loads from `/public/data.json` (MVP)
- Client-side state management
- Error handling and loading states
- Type-safe interfaces for all data models

**Usage:**

```typescript
const { data, loading, error } = useData();

// Access data
const employees = data?.employees || [];
const projects = data?.projects || [];
const allocations = data?.project_allocations || [];
```

### 4. Dashboard Layout

**Location:** `/components/dashboard-layout.tsx`

**Features:**

- Role-based navigation sidebar
- Responsive layout (mobile-friendly)
- Role-specific menu items
- Active route highlighting
- Theme toggle

---

## 🔄 Roadmap

### Phase 1: Backend Integration (Weeks 1-2)

- [ ] Set up PostgreSQL database
- [ ] Create API routes (`/app/api/*`)
- [ ] Implement JWT + LDAP authentication
- [ ] Connect frontend to backend

### Phase 2: Employee Features (Week 3)

- [ ] Weekly report submission form
- [ ] Employee profile management
- [ ] Personal project allocation view
- [ ] Onboarding checklist tracking

### Phase 3: Advanced Features (Weeks 4-6)

- [ ] Real-time notifications
- [ ] Email alerts for important events
- [ ] Sentiment analysis from weekly reports
- [ ] Skills gap analysis
- [ ] Resource optimization recommendations

### Phase 4: Production (Weeks 7-8)

- [ ] Security audit & compliance
- [ ] Performance optimization
- [ ] Error tracking (Sentry)
- [ ] Comprehensive documentation
- [ ] Production deployment

---

## 🛠️ Development Workflow

### Adding a New Route

1. **Create route folder in `/app`:**

```bash
mkdir -p app/new-feature
```

2. **Create `page.tsx`:**

```tsx
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";

export default function NewFeaturePage() {
  return (
    <DashboardLayout
      role="manager"
      title="New Feature"
      currentPath="/new-feature"
    >
      {/* Your content */}
    </DashboardLayout>
  );
}
```

3. **Add to sidebar navigation** in `/components/sidebar.tsx`

### Adding a New Component

1. **Create in `/components`:**

```tsx
import { Card } from "@/components/ui/card";

export function MyComponent() {
  return <Card>{/* Your content */}</Card>;
}
```

2. **Export from index** (if using barrel exports)

3. **Use in pages:**

```tsx
import { MyComponent } from "@/components/my-component";
```

### Using shadcn/ui Components

1. **Install component:**

```bash
npx shadcn-ui@latest add button
```

2. **Import and use:**

```tsx
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return <Button>Click me</Button>;
}
```

---

## 📝 Mock Data

The project includes comprehensive mock data in `/public/data.json`:

**Sample Data:**

- **10 Employees** with skills, designations, and departments
- **6 Projects** with active/paused/completed status
- **10 Project Allocations** with allocation percentages and scores
- **7 Weekly Reports** with sentiment data
- **Attendance Records** for the past month

This data powers all dashboards in MVP mode.

---

## 🔐 Security Considerations (Production)

When moving to production:

1. **Authentication:**

   - Implement JWT tokens with secure HTTP-only cookies
   - Integrate LDAP for SSO (single sign-on)
   - Add role-based access control (RBAC)

2. **Data Protection:**

   - Encrypt sensitive employee data (SSN, salary)
   - Use HTTPS for all communications
   - Implement audit logging for data access

3. **API Security:**
   - Add rate limiting
   - Implement CORS policies
   - Validate all input data
   - Use middleware for authentication

---

## 📊 Build Performance

**Current Build Stats:**

- Build Time: ~52 seconds
- Routes Generated: 25
- Compilation Errors: 0
- TypeScript Strict Mode: ✅ Enabled

**Optimization Tips:**

- Dynamic imports for large components
- Image optimization
- Code splitting at route level
- Bundle analysis with `@next/bundle-analyzer`

---

## 🤝 Contributing

When contributing to the project:

1. Follow the existing folder structure
2. Use TypeScript for all new code
3. Follow naming conventions:
   - Components: PascalCase (`MyComponent.tsx`)
   - Utilities: camelCase (`myUtil.ts`)
   - Pages: lowercase (`page.tsx`)
4. Write JSDoc comments for complex functions
5. Test on multiple screen sizes

---

## 📚 Resources

- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **shadcn/ui:** https://ui.shadcn.com
- **TypeScript:** https://www.typescriptlang.org

---

## 📄 License

This project is private and proprietary to Aganitha Consulting.

---

## 📞 Support

For questions or issues:

- Create an issue in the repository
- Contact the development team
- Check existing documentation

---

## ✅ Checklist for Production Readiness

- [ ] Backend API integration complete
- [ ] Authentication & authorization implemented
- [ ] Error handling and logging in place
- [ ] Performance optimized (bundle size, build time)
- [ ] Security audit completed
- [ ] Database migrations tested
- [ ] Comprehensive testing coverage
- [ ] Documentation complete
- [ ] Deployment pipeline configured
- [ ] Monitoring & alerting set up

---

**Last Updated:** January 12, 2026  
**Version:** 0.1.0 (MVP)  
**Status:** Active Development
