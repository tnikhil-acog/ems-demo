"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from "@/hooks/use-data";
import {
  Users,
  AlertCircle,
  Plus,
  LogOut,
  Upload,
  BarChart3,
  Clock,
  TrendingUp,
  Star,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  status: string;
  joinDate: string;
  exitDate?: string;
  onboardingProgress?: number;
  skills?: Array<{ technology: string; rating: number }>;
}

export default function HRDashboard() {
  const { data, loading } = useData();
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

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

  // Calculate stats
  const activeEmployees = data.employees.filter(
    (emp: Employee) => emp.status === "active"
  ).length;
  const newHires = data.employees.filter((emp: Employee) => {
    const joinDate = new Date(emp.joinDate);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return joinDate > threeMonthsAgo && emp.status === "active";
  }).length;
  const exitPipeline = data.employees.filter(
    (emp: Employee) => emp.status === "exit-initiated"
  ).length;

  const incompleteProfiles = data.employees.filter(
    (emp: Employee) => emp.onboardingProgress !== 100
  );

  const daysUntilNextExit = (emp: Employee) => {
    if (!emp.exitDate) return null;
    const exitDate = new Date(emp.exitDate);
    const today = new Date();
    const diffTime = exitDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTrendIcon = (trend: string) => {
    if (trend.includes("up-high"))
      return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (trend.includes("up"))
      return <ArrowUp className="w-4 h-4 text-blue-500" />;
    return <ArrowRight className="w-4 h-4 text-gray-500" />;
  };

  const getTrendLabel = (trend: string) => {
    if (trend.includes("up-high")) return "High Demand ↑↑";
    if (trend.includes("up")) return "Growing ↑";
    return "Stable →";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-sm">
            {star <= rating ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout role="hr" title="HR Dashboard" currentPath="/hr">
      <div className="space-y-6">
        {/* QUICK STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {activeEmployees}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Active Employees
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Status: All employment types
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {newHires}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  New Hires (Q1 2025)
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {newHires} onboarded, {incompleteProfiles.length} pending
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {
                    data.employees.filter(
                      (e: Employee) => e.skills && e.skills.length === 0
                    ).length
                  }
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Bench / Available
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Resources available for allocation
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {exitPipeline}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Exit Pipeline
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Employees in exit process
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PRIMARY CONTENT: TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN: ONBOARDING TRACKER */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Onboarding Tracker
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-2">
                New employees completing profile setup
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {incompleteProfiles.length > 0 ? (
                <>
                  <div className="text-sm font-medium text-foreground">
                    Incomplete Profiles: {incompleteProfiles.length}
                  </div>
                  {incompleteProfiles.map((emp: Employee) => {
                    const daysSinceJoin = Math.floor(
                      (new Date().getTime() -
                        new Date(emp.joinDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    const isOverdue = daysSinceJoin > 30;

                    return (
                      <div
                        key={emp.id}
                        className="border rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Joining Date:{" "}
                              {new Date(emp.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                          {isOverdue && (
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium">
                              Progress
                            </span>
                            <span className="text-xs font-bold text-primary">
                              {emp.onboardingProgress}%
                            </span>
                          </div>
                          <div className="bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                emp.onboardingProgress === 100
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }`}
                              style={{
                                width: `${emp.onboardingProgress}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Days Since Joining: {daysSinceJoin}
                          {isOverdue && (
                            <span className="ml-2 font-medium text-orange-600">
                              ⚠ OVERDUE
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs flex-1"
                          >
                            Send Reminder
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs flex-1"
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <Button variant="outline" className="w-full text-xs">
                    View All Onboarding
                  </Button>
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm">All employees completed onboarding!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RIGHT COLUMN: EXIT PIPELINE */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogOut size={20} />
                Exit Pipeline Management
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-2">
                Employees in departure process
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {exitPipeline > 0 ? (
                <>
                  <div className="text-sm font-medium text-foreground">
                    Total in Pipeline: {exitPipeline}
                  </div>
                  {data.employees
                    .filter((emp: Employee) => emp.status === "exit-initiated")
                    .map((emp: Employee) => {
                      const daysLeft = daysUntilNextExit(emp);
                      return (
                        <div
                          key={emp.id}
                          className="border rounded-lg p-3 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm">{emp.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {emp.designation} • {emp.department}
                              </p>
                            </div>
                            <Badge className="bg-orange-100 text-orange-800">
                              Exit Initiated
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">
                                Last Working Day
                              </p>
                              <p className="font-medium text-foreground">
                                {emp.exitDate
                                  ? new Date(emp.exitDate).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Days Remaining
                              </p>
                              <p className="font-medium text-red-600">
                                {daysLeft} days
                              </p>
                            </div>
                          </div>

                          <div className="bg-muted rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: "50%" }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Exit Checklist: 50% Complete
                          </p>

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs flex-1"
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs flex-1"
                            >
                              Update Status
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  <Button variant="outline" className="w-full text-xs">
                    Manage All Exits
                  </Button>
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm">No employees in exit process</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* DEPARTMENT ANALYTICS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={20} />
              Department Analytics
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-2">
              Workforce distribution and utilization
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.departmentStats?.map(
                (dept: {
                  name: string;
                  total: number;
                  bench: number;
                  allocated: number;
                  utilization: number;
                }) => (
                  <div key={dept.name}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-medium text-sm">{dept.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {dept.total} total • {dept.bench} on bench •{" "}
                          {dept.allocated} allocated
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{dept.utilization}%</p>
                        <p className="text-xs text-muted-foreground">
                          utilization
                        </p>
                      </div>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          dept.utilization > 90
                            ? "bg-green-500"
                            : dept.utilization > 75
                            ? "bg-blue-500"
                            : "bg-orange-500"
                        }`}
                        style={{
                          width: `${dept.utilization}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* TOP SKILLS INVENTORY */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star size={20} />
              Top Skills (Organizational)
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-2">
              Most common competencies and trending skills
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.organizationSkills?.slice(0, 10).map(
                (
                  skill: {
                    name: string;
                    count: number;
                    avgRating: number;
                    trend: string;
                    experts: string[];
                  },
                  index: number
                ) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground w-6">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{skill.name}</p>
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            <span>{skill.count} employees</span>
                            <span className="flex items-center gap-1">
                              {renderStars(Math.round(skill.avgRating))}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium">
                        {getTrendIcon(skill.trend)}
                        {getTrendLabel(skill.trend)}
                      </div>
                    </div>
                    <div className="bg-muted rounded-full h-2 mb-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(skill.count / 5) * 100}%`,
                        }}
                      ></div>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedSkill(
                          expandedSkill === skill.name ? null : skill.name
                        )
                      }
                      className="text-xs text-primary hover:underline"
                    >
                      {expandedSkill === skill.name ? "Hide" : "Show"} details
                    </button>

                    {expandedSkill === skill.name && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs space-y-1">
                        {skill.experts.length > 0 ? (
                          <>
                            <p className="font-medium">Experts:</p>
                            <ul className="list-disc list-inside">
                              {skill.experts.map((expertId: string) => {
                                const expert = data.employees.find(
                                  (e: Employee) => e.id === expertId
                                );
                                return <li key={expertId}>{expert?.name}</li>;
                              })}
                            </ul>
                          </>
                        ) : (
                          <p className="text-muted-foreground">
                            No experts available yet
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-12 bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center gap-2 font-semibold">
            <Plus size={20} />
            <span className="hidden sm:inline">Add New Employee</span>
            <span className="sm:hidden">Add Employee</span>
          </Button>
          <Button className="h-12 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 font-semibold">
            <LogOut size={20} />
            <span className="hidden sm:inline">Initiate Exit</span>
            <span className="sm:hidden">Exit Process</span>
          </Button>
          <Button className="h-12 bg-gray-700 hover:bg-gray-800 text-white flex items-center justify-center gap-2 font-semibold">
            <Upload size={20} />
            <span className="hidden sm:inline">Bulk Import</span>
            <span className="sm:hidden">Import</span>
          </Button>
          <Button className="h-12 bg-gray-700 hover:bg-gray-800 text-white flex items-center justify-center gap-2 font-semibold">
            <BarChart3 size={20} />
            <span className="hidden sm:inline">Generate Report</span>
            <span className="sm:hidden">Report</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
