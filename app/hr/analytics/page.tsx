"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData, Employee } from "@/hooks/use-data";
import {
  Download,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HRAnalytics() {
  const { data, loading } = useData();
  const [timeRange, setTimeRange] = useState("quarter");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Extract data with safe defaults
  const employees: Employee[] = data?.employees || [];
  const departments = Array.from(new Set(employees.map((e) => e.department)));
  const allocations = data?.project_allocations || [];

  // Generate department stats
  const departmentStats = useMemo(() => {
    const deptMap = new Map<string, Employee[]>();
    employees
      .filter((e) => e.status === "active")
      .forEach((emp) => {
        if (!deptMap.has(emp.department)) {
          deptMap.set(emp.department, []);
        }
        deptMap.get(emp.department)!.push(emp);
      });

    // Calculate utilization from actual allocations
    return Array.from(deptMap.entries()).map(([dept, emps]) => {
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
  }, [employees, allocations]);

  // Early return AFTER all hooks
  if (loading || !data) {
    return (
      <DashboardLayout
        role="hr"
        title="HR Analytics"
        currentPath="/hr/analytics"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate metrics
  const totalHeadcount = employees.filter((e) => e.status === "active").length;
  const newHiresQ1 = employees.filter((e) => {
    const joinDate = new Date(e.joinDate);
    return joinDate >= new Date("2025-01-01") && e.status === "active";
  }).length;
  const exitsQ1 = employees.filter(
    (e) => e.status === "exit-initiated" || e.status === "exited"
  ).length;

  return (
    <DashboardLayout role="hr" title="HR Analytics" currentPath="/hr/analytics">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">HR Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">
            Workforce analytics and insights
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download size={16} className="mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Time Range
              </label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Department
              </label>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept: string) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">
                  Total Headcount
                </p>
                <p className="text-4xl font-bold text-blue-600">
                  {totalHeadcount}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Active employees
                </p>
              </div>
              <Users size={40} className="text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">
                  Joiners (Q1)
                </p>
                <p className="text-4xl font-bold text-green-600">
                  {newHiresQ1}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                  <TrendingUp size={12} />
                  New hires
                </p>
              </div>
              <TrendingUp size={40} className="text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">
                  Leavers (Q1)
                </p>
                <p className="text-4xl font-bold text-red-600">{exitsQ1}</p>
                <p className="text-xs text-red-600 flex items-center gap-1 mt-2">
                  <TrendingDown size={12} />
                  Exit pipeline
                </p>
              </div>
              <TrendingDown size={40} className="text-red-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Headcount Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={18} />
              Headcount Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 size={48} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">Chart visualization</p>
                <p className="text-xs">(Requires charting library)</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <p className="font-semibold">Jan</p>
                <p className="text-muted-foreground">4</p>
              </div>
              <div>
                <p className="font-semibold">Feb</p>
                <p className="text-muted-foreground">5</p>
              </div>
              <div>
                <p className="font-semibold">Mar</p>
                <p className="text-muted-foreground">6</p>
              </div>
              <div>
                <p className="font-semibold">Apr</p>
                <p className="text-muted-foreground">6</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Joiners vs Leavers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={18} />
              Joiners vs Leavers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 size={48} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">Chart visualization</p>
                <p className="text-xs">(Requires charting library)</p>
              </div>
            </div>
            <div className="mt-4 flex justify-around text-xs">
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-1"></div>
                <p className="font-semibold">Joiners: {newHiresQ1}</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-1"></div>
                <p className="font-semibold">Leavers: {exitsQ1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={18} />
            Department-wise Headcount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentStats.map((dept: any) => (
              <div key={dept.department}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{dept.department}</span>
                  <span className="text-sm text-muted-foreground">
                    {dept.employeeCount} employees • {dept.utilization}%
                    utilization
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(dept.employeeCount / totalHeadcount) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bench Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={18} />
            Bench Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <BarChart3 size={48} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm">Bench utilization over time</p>
              <p className="text-xs">(Requires charting library)</p>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>
              Current bench:{" "}
              {departmentStats.reduce(
                (sum: number, d: any) => sum + d.bench,
                0
              )}{" "}
              employees
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
