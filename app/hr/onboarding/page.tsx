"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useData } from "@/hooks/use-data";
import {
  UserPlus,
  Upload,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Eye,
  AlertCircle,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  reportingTo?: string;
  joinDate: string;
  onboardingProgress?: number;
  status: string;
  skills?: any[];
}

export default function OnboardingManager() {
  const { data, loading } = useData();
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilterType, setStatusFilterType] = useState("all"); // pending, completed, overdue
  const [sortBy, setSortBy] = useState("days-desc"); // days-asc, days-desc, completion-asc, completion-desc

  if (loading || !data) {
    return (
      <DashboardLayout
        role="hr"
        title="Onboarding Manager"
        currentPath="/hr/onboarding"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading onboarding data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const employees: Employee[] = data.employees || [];
  const OVERDUE_THRESHOLD_DAYS = 14;
  const COMPLETION_THRESHOLD = 100;

  // Calculate stats and categorize employees
  const onboardingEmployees = employees.filter(
    (emp) => emp.status === "active"
  );

  const calculateDaysSinceJoining = (joinDate: string) => {
    const join = new Date(joinDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - join.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getOnboardingStatus = (emp: Employee) => {
    const progress = emp.onboardingProgress ?? 100;
    const days = calculateDaysSinceJoining(emp.joinDate);

    if (progress >= COMPLETION_THRESHOLD) return "completed";
    if (days > OVERDUE_THRESHOLD_DAYS) return "overdue";
    return "pending";
  };

  const pendingCount = onboardingEmployees.filter(
    (emp) => getOnboardingStatus(emp) === "pending"
  ).length;

  const completedCount = onboardingEmployees.filter(
    (emp) => getOnboardingStatus(emp) === "completed"
  ).length;

  const overdueCount = onboardingEmployees.filter(
    (emp) => getOnboardingStatus(emp) === "overdue"
  ).length;

  // Calculate average completion time for completed employees
  const completedEmployees = onboardingEmployees.filter(
    (emp) => getOnboardingStatus(emp) === "completed"
  );
  const avgCompletionDays =
    completedEmployees.length > 0
      ? Math.round(
          completedEmployees.reduce(
            (sum, emp) => sum + calculateDaysSinceJoining(emp.joinDate),
            0
          ) / completedEmployees.length
        )
      : 0;

  // Filter employees
  const filteredEmployees = useMemo(() => {
    let filtered = onboardingEmployees.filter((emp) => {
      const matchesDept =
        departmentFilter === "all" || emp.department === departmentFilter;
      const empStatus = getOnboardingStatus(emp);
      const matchesStatus =
        statusFilterType === "all" || empStatus === statusFilterType;

      return matchesDept && matchesStatus;
    });

    // Sorting
    filtered.sort((a, b) => {
      const aDays = calculateDaysSinceJoining(a.joinDate);
      const bDays = calculateDaysSinceJoining(b.joinDate);
      const aProgress = a.onboardingProgress ?? 100;
      const bProgress = b.onboardingProgress ?? 100;

      switch (sortBy) {
        case "days-asc":
          return aDays - bDays;
        case "days-desc":
          return bDays - aDays;
        case "completion-asc":
          return aProgress - bProgress;
        case "completion-desc":
          return bProgress - aProgress;
        default:
          return 0;
      }
    });

    return filtered;
  }, [onboardingEmployees, departmentFilter, statusFilterType, sortBy]);

  const getMissingItems = (emp: Employee) => {
    const missing: string[] = [];
    const progress = emp.onboardingProgress ?? 100;

    if (progress < 100) {
      // Simulate missing items based on progress
      if (progress < 20)
        missing.push(
          "Picture",
          "Skills",
          "Resume",
          "Education",
          "Bio",
          "Contact Info"
        );
      else if (progress < 40)
        missing.push("Skills", "Resume", "Education", "Bio");
      else if (progress < 60) missing.push("Resume", "Education", "Bio");
      else if (progress < 80) missing.push("Education", "Bio");
      else missing.push("Bio");
    }

    return missing;
  };

  const getStatusBadge = (emp: Employee) => {
    const status = getOnboardingStatus(emp);
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
        );
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  return (
    <DashboardLayout
      role="hr"
      title="Onboarding Manager"
      currentPath="/hr/onboarding"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Onboarding Manager</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage new employee onboarding
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload size={16} className="mr-2" />
            Import Batch
          </Button>
          <Button variant="outline" size="sm">
            <Settings size={16} className="mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <UserPlus size={16} className="mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                {pendingCount}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Pending Onboarding
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                In progress, not complete
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {completedCount}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Completed
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Avg: {avgCompletionDays} days
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {overdueCount}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Overdue
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                &gt; {OVERDUE_THRESHOLD_DAYS} days incomplete
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {onboardingEmployees.length}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Active
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                All employees in system
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter size={18} />
            Filters & Sorting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={statusFilterType}
                onValueChange={setStatusFilterType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
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
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days-desc">
                    Days Since Joining (High to Low)
                  </SelectItem>
                  <SelectItem value="days-asc">
                    Days Since Joining (Low to High)
                  </SelectItem>
                  <SelectItem value="completion-asc">
                    Completion % (Low to High)
                  </SelectItem>
                  <SelectItem value="completion-desc">
                    Completion % (High to Low)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <div className="space-y-4">
        {filteredEmployees.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle
                size={48}
                className="mx-auto mb-4 text-muted-foreground opacity-20"
              />
              <p className="text-muted-foreground">
                {statusFilterType === "all"
                  ? "No employees in onboarding."
                  : `No employees with ${statusFilterType} status.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEmployees.map((emp) => {
            const days = calculateDaysSinceJoining(emp.joinDate);
            const progress = emp.onboardingProgress ?? 100;
            const status = getOnboardingStatus(emp);
            const missingItems = getMissingItems(emp);
            const manager = employees.find((e) => e.id === emp.reportingTo);

            return (
              <Card
                key={emp.id}
                className={
                  status === "overdue"
                    ? "border-red-200 dark:border-red-900"
                    : ""
                }
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Employee Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{emp.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {emp.designation} • {emp.department}
                          </p>
                          {manager && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Reports to: {manager.name}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(emp)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Joining Date
                          </p>
                          <p className="text-sm font-medium">
                            {new Date(emp.joinDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Days Since Joining
                          </p>
                          <p className="text-sm font-medium flex items-center gap-1">
                            {days} days
                            {status === "overdue" && (
                              <AlertTriangle
                                size={14}
                                className="text-red-500"
                              />
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-medium">
                            Profile Completion
                          </p>
                          <p className="text-xs font-bold">{progress}%</p>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      {/* Missing Items */}
                      {missingItems.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium mb-2 flex items-center gap-1">
                            <AlertCircle
                              size={14}
                              className="text-orange-500"
                            />
                            Missing Items
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {missingItems.map((item) => (
                              <Badge
                                key={item}
                                variant="outline"
                                className="text-xs"
                              >
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye size={14} className="mr-2" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Mail size={14} className="mr-2" />
                        Send Reminder
                      </Button>
                      {status === "overdue" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                        >
                          <AlertTriangle size={14} className="mr-2" />
                          Escalate
                        </Button>
                      )}
                      {status === "completed" && (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle size={14} className="mr-2" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary Footer */}
      {filteredEmployees.length > 0 && (
        <Card className="mt-6 bg-muted/30">
          <CardContent className="py-4">
            <p className="text-sm text-center text-muted-foreground">
              Showing {filteredEmployees.length} employee
              {filteredEmployees.length !== 1 ? "s" : ""} • Average completion:{" "}
              {Math.round(
                filteredEmployees.reduce(
                  (sum, e) => sum + (e.onboardingProgress ?? 100),
                  0
                ) / filteredEmployees.length
              )}
              %
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
