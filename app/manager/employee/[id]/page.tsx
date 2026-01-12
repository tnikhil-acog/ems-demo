"use client";

import { use } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useData, Employee } from "@/hooks/use-data";
import { getInitials } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  User,
  TrendingUp,
  Award,
} from "lucide-react";
import Link from "next/link";

interface ProjectAllocation {
  projectId: string;
  projectName: string;
  allocation: number;
  role: string;
  status: string;
  startDate: string;
}

interface PreviousProject {
  projectId: string;
  projectName: string;
  duration: string;
  skillsUsed: string[];
  outcome: string;
}

export default function ManagerEmployeeProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data, loading } = useData();

  if (loading || !data) {
    return (
      <DashboardLayout
        role="manager"
        title="Employee Profile"
        currentPath="/manager/employee"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading employee profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const employees: Employee[] = data.employees || [];
  const projects: any[] = data.projects || [];
  const employee = employees.find((emp) => emp.id === resolvedParams.id);

  if (!employee) {
    return (
      <DashboardLayout
        role="manager"
        title="Employee Not Found"
        currentPath="/manager/employee"
      >
        <div className="text-center py-12">
          <User
            size={64}
            className="mx-auto mb-4 text-muted-foreground opacity-20"
          />
          <h2 className="text-2xl font-bold mb-2">Employee Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The employee with ID {resolvedParams.id} could not be found.
          </p>
          <Link href="/manager/team">
            <Button>
              <ArrowLeft size={16} className="mr-2" />
              Back to Team
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const manager = employees.find((emp: any) => emp.id === employee.reportingTo);

  // Get current project allocations from project_allocations table
  const allocations: any[] = data.project_allocations || [];
  const employeeAllocations = allocations.filter(
    (alloc) => alloc.emp_id === employee.id
  );

  const currentAllocations: ProjectAllocation[] = employeeAllocations.map(
    (alloc) => {
      const project = projects.find((p) => p.id === alloc.project_id);
      return {
        projectId: alloc.project_id,
        projectName: project?.name || "Unknown Project",
        allocation: alloc.allocation_percentage,
        role: alloc.is_lead ? "Lead" : "Member",
        status: project?.status || "active",
        startDate: alloc.date_allocated,
      };
    }
  );

  // Mock previous projects (in real app, this would come from historical data)
  const previousProjects: PreviousProject[] = [
    {
      projectId: "PROJ-HIST-001",
      projectName: "API Gateway Refactor",
      duration: "6 months (Jan 2024 - Jun 2024)",
      skillsUsed: ["Node.js", "GraphQL", "PostgreSQL"],
      outcome:
        "Successfully refactored legacy API, improved response time by 45%",
    },
    {
      projectId: "PROJ-HIST-002",
      projectName: "Payment Integration",
      duration: "3 months (Oct 2023 - Dec 2023)",
      skillsUsed: ["React", "TypeScript", "Stripe API"],
      outcome: "Implemented secure payment processing for all platforms",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
        );
      case "exit-initiated":
        return <Badge variant="destructive">Exit Initiated</Badge>;
      case "exited":
        return <Badge variant="secondary">Exited</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <span className="text-yellow-500">
        {"★".repeat(fullStars)}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  // Calculate total allocation
  const totalAllocation = currentAllocations.reduce(
    (sum, proj) => sum + proj.allocation,
    0
  );
  const availableCapacity = 100 - totalAllocation;

  return (
    <DashboardLayout
      role="manager"
      title={employee.name}
      currentPath="/manager/employee"
    >
      {/* Header */}
      <div className="mb-6">
        <Link href="/manager/team">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Team
          </Button>
        </Link>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-3xl font-bold">
                  {getInitials(employee.name)}
                </AvatarFallback>
              </Avatar>

              {/* Employee Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{employee.name}</h1>
                    <p className="text-lg text-muted-foreground">
                      {employee.designation} • {employee.department}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Employee ID: {employee.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(employee.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-muted-foreground" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span>{employee.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>
                      Joined:{" "}
                      {new Date(employee.joinDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {manager && (
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-muted-foreground" />
                      <span>Reports to: {manager.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase size={16} className="text-muted-foreground" />
                    <span>{employee.employmentType || "Full-time"}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Allocation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Current Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllocation}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Allocated to active projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Available Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                availableCapacity >= 40 ? "text-green-600" : "text-orange-600"
              }`}
            >
              {availableCapacity}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for new assignments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentAllocations.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently assigned to
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="current-projects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current-projects">Current Projects</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="previous-projects">Previous Projects</TabsTrigger>
        </TabsList>

        {/* Current Projects Tab */}
        <TabsContent value="current-projects" className="space-y-4">
          {currentAllocations.length > 0 ? (
            currentAllocations.map((proj) => (
              <Card key={proj.projectId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{proj.projectName}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {proj.projectId}
                      </p>
                    </div>
                    <Badge
                      variant={
                        proj.status === "active" ? "default" : "secondary"
                      }
                    >
                      {proj.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Allocation
                      </p>
                      <p className="text-lg font-bold">{proj.allocation}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="text-lg font-bold">{proj.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Start Date
                      </p>
                      <p className="text-lg font-bold">
                        {new Date(proj.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>No current project assignments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Allocations Tab */}
        <TabsContent value="allocations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={18} />
                Resource Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Total Allocation</span>
                  <span className="text-sm font-bold">{totalAllocation}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      totalAllocation >= 90
                        ? "bg-green-500"
                        : totalAllocation >= 70
                        ? "bg-blue-500"
                        : totalAllocation >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(totalAllocation, 100)}%` }}
                  />
                </div>
              </div>

              {currentAllocations.map((proj) => (
                <div key={proj.projectId}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">{proj.projectName}</span>
                    <span className="text-sm font-bold">
                      {proj.allocation}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all"
                      style={{ width: `${proj.allocation}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Available Capacity
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      availableCapacity >= 40
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {availableCapacity}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4">
          {employee.skills && employee.skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employee.skills.map((skill: any) => (
                <Card key={skill.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{skill.technology}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {skill.status}
                          </p>
                        </div>
                        <Badge
                          variant={
                            skill.status === "verified"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {skill.status === "verified" ? "✓" : "Pending"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(skill.rating)}
                        <span className="text-sm text-muted-foreground ml-2">
                          {skill.rating}/5
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>No skills recorded</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Previous Projects Tab */}
        <TabsContent value="previous-projects" className="space-y-4">
          {previousProjects.length > 0 ? (
            previousProjects.map((proj) => (
              <Card key={proj.projectId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Award size={18} />
                        {proj.projectName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        {proj.duration}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-2">Skills Used</p>
                    <div className="flex flex-wrap gap-2">
                      {proj.skillsUsed.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2">Outcome</p>
                    <p className="text-sm text-muted-foreground">
                      {proj.outcome}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>No previous projects on record</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
