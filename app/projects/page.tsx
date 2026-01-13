"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from "@/hooks/use-data";
import { ProjectDetailModal } from "@/components/modals";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoadingState from "@/components/ui/loading";
import { Users, TrendingUp } from "lucide-react";

function ProjectsContent() {
  const { data, loading } = useData();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState("all");
  const [currentRole, setCurrentRole] = useState<"employee" | "manager" | "hr">(
    "employee"
  );
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (
      roleParam === "manager" ||
      roleParam === "hr" ||
      roleParam === "employee"
    ) {
      setCurrentRole(roleParam);
    }
  }, [searchParams]);

  if (loading || !data) {
    return (
      <DashboardLayout
        role={currentRole}
        title="Projects"
        currentPath="/projects"
        breadcrumbs={[{ label: "All Projects" }]}
      >
        <LoadingState message="Loading projects..." />
      </DashboardLayout>
    );
  }

  const filteredProjects = data.projects.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  return (
    <DashboardLayout
      role={currentRole}
      title="Projects"
      currentPath="/projects"
      breadcrumbs={[{ label: "All Projects" }]}
    >
      <div className="space-y-6">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {["all", "active", "paused", "completed"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
              className={filter === status ? "bg-primary" : "bg-transparent"}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {project.code}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      project.status === "active"
                        ? "bg-green-100 text-green-700"
                        : project.status === "paused"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>

                {/* Team Size */}
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-muted-foreground" />
                  <span className="text-sm">
                    {project.teamSize} team members
                  </span>
                </div>

                {/* Allocation */}
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-muted-foreground" />
                  <span className="text-sm">
                    {project.allocation}% allocation
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSelectedProject(project);
                    setIsProjectModalOpen(true);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          isOpen={isProjectModalOpen}
          onClose={() => {
            setIsProjectModalOpen(false);
            setSelectedProject(null);
          }}
          canEdit={currentRole === "manager"}
          allocations={data.project_allocations || []}
          employees={data.employees || []}
        />
      </div>
    </DashboardLayout>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
