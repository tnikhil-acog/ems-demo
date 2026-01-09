"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useData } from "@/hooks/use-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut,
  Download,
  Plus,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Edit,
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
  location?: string;
  status: string;
  exitDate?: string;
  exitReason?: string;
  reportingTo?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export default function ExitManagement() {
  const { data, loading } = useData();
  const [activeTab, setActiveTab] = useState("in-progress");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [exitTypeFilter, setExitTypeFilter] = useState("all");

  if (loading || !data) {
    return (
      <DashboardLayout
        role="hr"
        title="Exit Management"
        currentPath="/hr/exits"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading exit data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const employees: Employee[] = data.employees || [];

  // Calculate days until exit
  const calculateDaysRemaining = (exitDate?: string) => {
    if (!exitDate) return null;
    const exit = new Date(exitDate);
    const today = new Date();
    const diffTime = exit.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Simulated checklist for demo purposes
  const getChecklistForEmployee = (empId: string): ChecklistItem[] => {
    // In real app, this would come from backend
    const baseChecklist = [
      { id: "handover", label: "Handover Documentation", completed: true },
      { id: "knowledge", label: "Knowledge Transfer", completed: true },
      { id: "equipment", label: "Equipment Return", completed: true },
      { id: "access", label: "Access Revocation", completed: false },
      { id: "payroll", label: "Final Payroll", completed: false },
      { id: "interview", label: "Exit Interview", completed: false },
    ];
    return baseChecklist;
  };

  // Categorize exits
  const inProgressExits = employees.filter(
    (emp) => emp.status === "exit-initiated"
  );
  const exitedEmployees = employees.filter((emp) => emp.status === "exited");
  const archivedExits = employees.filter((emp) => emp.status === "archived");

  // Calculate stats
  const inProgressCount = inProgressExits.length;
  const thisMonthExits = exitedEmployees.filter((emp) => {
    if (!emp.exitDate) return false;
    const exitDate = new Date(emp.exitDate);
    const now = new Date();
    return (
      exitDate.getMonth() === now.getMonth() &&
      exitDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const thisQuarterExits = exitedEmployees.filter((emp) => {
    if (!emp.exitDate) return false;
    const exitDate = new Date(emp.exitDate);
    const now = new Date();
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const exitQuarter = Math.floor(exitDate.getMonth() / 3);
    return (
      exitQuarter === currentQuarter &&
      exitDate.getFullYear() === now.getFullYear()
    );
  }).length;

  // Filter function
  const filterExits = (exitList: Employee[]) => {
    return exitList.filter((emp) => {
      const matchesDept =
        departmentFilter === "all" || emp.department === departmentFilter;
      const matchesType =
        exitTypeFilter === "all" || emp.exitReason === exitTypeFilter;
      return matchesDept && matchesType;
    });
  };

  const departments = Array.from(new Set(employees.map((e) => e.department)));
  const exitTypes = Array.from(
    new Set(employees.map((e) => e.exitReason).filter(Boolean))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "exit-initiated":
        return <Badge variant="destructive">Exit Initiated</Badge>;
      case "exited":
        return <Badge variant="secondary">Exited</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderExitCard = (emp: Employee) => {
    const daysRemaining = calculateDaysRemaining(emp.exitDate);
    const checklist = getChecklistForEmployee(emp.id);
    const completedCount = checklist.filter((item) => item.completed).length;
    const totalCount = checklist.length;
    const completionPercent = Math.round((completedCount / totalCount) * 100);
    const manager = employees.find((e) => e.id === emp.reportingTo);

    return (
      <Card key={emp.id}>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Employee Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{emp.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {emp.designation} • {emp.department}
                  </p>
                  {emp.location && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {emp.location}
                    </p>
                  )}
                  {manager && (
                    <p className="text-xs text-muted-foreground">
                      Manager: {manager.name}
                    </p>
                  )}
                </div>
                {getStatusBadge(emp.status)}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {emp.exitDate && (
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar size={12} />
                      Last Working Day
                    </p>
                    <p className="text-sm font-medium">
                      {new Date(emp.exitDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {daysRemaining !== null && emp.status === "exit-initiated" && (
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} />
                      Days Remaining
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        daysRemaining < 7 ? "text-red-600" : ""
                      }`}
                    >
                      {daysRemaining > 0 ? `${daysRemaining} days` : "Today"}
                    </p>
                  </div>
                )}

                {emp.exitReason && (
                  <div>
                    <p className="text-xs text-muted-foreground">Exit Type</p>
                    <p className="text-sm font-medium capitalize">
                      {emp.exitReason}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground">Notice Period</p>
                  <p className="text-sm font-medium">30 days</p>
                </div>
              </div>

              {/* Checklist Progress */}
              {emp.status === "exit-initiated" && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-medium flex items-center gap-1">
                      <FileText size={14} />
                      Exit Checklist
                    </p>
                    <p className="text-xs font-bold">
                      {completedCount}/{totalCount} ({completionPercent}%)
                    </p>
                  </div>
                  <Progress value={completionPercent} className="h-2 mb-3" />

                  <div className="grid grid-cols-2 gap-2">
                    {checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-xs"
                      >
                        {item.completed ? (
                          <CheckCircle size={14} className="text-green-500" />
                        ) : (
                          <AlertCircle
                            size={14}
                            className="text-muted-foreground"
                          />
                        )}
                        <span
                          className={
                            item.completed ? "text-muted-foreground" : ""
                          }
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col gap-2 lg:w-48">
              <Button variant="outline" size="sm" className="w-full">
                <Eye size={14} className="mr-2" />
                View Details
              </Button>
              {emp.status === "exit-initiated" && (
                <>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit size={14} className="mr-2" />
                    Update Status
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Calendar size={14} className="mr-2" />
                    Reschedule
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout role="hr" title="Exit Management" currentPath="/hr/exits">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Exit Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage employee departures and exit processes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus size={16} className="mr-2" />
            Initiate New Exit
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {inProgressCount}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                In-Progress Exits
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Currently being processed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {thisMonthExits}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Exits This Month
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {thisQuarterExits}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Exits This Quarter
              </p>
              <p className="text-xs text-muted-foreground mt-2">Q1 2025</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter size={18} />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="text-sm font-medium mb-2 block">
                Exit Type
              </label>
              <Select value={exitTypeFilter} onValueChange={setExitTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {exitTypes.map((type) => (
                    <SelectItem key={type} value={type!}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for In Progress / Exited / Archived */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="in-progress">
            In Progress ({filterExits(inProgressExits).length})
          </TabsTrigger>
          <TabsTrigger value="exited">
            Exited ({filterExits(exitedEmployees).length})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived ({filterExits(archivedExits).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress" className="space-y-4">
          {filterExits(inProgressExits).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <LogOut
                  size={48}
                  className="mx-auto mb-4 text-muted-foreground opacity-20"
                />
                <p className="text-muted-foreground">
                  No exits currently in progress.
                </p>
              </CardContent>
            </Card>
          ) : (
            filterExits(inProgressExits).map((emp) => renderExitCard(emp))
          )}
        </TabsContent>

        <TabsContent value="exited" className="space-y-4">
          {filterExits(exitedEmployees).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <LogOut
                  size={48}
                  className="mx-auto mb-4 text-muted-foreground opacity-20"
                />
                <p className="text-muted-foreground">No recent exits.</p>
              </CardContent>
            </Card>
          ) : (
            filterExits(exitedEmployees).map((emp) => renderExitCard(emp))
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {filterExits(archivedExits).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <LogOut
                  size={48}
                  className="mx-auto mb-4 text-muted-foreground opacity-20"
                />
                <p className="text-muted-foreground">No archived exits.</p>
              </CardContent>
            </Card>
          ) : (
            filterExits(archivedExits).map((emp) => renderExitCard(emp))
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
