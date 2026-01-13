"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  QuickStats,
  ProjectCard,
  ProjectCardProps,
  TeamMember,
  PendingActions,
} from "@/components/manager";
import { useData } from "@/hooks/use-data";
import { ProjectDetailModal } from "@/components/modals";
import LoadingState from "@/components/ui/loading";
import {
  Users,
  Briefcase,
  UserCheck,
  FolderKanban,
  CheckCircle2,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

export default function ManagerDashboard() {
  const { data, loading } = useData();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  if (loading || !data) {
    return (
      <DashboardLayout role="manager" title="Dashboard" currentPath="/manager">
        <LoadingState />
      </DashboardLayout>
    );
  }

  // Get data from context
  const projects = data.projects || [];
  const allocations = data.project_allocations || [];

  // Team members from employees data with actual allocation data
  const teamMembers: TeamMember[] = data.employees
    .slice(0, 3)
    .map((emp: any) => {
      const empAllocations = allocations.filter(
        (alloc: any) => alloc.emp_id === emp.id
      );
      const totalAllocation = empAllocations.reduce(
        (sum: number, alloc: any) => sum + alloc.allocation_percentage,
        0
      );
      const available = Math.max(0, 100 - totalAllocation);
      return {
        id: emp.id,
        name: emp.name,
        designation: emp.designation,
        department: emp.department,
        allocation: totalAllocation,
        available: available,
        projectCount: empAllocations.length,
        email: emp.email,
      };
    });

  const onBenchCount = teamMembers.filter((m) => m.available >= 50).length;

  // Get projects with allocation data
  const myProjects: ProjectCardProps[] = projects
    .slice(0, 2)
    .map((proj: any) => {
      const projectAllocations = allocations.filter(
        (alloc: any) => alloc.project_id === proj.id
      );
      const totalAllocation = projectAllocations.reduce(
        (sum: number, alloc: any) => sum + alloc.allocation_percentage,
        0
      );
      const avgAllocation = Math.round(
        projectAllocations.length > 0
          ? totalAllocation / projectAllocations.length
          : 0
      );

      return {
        id: proj.id,
        name: proj.name,
        type: proj.type,
        status: proj.status,
        teamSize: proj.teamSize || projectAllocations.length,
        avgAllocation: avgAllocation,
        sentiment: "neutral",
      };
    });

  const statsData = [
    {
      title: "Team Size",
      value: teamMembers.length * 4,
      icon: Users,
      variant: "default" as const,
    },
    {
      title: "Available Capacity",
      value: "35%",
      icon: UserCheck,
      variant: "success" as const,
    },
    {
      title: "On Bench",
      value: onBenchCount,
      icon: UserCheck,
      variant: onBenchCount > 2 ? ("warning" as const) : ("default" as const),
    },
    {
      title: "Projects Managed",
      value: myProjects.length * 2,
      icon: FolderKanban,
      variant: "default" as const,
    },
  ];

  return (
    <DashboardLayout role="manager" title="Dashboard" currentPath="/manager">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome, Sarah Johnson</p>
        </div>

        {/* Quick Stats */}
        <QuickStats stats={statsData} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Team - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} />
                    My Team
                  </CardTitle>
                  <Link href="/manager/team">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-semibold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {member.designation}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>
                          Allocation:{" "}
                          <span className="font-semibold">
                            {member.allocation}%
                          </span>
                        </span>
                        <span>•</span>
                        <span>
                          Available:{" "}
                          <span className="font-semibold">
                            {member.available}%
                          </span>
                        </span>
                        <span>•</span>
                        <span>
                          Projects:{" "}
                          <span className="font-semibold">
                            {member.projectCount}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/manager/employee/${member.id}`}>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </Link>
                      <Button size="sm">Assign</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Report Summaries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 size={20} />
                  Team Weekly Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.reports.slice(0, 3).map((report: any) => {
                    const employee = data.employees.find(
                      (e: any) => e.id === report.employeeId
                    );
                    return (
                      <div
                        key={report.id}
                        className="p-4 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                              {employee && getInitials(employee.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                {employee?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Week of {report.week}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-lg ${
                              report.sentiment === "positive"
                                ? "text-green-600"
                                : report.sentiment === "neutral"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {report.sentiment === "positive" && "😊"}
                            {report.sentiment === "neutral" && "😐"}
                            {report.sentiment === "negative" && "😟"}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mb-2">
                          {report.summary}
                        </p>
                        <Button variant="link" className="text-xs p-0">
                          Read full report →
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Projects - Right Column (1/3 width) */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase size={20} />
                    My Projects
                  </CardTitle>
                  <Link href="/manager/projects">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {myProjects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div>
                      <h4 className="font-semibold">
                        {project.id} - {project.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {project.status === "healthy" && (
                          <span className="text-xs text-green-600">
                            ✓ Healthy
                          </span>
                        )}
                        {project.status === "at-risk" && (
                          <span className="text-xs text-yellow-600">
                            ⚠️ At Risk
                          </span>
                        )}
                        {project.blockers && project.blockers > 0 && (
                          <span className="text-xs text-red-600">
                            ({project.blockers} blockers)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>Team: {project.teamSize} members</span>
                      <span className="mx-2">•</span>
                      <span>Avg: {project.avgAllocation}%</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const fullProject = data.projects.find(
                          (p: any) => p.id === project.id
                        );
                        setSelectedProject(fullProject);
                        setIsProjectModalOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pending Actions */}
        <PendingActions
          transferRequests={[
            {
              id: "TR001",
              employeeName: "Jane Doe",
              requester: "Tom Brown",
              projectId: "C060",
              projectName: "Mobile Redesign",
            },
            {
              id: "TR002",
              employeeName: "Mike Chen",
              requester: "Alice Wilson",
              projectId: "P010",
              projectName: "Internal Tool",
            },
          ]}
          pendingReports={[
            { employeeName: "Mike", dueDate: "today" },
            { employeeName: "Alice", dueDate: "today" },
            { employeeName: "Tom", dueDate: "today" },
          ]}
        />

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          isOpen={isProjectModalOpen}
          onClose={() => {
            setIsProjectModalOpen(false);
            setSelectedProject(null);
          }}
          canEdit={true}
          onSave={(updatedProject) => {
            // TODO: Implement save logic - update data.json or backend
            console.log("Save project:", updatedProject);
            setIsProjectModalOpen(false);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
