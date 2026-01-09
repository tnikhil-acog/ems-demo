# Aganitha EMS – Database Schema (Core Tables Only)

This document defines the **essential** schema for all tables used in the HR and Manager sections, aligned with the Excel sheets and new requirements. Only absolutely important manual and calculated fields are included.

---

## Table of Contents

1. [employees](#1-employees) - Employee master + exit tracking
2. [projects](#2-projects) - Project master + lifecycle tracking
3. [project_allocations](#3-project_allocations) - Employee-project relationship
4. [skills](#4-skills) - Skill master for search and matching
5. [employee_skills](#5-employee_skills) - Employee skill ratings
6. [transfer_requests](#6-transfer_requests) - Cross-project resource transfer workflow
7. [weekly_reports](#7-weekly_reports) - Project health and AI summaries
8. [notifications](#8-notifications) - In-app notification feed

---

## 1. employees

Core employee master + minimal exit tracking.

```sql
CREATE TABLE employees (
  -- PRIMARY KEY
  emp_id INT PRIMARY KEY AUTO_INCREMENT,

  -- FROM EXCEL (Core Identity)
  employee_code VARCHAR(50) UNIQUE NOT NULL,     -- Employee Code
  employee_name VARCHAR(200) NOT NULL,           -- Employee Name
  email VARCHAR(200) UNIQUE NOT NULL,            -- Email

  -- FROM EXCEL (Dates & Demographics)
  date_of_joining DATE NOT NULL,                 -- Date Of Joining
  gender VARCHAR(20),                            -- Gender
  date_of_birth DATE,                            -- DOB

  -- FROM EXCEL (Employment Details)
  employee_type VARCHAR(50),                     -- Employee Type
  office_location VARCHAR(100),                  -- Office Location
  designation VARCHAR(100),                      -- Designation
  department VARCHAR(100),                       -- Department
  workstream VARCHAR(100),                       -- Workstream

  -- FROM EXCEL (Experience)
  previous_experience DECIMAL(5,2),              -- Previous Experience (years)

  -- FROM EXCEL (Education)
  college VARCHAR(200),                          -- College
  educational_stream VARCHAR(200),               -- Educational Stream
  educational_category VARCHAR(100),             -- Sort - Category (Educational Stream)

  -- FROM EXCEL (Profile Data)
  bio TEXT,                                      -- Bio data
  github VARCHAR(200),                           -- Github
  picture_url VARCHAR(500),                      -- Picture (URL/path)
  resume_url VARCHAR(500),                       -- Resume (URL/path)

  -- CALCULATED FIELDS (Essential)
  current_experience DECIMAL(5,2),               -- (current_date - date_of_joining)/365
  total_allocation_percentage INT DEFAULT 0,     -- SUM of allocations across projects
  available_capacity INT DEFAULT 100,            -- 100 - total_allocation_percentage
  is_on_bench BOOLEAN DEFAULT TRUE,              -- TRUE if total_allocation < 50
  profile_completion_percentage INT DEFAULT 0,   -- Profile completeness %

  -- MANAGEMENT & STATUS
  reporting_manager_emp_id INT,                  -- Manager (FK to employees.emp_id)
  status VARCHAR(50) DEFAULT 'Active',           -- Active / Exit Initiated / Exited / Alumni

  -- SIMPLE EXIT TRACKING
  last_working_day DATE,                         -- Final working day (NULL if active)
  exit_initiated_date DATE,                      -- When exit was initiated

  -- METADATA
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- FOREIGN KEYS
  FOREIGN KEY (reporting_manager_emp_id) REFERENCES employees(emp_id)
);

-- INDEXES
CREATE INDEX idx_employee_code ON employees(employee_code);
CREATE INDEX idx_email ON employees(email);
CREATE INDEX idx_department ON employees(department);
CREATE INDEX idx_status ON employees(status);
CREATE INDEX idx_reporting_manager ON employees(reporting_manager_emp_id);
CREATE INDEX idx_last_working_day ON employees(last_working_day);
```

---

## 2. projects

Core project master + minimal lifecycle tracking.

```sql
CREATE TABLE projects (
  -- PRIMARY KEY
  project_id VARCHAR(50) PRIMARY KEY,            -- ProjectID

  -- FROM EXCEL (Core Details)
  project_name VARCHAR(200) NOT NULL,            -- Project Name
  client_name VARCHAR(200),                      -- Client Name (If Any)
  project_type VARCHAR(10) NOT NULL,             -- Project Type (B/C/M/O/P/R/S/U/E)
  project_master_legend VARCHAR(100),            -- Project Master/Legend
  status VARCHAR(50) DEFAULT 'Active',           -- Active / Paused / Completed
  economic_billability VARCHAR(50),              -- Economic Billability
  capacity_billability VARCHAR(50),              -- Capacity Billability

  -- ESSENTIAL ADDITIONS
  start_date DATE,                               -- Planned start date
  end_date DATE,                                 -- Planned end date
  manager_emp_id INT,                            -- Project manager/lead (FK to employees)

  -- CALCULATED FIELDS (Essential)
  project_priority INT,                          -- 1–9 based on project_type
  team_size INT DEFAULT 0,                       -- COUNT(DISTINCT emp_id in allocations)
  total_allocation_percentage INT DEFAULT 0,     -- SUM(allocation_percentage) across team

  -- COMPLETION TRACKING
  is_completed BOOLEAN DEFAULT FALSE,            -- TRUE if project closed
  actual_completion_date DATE,                   -- Actual completion date
  completion_notes TEXT,                         -- Optional notes on completion

  -- METADATA
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,

  -- FOREIGN KEYS
  FOREIGN KEY (manager_emp_id) REFERENCES employees(emp_id),
  FOREIGN KEY (created_by) REFERENCES employees(emp_id),
  FOREIGN KEY (updated_by) REFERENCES employees(emp_id)
);

-- INDEXES
CREATE INDEX idx_project_type ON projects(project_type);
CREATE INDEX idx_project_status ON projects(status);
CREATE INDEX idx_project_manager ON projects(manager_emp_id);
CREATE INDEX idx_project_is_completed ON projects(is_completed);
```

---

## 3. project_allocations

Employee–project relationship and utilization.

```sql
CREATE TABLE project_allocations (
  -- PRIMARY KEY
  allocation_id INT PRIMARY KEY AUTO_INCREMENT,

  -- FROM EXCEL (Core Allocation Data)
  date_allocated DATE NOT NULL,                  -- Date Allocated
  emp_id INT NOT NULL,                           -- EmpID (FK to employees)
  project_id VARCHAR(50) NOT NULL,               -- ProjectID (FK to projects)

  allocation_percentage INT NOT NULL,            -- % Allocation (0–100)
  period VARCHAR(100),                           -- As in Excel: duration text
  utilization_status VARCHAR(50),                -- Utilization (Utilized/Unutilized)
  billability VARCHAR(50),                       -- Billable/Unbillable
  availability_date DATE,                        -- When employee is available

  -- ESSENTIAL ADDITIONS
  is_lead BOOLEAN DEFAULT FALSE,                 -- Is this employee the lead on this project
  dependency_score INT CHECK (dependency_score BETWEEN 1 AND 5), -- 1=Low, 5=Critical
  transferable VARCHAR(20) DEFAULT 'Yes',        -- Yes / No / Conditional
  is_client_facing BOOLEAN DEFAULT FALSE,        -- Client-facing on this project

  -- CALCULATED FIELDS
  transferability_score INT,                     -- 0–100 based on rules

  -- METADATA
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,

  -- FOREIGN KEYS
  FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES employees(emp_id),
  FOREIGN KEY (updated_by) REFERENCES employees(emp_id),

  -- CONSTRAINTS
  UNIQUE KEY unique_emp_project (emp_id, project_id),
  CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100)
);

-- INDEXES
CREATE INDEX idx_alloc_emp_id ON project_allocations(emp_id);
CREATE INDEX idx_alloc_project_id ON project_allocations(project_id);
CREATE INDEX idx_alloc_date ON project_allocations(date_allocated);
CREATE INDEX idx_alloc_is_lead ON project_allocations(is_lead);
```

---

## 4. skills

Skill master (for search and matching).

```sql
CREATE TABLE skills (
  skill_id INT PRIMARY KEY AUTO_INCREMENT,
  skill_name VARCHAR(100) UNIQUE NOT NULL,       -- e.g., React, Python, AWS
  skill_category VARCHAR(50),                    -- Technical / Soft / Tools / etc.

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX idx_skill_name ON skills(skill_name);
CREATE INDEX idx_skill_category ON skills(skill_category);
```

---

## 5. employee_skills

Employee skill ratings.

```sql
CREATE TABLE employee_skills (
  employee_skill_id INT PRIMARY KEY AUTO_INCREMENT,
  emp_id INT NOT NULL,
  skill_id INT NOT NULL,
  skill_rating INT CHECK (skill_rating BETWEEN 1 AND 5), -- 1–5 stars
  is_verified BOOLEAN DEFAULT FALSE,                     -- Verified by manager
  verified_by INT,                                       -- FK to employees.emp_id
  verified_date DATE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- FOREIGN KEYS
  FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES employees(emp_id),

  -- CONSTRAINTS
  UNIQUE KEY unique_employee_skill (emp_id, skill_id)
);

-- INDEXES
CREATE INDEX idx_emp_skill_emp_id ON employee_skills(emp_id);
CREATE INDEX idx_emp_skill_skill_id ON employee_skills(skill_id);
CREATE INDEX idx_emp_skill_rating ON employee_skills(skill_rating);
```

---

## 6. transfer_requests

For cross-project resource transfer workflow.

```sql
CREATE TABLE transfer_requests (
  request_id INT PRIMARY KEY AUTO_INCREMENT,

  -- EMPLOYEE & PROJECTS
  emp_id INT NOT NULL,                           -- Employee being requested
  source_project_id VARCHAR(50) NOT NULL,        -- Current project
  target_project_id VARCHAR(50) NOT NULL,        -- Requested project

  -- ALLOCATION CHANGE
  current_allocation INT NOT NULL,               -- Current % on source project
  proposed_allocation INT NOT NULL,              -- % requested on target project
  reduced_allocation INT,                        -- New % on source (if partial)

  -- REQUEST META
  requested_by INT NOT NULL,                     -- Manager requesting
  justification TEXT NOT NULL,                   -- Why transfer is needed
  priority VARCHAR(20) DEFAULT 'Medium',         -- High / Medium / Low
  needed_by_date DATE,                           -- When this resource is needed
  duration_weeks INT,                            -- Duration of transfer

  -- APPROVAL STATUS
  status VARCHAR(50) DEFAULT 'Pending',          -- Pending / Approved / Rejected / Completed
  source_manager_approval VARCHAR(50),           -- Pending / Approved / Rejected
  source_manager_notes TEXT,
  hr_approval VARCHAR(50),                       -- Pending / Approved / Rejected
  hr_notes TEXT,

  -- METADATA
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,

  -- FOREIGN KEYS
  FOREIGN KEY (emp_id) REFERENCES employees(emp_id),
  FOREIGN KEY (source_project_id) REFERENCES projects(project_id),
  FOREIGN KEY (target_project_id) REFERENCES projects(project_id),
  FOREIGN KEY (requested_by) REFERENCES employees(emp_id)
);

-- INDEXES
CREATE INDEX idx_transfer_emp_id ON transfer_requests(emp_id);
CREATE INDEX idx_transfer_status ON transfer_requests(status);
CREATE INDEX idx_transfer_requested_by ON transfer_requests(requested_by);
```

---

## 7. weekly_reports

Source for project health and AI summaries.

```sql
CREATE TABLE weekly_reports (
  report_id INT PRIMARY KEY AUTO_INCREMENT,

  -- REPORT OWNER & PERIOD
  emp_id INT NOT NULL,
  week_ending_date DATE NOT NULL,                -- e.g., Friday of the week
  submission_date TIMESTAMP,                     -- When actually submitted

  -- RAW CONTENT
  projects_worked TEXT,                          -- JSON/Text summary per project
  achievements TEXT,                             -- What was done
  blockers TEXT,                                 -- Blockers
  next_week_plans TEXT,                          -- Plans

  -- AI-DERIVED FIELDS
  ai_summary TEXT,                               -- Single consolidated summary
  sentiment VARCHAR(20),                         -- Positive / Neutral / Negative
  blocker_count INT DEFAULT 0,                   -- Number of blockers detected

  -- STATUS
  status VARCHAR(50) DEFAULT 'Pending',          -- Pending / Submitted

  -- METADATA
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- FOREIGN KEYS
  FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE,

  -- CONSTRAINTS
  UNIQUE KEY unique_employee_week (emp_id, week_ending_date)
);

-- INDEXES
CREATE INDEX idx_report_emp_id ON weekly_reports(emp_id);
CREATE INDEX idx_report_week ON weekly_reports(week_ending_date);
CREATE INDEX idx_report_sentiment ON weekly_reports(sentiment);
CREATE INDEX idx_report_status ON weekly_reports(status);
```

---

## 8. notifications

In-app notification feed (no email, no real-time requirement for schema).

```sql
CREATE TABLE notifications (
  notification_id INT PRIMARY KEY AUTO_INCREMENT,

  -- RECIPIENT
  user_id INT NOT NULL,                          -- FK to employees.emp_id

  -- CONTENT
  notification_type VARCHAR(50) NOT NULL,        -- assignment_created, transfer_request, etc.
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,

  -- CONTEXT
  related_entity_type VARCHAR(50),               -- project / allocation / transfer_request / etc.
  related_entity_id INT,                         -- ID of related entity
  action_url VARCHAR(500),                       -- Where to navigate on click

  -- STATUS
  priority VARCHAR(20) DEFAULT 'Medium',         -- High / Medium / Low
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,

  -- METADATA
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- FOREIGN KEYS
  FOREIGN KEY (user_id) REFERENCES employees(emp_id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

---

## Summary of Tables

| Table                   | Purpose                                                | Key Features                                            |
| ----------------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| **employees**           | Employee master, allocation summary, simple exit flags | Profile completion %, bench status, experience tracking |
| **projects**            | Project master, manager, priority, completion status   | Project type priorities (1-9), team size calculation    |
| **project_allocations** | Who is on which project at what % and criticality      | Lead flags, dependency scores, transferability          |
| **skills**              | Skill catalog                                          | Categorized skills for search and matching              |
| **employee_skills**     | Employee skill ratings for matching                    | 1-5 star ratings with manager verification              |
| **transfer_requests**   | Structured resource transfer workflow                  | Multi-stage approval (source manager + HR)              |
| **weekly_reports**      | Weekly work data for project health                    | AI summaries, sentiment analysis, blocker tracking      |
| **notifications**       | In-app notification storage                            | Typed notifications with priority and read status       |

---

## Key Relationships

```
employees (1) ──< (N) project_allocations (N) >── (1) projects
employees (1) ──< (N) employee_skills (N) >── (1) skills
employees (1) ──< (N) weekly_reports
employees (1) ──< (N) notifications
employees (1) ──< (N) transfer_requests
projects (1) ──< (N) transfer_requests (source & target)
```

---

## Calculated Fields Reference

### employees

- `current_experience` = (current_date - date_of_joining) / 365
- `total_allocation_percentage` = SUM(allocation_percentage) from project_allocations
- `available_capacity` = 100 - total_allocation_percentage
- `is_on_bench` = TRUE if total_allocation_percentage < 50
- `profile_completion_percentage` = Based on completeness of profile fields

### projects

- `project_priority` = 1-9 based on project_type mapping
- `team_size` = COUNT(DISTINCT emp_id) from project_allocations
- `total_allocation_percentage` = SUM(allocation_percentage) from project_allocations

### project_allocations

- `transferability_score` = 0-100 calculated from is_lead, dependency_score, transferable flags

---

## Notes

- All schema content is derived from Excel field constraints and requirements
- Minimal additions included to support resource allocation, transfer workflows, exit tracking, and notifications
- Indexes created on frequently queried columns for performance
- Foreign key constraints ensure referential integrity
- Calculated fields should be updated via triggers or application logic
- Timestamps automatically track creation and updates
