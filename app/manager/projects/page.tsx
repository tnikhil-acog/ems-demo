"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCard, ProjectCardProps } from "@/components/manager";
import { useData } from "@/hooks/use-data";
import LoadingState from "@/components/ui/loading";
import { FolderKanban, Plus } from "lucide-react";
import { useState } from "react";

export default function MyProjectsPage() {
  const { data, loading } = useData();
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  if (loading || !data) {
    return (
      <DashboardLayout
        role="manager"
        title="My Projects"
        currentPath="/manager/projects"
      >
        <LoadingState message="Loading projects..." />
      </DashboardLayout>
    );
  }

  const projects = data.projects || [];
  const allocations = data.project_allocations || [];

  // Convert project data to ProjectCardProps
  const allProjects: ProjectCardProps[] = projects.map((proj: any) => {
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

    // Calculate days left (mock calculation)
    const today = new Date();
    const endDate = new Date(
      proj.endDate || today.getTime() + 90 * 24 * 60 * 60 * 1000
    );
    const daysLeft = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      id: proj.id,
      name: proj.name,
      type: proj.type,
      status: proj.status,
      teamSize: proj.teamSize || projectAllocations.length,
      avgAllocation: avgAllocation,
      timeline: {
        start: "Jan 1",
        end: endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        daysLeft: Math.max(0, daysLeft),
      },
      sentiment: "neutral",
      blockers: 0,
    };
  });

  // Apply filters
  const filteredProjects = allProjects.filter((project: any) => {
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    const matchesType = typeFilter === "all" || project.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const activeCount = filteredProjects.filter(
    (p: any) => p.status !== "blocked"
  ).length;

  return (
    <DashboardLayout
      role="manager"
      title="My Projects"
      currentPath="/manager/projects"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FolderKanban size={32} />
              My Projects
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeCount} active project{activeCount !== 1 ? "s" : ""}
            </p>
          </div>
          <Button className="gap-2">
            <Plus size={16} />
            Create Project
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status: All</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Type: All</SelectItem>
                  <SelectItem value="C">Customer (C)</SelectItem>
                  <SelectItem value="P">Product (P)</SelectItem>
                  <SelectItem value="S">Sales (S)</SelectItem>
                  <SelectItem value="M">Maintenance (M)</SelectItem>
                  <SelectItem value="O">Operations (O)</SelectItem>
                  <SelectItem value="R">Research (R)</SelectItem>
                  <SelectItem value="U">Utility (U)</SelectItem>
                  <SelectItem value="E">External (E)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <FolderKanban size={48} className="mx-auto mb-4 opacity-20" />
                <p>No projects found matching your filters.</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => {
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
