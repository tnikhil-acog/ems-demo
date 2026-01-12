"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { AllocationBar } from "@/components/manager";
import { useData } from "@/hooks/use-data";
import { getInitials } from "@/lib/utils";
import { Search, Star, UserPlus, AlertCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface ResourceResult {
  id: string;
  name: string;
  designation: string;
  department: string;
  matchScore: number;
  currentAllocation: number;
  available: number;
  skills: Array<{ name: string; rating: number }>;
  currentProjects: string[];
  transferability: number;
}

export default function FindResourcesPage() {
  const { data, loading } = useData();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minAvailability, setMinAvailability] = useState([50]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([
    "junior",
    "mid",
    "senior",
    "lead",
  ]);
  const [department, setDepartment] = useState("all");
  const [sortBy, setSortBy] = useState("match");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<ResourceResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (loading || !data) {
    return (
      <DashboardLayout
        role="manager"
        title="Find Resources"
        currentPath="/manager/resources"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Get all unique skills from employees data
  const availableSkills = Array.from(
    new Set(
      data.employees
        .flatMap((emp: any) => emp.skills?.map((s: any) => s.technology) || [])
        .filter(Boolean)
    )
  ).slice(0, 10);

  // Calculate resource results from actual data
  const getResourceResults = (): ResourceResult[] => {
    if (!hasSearched) return [];

    const allocations = data.project_allocations || [];
    const projects = data.projects || [];

    return data.employees
      .map((emp: any) => {
        // Calculate allocation and availability
        const empAllocations = allocations.filter(
          (alloc: any) => alloc.emp_id === emp.id
        );
        const currentAllocation = empAllocations.reduce(
          (sum: number, alloc: any) => sum + alloc.allocation_percentage,
          0
        );
        const available = Math.max(0, 100 - currentAllocation);

        // Get employee skills
        const empSkills = emp.skills || [];

        // Calculate match score based on selected skills
        let matchScore = 0;
        if (selectedSkills.length > 0) {
          const matchedSkills = empSkills.filter((skill: any) =>
            selectedSkills.includes(skill.technology)
          );
          matchScore = Math.round(
            (matchedSkills.length / selectedSkills.length) * 100
          );
        } else {
          matchScore = 75; // Default score if no skills selected
        }

        // Get current projects
        const currentProjects = empAllocations.map((alloc: any) => {
          const project = projects.find((p: any) => p.id === alloc.project_id);
          return `${project?.name || "Unknown"} (${
            alloc.allocation_percentage
          }%)`;
        });

        return {
          id: emp.id,
          name: emp.name,
          designation: emp.designation,
          department: emp.department,
          matchScore,
          currentAllocation,
          available,
          skills: empSkills.map((s: any) => ({
            name: s.technology,
            rating: s.rating,
          })),
          currentProjects,
          transferability: 70, // Could be enhanced with actual data
        };
      })
      .filter((resource) => {
        // Apply filters
        // Availability filter
        if (resource.available < minAvailability[0]) return false;

        // Department filter
        if (
          department !== "all" &&
          resource.department.toLowerCase() !== department.toLowerCase()
        )
          return false;

        // Skills filter - employee must have at least one selected skill
        if (selectedSkills.length > 0) {
          const hasMatchingSkill = resource.skills.some((skill: any) =>
            selectedSkills.includes(skill.name)
          );
          if (!hasMatchingSkill) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "availability":
            return b.available - a.available;
          case "transferability":
            return b.transferability - a.transferability;
          case "match":
          default:
            return b.matchScore - a.matchScore;
        }
      });
  };

  const resourceResults = getResourceResults();

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleExperienceLevel = (level: string) => {
    setExperienceLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleSearch = () => {
    setHasSearched(true);
  };

  const handleAssign = (resource: ResourceResult) => {
    setSelectedResource(resource);
    setShowAssignModal(true);
  };

  const renderStars = (rating: number) => {
    return (
      <span className="text-yellow-500 text-sm">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </span>
    );
  };

  const getMatchScoreBadge = (score: number) => {
    if (score >= 90)
      return <Badge className="bg-green-500">⭐ Excellent</Badge>;
    if (score >= 75) return <Badge className="bg-blue-500">Good</Badge>;
    return <Badge variant="secondary">Fair</Badge>;
  };

  return (
    <DashboardLayout
      role="manager"
      title="Find Resources"
      currentPath="/manager/resources"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Search size={32} />
            Find & Assign Resources
          </h1>
          <p className="text-muted-foreground mt-1">
            Search for team members to assign to your projects
          </p>
        </div>

        {/* Search Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Search Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Skills */}
            <div>
              <Label className="mb-3 block">Skills Required</Label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={
                      selectedSkills.includes(skill) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                    {selectedSkills.includes(skill) && " ×"}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Availability Slider */}
            <div>
              <Label className="mb-3 block">
                Minimum Availability: ≥ {minAvailability[0]}%
              </Label>
              <Slider
                value={minAvailability}
                onValueChange={setMinAvailability}
                max={100}
                step={10}
                className="w-full"
              />
            </div>

            {/* Experience Level */}
            <div>
              <Label className="mb-3 block">Experience Level</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: "intern", label: "Intern" },
                  { value: "junior", label: "Junior" },
                  { value: "mid", label: "Mid" },
                  { value: "senior", label: "Senior" },
                  { value: "lead", label: "Lead" },
                ].map((level) => (
                  <div
                    key={level.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={level.value}
                      checked={experienceLevels.includes(level.value)}
                      onCheckedChange={() => toggleExperienceLevel(level.value)}
                    />
                    <label
                      htmlFor={level.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {level.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Department & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Location</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="gap-2">
                <Search size={16} />
                Search Resources
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSkills([]);
                  setMinAvailability([50]);
                  setExperienceLevels(["junior", "mid", "senior", "lead"]);
                  setDepartment("all");
                  setHasSearched(false);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  Search Results ({resourceResults.length} found)
                </CardTitle>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-45">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Match Score</SelectItem>
                    <SelectItem value="availability">Availability</SelectItem>
                    <SelectItem value="transferability">
                      Transferability
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {resourceResults.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle
                    className="mx-auto mb-4 text-muted-foreground opacity-50"
                    size={48}
                  />
                  <p className="text-muted-foreground">
                    No resources found matching your criteria. Try adjusting
                    your filters.
                  </p>
                </div>
              ) : (
                resourceResults.map((resource) => (
                  <Card key={resource.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar & Basic Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="font-bold text-lg">
                              {getInitials(resource.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="font-bold text-lg">
                                {resource.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {resource.designation} | {resource.department}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                Match Score:
                              </span>
                              <span className="text-lg font-bold text-primary">
                                {resource.matchScore}%
                              </span>
                              {getMatchScoreBadge(resource.matchScore)}
                            </div>
                          </div>
                        </div>

                        {/* Allocation & Availability */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">
                                Current Allocation
                              </span>
                              <span className="font-semibold">
                                {resource.currentAllocation}%
                              </span>
                            </div>
                            <AllocationBar
                              percentage={resource.currentAllocation}
                              showPercentage={false}
                              height="sm"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Available
                              </span>
                              <span
                                className={`font-bold ${
                                  resource.available >= 40
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {resource.available}%
                              </span>
                            </div>
                            {resource.available === 0 && (
                              <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                                <AlertCircle size={12} />
                                <span>Fully allocated</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-3">
                          {resource.skills.map((skill, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-sm">{skill.name}</span>
                              {renderStars(skill.rating)}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Current Projects & Transferability */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Current Projects:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {resource.currentProjects.join(", ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Transferability:
                          </p>
                          <div className="flex items-center gap-2">
                            <AllocationBar
                              percentage={resource.transferability}
                              showPercentage={true}
                              height="sm"
                              variant={
                                resource.transferability >= 75
                                  ? "success"
                                  : "warning"
                              }
                            />
                          </div>
                          {resource.transferability < 75 &&
                            resource.currentAllocation === 100 && (
                              <p className="text-xs text-yellow-600 mt-1">
                                ⚠️ Client approval required for transfer
                              </p>
                            )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex gap-2">
                        <Link href={`/manager/employee/${resource.id}`}>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </Link>
                        {resource.available > 0 ? (
                          <Button
                            size="sm"
                            onClick={() => handleAssign(resource)}
                            className="gap-2"
                          >
                            <UserPlus size={14} />
                            Assign to Project
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleAssign(resource)}
                            className="gap-2"
                          >
                            Request Transfer
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Assign Modal */}
        <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Assign {selectedResource?.name} to Project
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Select Project</Label>
                <Select defaultValue="C042">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="C042">
                      C042 - Analytics Dashboard
                    </SelectItem>
                    <SelectItem value="C055">C055 - Mobile App</SelectItem>
                    <SelectItem value="P010">P010 - Internal Tool</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Allocation Percentage: 60%</Label>
                <Slider
                  defaultValue={[60]}
                  max={100}
                  step={5}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  = 24% of workweek
                </p>
              </div>

              <div>
                <Label>Is Lead</Label>
                <Select defaultValue="no">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Dependency Level (1-5)</Label>
                <Select defaultValue="3">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Low</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3 - Medium</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5 - Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert("Resource assigned successfully!");
                  setShowAssignModal(false);
                }}
              >
                Assign to Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
