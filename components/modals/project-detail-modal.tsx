"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Code2,
  Users,
  Calendar,
  Edit2,
  TrendingUp,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Project {
  id: string;
  name: string;
  code: string;
  status: string;
  health?: string;
  type: string;
  teamSize: number;
  description?: string;
}

interface ProjectAllocation {
  allocation_id: string;
  emp_id: string;
  project_id: string;
  allocation_percentage: number;
  date_allocated: string;
  period?: string;
  utilization_status?: string;
  billability?: string;
  availability_date?: string;
  is_lead?: boolean;
  dependency_score?: number;
  transferable?: string;
  is_client_facing?: boolean;
  transferability_score?: number;
}

interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
}

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  canEdit?: boolean;
  onSave?: (project: Project) => void;
  allocations?: ProjectAllocation[];
  employees?: Employee[];
}

export function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  canEdit = false,
  onSave,
  allocations = [],
  employees = [],
}: ProjectDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(project);

  // Sync editedProject with project prop when it changes
  useEffect(() => {
    setEditedProject(project);
    setIsEditing(false);
  }, [project]);

  if (!project) return null;

  // Get allocations for this project
  const projectAllocations = allocations.filter(
    (alloc) => alloc.project_id === project.id
  );

  // Calculate project metrics
  const totalAllocation = projectAllocations.reduce(
    (sum, alloc) => sum + alloc.allocation_percentage,
    0
  );
  const leadCount = projectAllocations.filter((alloc) => alloc.is_lead).length;
  const billableCount = projectAllocations.filter(
    (alloc) => alloc.billability === "Billable"
  ).length;

  if (!project) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProject(project);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProject(project);
  };

  const handleSave = () => {
    if (editedProject && onSave) {
      onSave(editedProject);
      setIsEditing(false);
    }
  };

  const handleInputChange = (field: keyof Project, value: any) => {
    if (editedProject) {
      setEditedProject({ ...editedProject, [field]: value });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? "Edit Project" : "Project Details"}</span>
            {canEdit && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="ml-auto"
              >
                <Edit2 size={16} className="mr-2" />
                Edit
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Header */}
          <div className="pb-4 border-b">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={editedProject?.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="code">Project Code</Label>
                    <Input
                      id="code"
                      value={editedProject?.code || ""}
                      onChange={(e) =>
                        handleInputChange("code", e.target.value)
                      }
                      className="mt-1"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Project Type</Label>
                    <Input
                      id="type"
                      value={editedProject?.type || ""}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Briefcase size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{project.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {project.code} • {project.type}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Status and Health */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Status</Label>
              {isEditing ? (
                <Select
                  value={editedProject?.status || ""}
                  onValueChange={(val) => handleInputChange("status", val)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant={
                    project.status === "active" ? "default" : "secondary"
                  }
                  className="mt-1"
                >
                  {project.status.replace("-", " ")}
                </Badge>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Health</Label>
              {isEditing ? (
                <Select
                  value={editedProject?.health || ""}
                  onValueChange={(val) => handleInputChange("health", val)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant={
                    project.health === "green"
                      ? "default"
                      : project.health === "yellow"
                      ? "secondary"
                      : "destructive"
                  }
                  className="mt-1"
                >
                  {project.health || "N/A"}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium mb-2">Description</Label>
            {isEditing ? (
              <Textarea
                value={editedProject?.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Project description"
                rows={4}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {project.description || "No description available"}
              </p>
            )}
          </div>

          {/* Team and Resource Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Users size={16} />
                Team Size
              </Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editedProject?.teamSize || 0}
                  onChange={(e) =>
                    handleInputChange("teamSize", parseInt(e.target.value))
                  }
                />
              ) : (
                <p className="text-sm">{project.teamSize} members</p>
              )}
            </div>

            <div>
              <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Code2 size={16} />
                Project Code
              </Label>
              <p className="text-sm">{project.code}</p>
            </div>
          </div>

          {/* Project Metrics */}
          {!isEditing && projectAllocations.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Project Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <p className="text-xs text-muted-foreground mb-1">
                    Allocated Resources
                  </p>
                  <p className="text-lg font-semibold">
                    {projectAllocations.length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Allocation %
                  </p>
                  <p className="text-lg font-semibold">{totalAllocation}%</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <p className="text-xs text-muted-foreground mb-1">
                    Billable Resources
                  </p>
                  <p className="text-lg font-semibold">{billableCount}</p>
                </div>
              </div>
            </div>
          )}

          {/* Team Allocations */}
          {!isEditing && projectAllocations.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Team Allocations</h3>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Allocation %</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Billability</TableHead>
                      <TableHead>Period</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectAllocations.map((alloc) => {
                      const employee = employees.find(
                        (e) => e.id === alloc.emp_id
                      );
                      return (
                        <TableRow key={alloc.allocation_id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>
                                  {employee
                                    ? getInitials(employee.name)
                                    : "N/A"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">
                                {employee?.name || "Unknown"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {employee?.department || "N/A"}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {alloc.allocation_percentage}%
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={alloc.is_lead ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {alloc.is_lead ? "Lead" : "Team Member"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                alloc.billability === "Billable"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {alloc.billability}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {alloc.period}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={onClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
