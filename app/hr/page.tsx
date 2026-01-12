"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuickStats } from "@/components/manager";
import {
  OnboardingList,
  OnboardingEmployee,
  ExitList,
  ExitEmployee,
  TopSkillsList,
  SkillWithEmployees,
  DepartmentSummary,
  DepartmentStats,
} from "@/components/hr";
import { useData, Employee } from "@/hooks/use-data";
import {
  Users,
  UserPlus,
  UserX,
  Star,
  TrendingUp,
  Download,
} from "lucide-react";
import Link from "next/link";
import {
  exportEmployeesCSV,
  exportProjectsCSV,
  exportAllocationsCSV,
} from "@/lib/csv-export";

export default function HRDashboard() {
  const { data, loading } = useData();

  if (loading || !data) {
    return (
      <DashboardLayout role="hr" title="HR Dashboard" currentPath="/hr">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading HR Dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const employees: Employee[] = data.employees || [];
  const activeEmployees = employees.filter(
    (emp) => emp.status === "active"
  ).length;

  const newHires = employees.filter((emp) => {
    const joinDate = new Date(emp.joinDate);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return joinDate > threeMonthsAgo && emp.status === "active";
  }).length;

  const onBench = employees.filter(
    (emp) => emp.status === "active" && (!emp.skills || emp.skills.length === 0)
  ).length;

  const exitPipeline = employees.filter(
    (emp) => emp.status === "exit-initiated"
  ).length;

  const incompleteProfiles: OnboardingEmployee[] = employees
    .filter((emp) => (emp.onboardingProgress || 0) < 100)
    .map((emp) => ({
      id: emp.id,
      name: emp.name,
      designation: emp.designation,
      joinDate: emp.joinDate,
      onboardingProgress: emp.onboardingProgress || 0,
    }));

  const exitsInProgress: ExitEmployee[] = employees
    .filter((emp) => emp.status === "exit-initiated")
    .map((emp) => ({
      id: emp.id,
      name: emp.name,
      designation: emp.designation,
      department: emp.department,
      exitDate: emp.exitDate,
      exitInitiatedDate: emp.exitInitiatedDate,
      currentProjects: ["Project A", "Project B"],
    }));

  const skillsMap = new Map<
    string,
    {
      employees: Array<{ id: string; name: string; rating: number }>;
      ratings: number[];
    }
  >();

  employees.forEach((emp) => {
    if (emp.skills) {
      emp.skills.forEach((skill) => {
        if (!skillsMap.has(skill.technology)) {
          skillsMap.set(skill.technology, { employees: [], ratings: [] });
        }
        const skillData = skillsMap.get(skill.technology)!;
        skillData.employees.push({
          id: emp.id,
          name: emp.name,
          rating: skill.rating,
        });
        skillData.ratings.push(skill.rating);
      });
    }
  });

  const topSkills: SkillWithEmployees[] = Array.from(skillsMap.entries())
    .map(([skill, data]) => ({
      skill,
      employeeCount: data.employees.length,
      avgRating: data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length,
      trend: (data.employees.length > 20
        ? "up-high"
        : data.employees.length > 15
        ? "up"
        : "stable") as "up-high" | "up" | "stable",
      employees: data.employees,
    }))
    .sort((a, b) => b.employeeCount - a.employeeCount)
    .slice(0, 6);

  const departmentsMap = new Map<string, Employee[]>();
  employees
    .filter((emp) => emp.status === "active")
    .forEach((emp) => {
      if (!departmentsMap.has(emp.department)) {
        departmentsMap.set(emp.department, []);
      }
      departmentsMap.get(emp.department)!.push(emp);
    });

  // Calculate utilization from actual allocations
  const allocations = data.project_allocations || [];
  const departmentStats: DepartmentStats[] = Array.from(
    departmentsMap.entries()
  ).map(([dept, emps]) => {
    const deptAllocations = allocations.filter((alloc: any) =>
      emps.some((emp) => emp.id === alloc.emp_id)
    );
    const totalAllocation = deptAllocations.reduce(
      (sum: number, alloc: any) => sum + alloc.allocation_percentage,
      0
    );
    const avgUtilization =
      emps.length > 0 ? Math.round(totalAllocation / emps.length) : 0;
    return {
      department: dept,
      employeeCount: emps.length,
      utilization: avgUtilization,
      onBench: emps.filter((e) => !e.skills || e.skills.length === 0).length,
      trend: "stable" as const,
    };
  });

  const statsData = [
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: Users,
      variant: "default" as const,
    },
    {
      title: "New Hires (Q1 2026)",
      value: newHires,
      icon: UserPlus,
      variant: "success" as const,
    },
    {
      title: "On Bench",
      value: onBench,
      icon: Users,
      variant: onBench > 10 ? ("warning" as const) : ("default" as const),
    },
    {
      title: "Exits Pending",
      value: exitPipeline,
      icon: UserX,
      variant: exitPipeline > 5 ? ("danger" as const) : ("default" as const),
    },
  ];

  return (
    <DashboardLayout role="hr" title="HR Dashboard" currentPath="/hr">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">HR Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome to the HR Command Center
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportEmployeesCSV(employees)}
              className="gap-2"
            >
              <Download size={16} />
              Export Employees
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportProjectsCSV(data.projects || [])}
              className="gap-2"
            >
              <Download size={16} />
              Export Projects
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportAllocationsCSV(
                  data.project_allocations || [],
                  employees,
                  data.projects || []
                )
              }
              className="gap-2"
            >
              <Download size={16} />
              Export Allocations
            </Button>
          </div>
        </div>

        <QuickStats stats={statsData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus size={20} />
                  Onboarding Tracker
                </CardTitle>
                <Link href="/hr/onboarding">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                New employees completing profile setup
              </p>
            </CardHeader>
            <CardContent>
              <OnboardingList
                employees={incompleteProfiles}
                maxDisplay={3}
                showViewAll={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <UserX size={20} />
                  Exit Pipeline
                </CardTitle>
                <Link href="/hr/exits">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Employees in departure process
              </p>
            </CardHeader>
            <CardContent>
              <ExitList
                employees={exitsInProgress}
                maxDisplay={3}
                showViewAll={false}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={20} />
                Department Analytics
              </CardTitle>
              <Link href="/hr/analytics">
                <Button variant="outline" size="sm">
                  View Analytics
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <DepartmentSummary
              departments={departmentStats}
              variant="horizontal"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Star size={20} />
                Top Skills in Organization
              </CardTitle>
              <Link href="/hr/skills">
                <Button variant="outline" size="sm">
                  View All Skills
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <TopSkillsList
              skills={topSkills}
              maxDisplay={6}
              expandable={false}
            />
          </CardContent>
        </Card>

        {/* Weekly Report Submission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Weekly Report Submission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Submit a consolidated report of your work across HR activities
                this week
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Last submitted: January 3, 2026
              </p>
            </div>
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
              <span className="text-xs font-semibold text-amber-700">
                Due Friday
              </span>
            </div>
            <Link href="/hr/reports">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Write This Week's Report
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
