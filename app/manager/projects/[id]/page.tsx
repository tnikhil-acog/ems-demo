"use client";

import { use } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllocationBar, TeamMember } from "@/components/manager";
import { useData } from "@/hooks/use-data";
import {
  ArrowLeft,
  Edit,
  Calendar,
  Users,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage({
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
        title="Project Details"
        currentPath="/manager/projects"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const projects: any[] = data.projects || [];
  const employees: any[] = data.employees || [];
  const allocations: any[] = data.project_allocations || [];

  // Get project by ID
  const project =
    projects.find((p) => p.id === resolvedParams.id) || projects[0];

  // Get team members for this project
  const projectAllocations = allocations.filter(
    (alloc) => alloc.project_id === project.id
  );

  const teamMembers: (TeamMember & {
    isLead?: boolean;
    dependency?: number;
    transferable?: string;
  })[] = projectAllocations.map((alloc) => {
    const employee = employees.find((e) => e.id === alloc.emp_id);
    return {
      id: employee?.id,
      name: employee?.name,
      designation: employee?.designation,
      allocation: alloc.allocation_percentage,
      available: Math.max(
        0,
        100 -
          allocations
            .filter((a) => a.emp_id === alloc.emp_id)
            .reduce((sum, a) => sum + a.allocation_percentage, 0)
      ),
      projectCount: allocations.filter((a) => a.emp_id === alloc.emp_id).length,
      isLead: alloc.is_lead,
      dependency: alloc.dependency_score,
      transferable: alloc.transferable,
    };
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">✓ Healthy</Badge>
        );
      case "at-risk":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            ⚠️ At Risk
          </Badge>
        );
      case "blocked":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">🛑 Blocked</Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      role="manager"
      title={project.name}
      currentPath="/manager/projects"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link href="/manager/projects">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
          </Link>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">
                    {project.id} - {project.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span>Client: {project.client}</span>
                    <span>•</span>
                    <span>
                      Type: {project.type} (Priority {project.priority})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(project.status)}
                  </div>
                </div>
                <Button className="gap-2">
                  <Edit size={16} />
                  Edit Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar size={18} />
                    Project Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Start Date
                      </p>
                      <p className="font-medium">{project.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-medium">{project.endDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Days Remaining
                    </p>
                    <p className="font-medium">{project.daysLeft} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Manager</p>
                    <p className="font-medium">{project.manager}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{project.status}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={18} />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Team Size
                    </span>
                    <span className="text-2xl font-bold">
                      {project.teamSize}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Avg Allocation
                    </span>
                    <span className="text-2xl font-bold">
                      {project.avgAllocation}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Health
                    </span>
                    {getStatusBadge(project.status)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users size={18} />
                    Team Management
                  </CardTitle>
                  <Button className="gap-2">
                    <UserPlus size={16} />
                    Add Team Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-semibold text-sm">
                          Name
                        </th>
                        <th className="text-left py-3 font-semibold text-sm">
                          Role
                        </th>
                        <th className="text-left py-3 font-semibold text-sm">
                          Allocation
                        </th>
                        <th className="text-center py-3 font-semibold text-sm">
                          Lead
                        </th>
                        <th className="text-center py-3 font-semibold text-sm">
                          Dependency
                        </th>
                        <th className="text-center py-3 font-semibold text-sm">
                          Transferable
                        </th>
                        <th className="text-left py-3 font-semibold text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((member) => (
                        <tr
                          key={member.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <span className="font-medium">{member.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-sm">{member.designation}</td>
                          <td className="py-3">
                            <AllocationBar
                              percentage={member.allocation}
                              height="sm"
                            />
                          </td>
                          <td className="py-3 text-center">
                            {member.isLead ? (
                              <CheckCircle
                                size={16}
                                className="inline text-green-600"
                              />
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 text-center">
                            <Badge
                              variant={
                                member.dependency && member.dependency >= 4
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {member.dependency}/5
                            </Badge>
                          </td>
                          <td className="py-3 text-center text-sm">
                            {member.transferable}
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit size={14} />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={18} />
                  Project Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Overall Status:</span>
                  {getStatusBadge(project.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2">
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl mb-2">😊</div>
                      <p className="text-sm font-medium">Team Sentiment</p>
                      <p className="text-2xl font-bold text-green-600">
                        Positive
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        6/7 submitted
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardContent className="pt-6 text-center">
                      <AlertTriangle
                        size={32}
                        className="mx-auto mb-2 text-orange-600"
                      />
                      <p className="text-sm font-medium">Blockers</p>
                      <p className="text-2xl font-bold">2 active</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        High priority
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardContent className="pt-6 text-center">
                      <CheckCircle
                        size={32}
                        className="mx-auto mb-2 text-green-600"
                      />
                      <p className="text-sm font-medium">Report Submission</p>
                      <p className="text-2xl font-bold">86%</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        6/7 this week
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">
                      This Week's Summary (AI Generated)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                        <CheckCircle size={16} className="text-green-600" />
                        Achievements
                      </h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                        <li>API integration completed</li>
                        <li>Database optimization done</li>
                        <li>15 unit tests added</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} className="text-red-600" />
                        Blockers
                      </h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                        <li>Waiting for client design approval (High)</li>
                        <li>AWS permissions issue (Medium)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        😊 Sentiment: Positive
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        6 positive, 0 neutral, 0 negative
                      </p>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      View Individual Reports
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={18} />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="text-xl font-bold">{project.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="text-xl font-bold">{project.endDate}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-bold">40% Complete</span>
                  </div>
                  <AllocationBar
                    percentage={40}
                    showPercentage={false}
                    variant="success"
                    height="lg"
                  />
                </div>

                <div className="bg-muted/50 rounded-lg p-6">
                  <div className="grid grid-cols-6 gap-2 text-center">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
                      (month, i) => (
                        <div key={month}>
                          <div className="text-xs font-medium mb-2">
                            {month}
                          </div>
                          <div
                            className={`h-8 rounded ${
                              i < 2
                                ? "bg-primary"
                                : i === 2
                                ? "bg-primary/50"
                                : "bg-muted"
                            }`}
                          ></div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex items-center justify-center mt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-3 h-3 bg-primary rounded"></div>
                      <span>Completed</span>
                      <div className="w-3 h-3 bg-primary/50 rounded ml-3"></div>
                      <span>In Progress</span>
                      <div className="w-3 h-3 bg-muted rounded ml-3"></div>
                      <span>Upcoming</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <Calendar size={16} />
                    Change Deadline
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
