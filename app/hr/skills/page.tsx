"use client";

import React, { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useData, Employee } from "@/hooks/use-data";
import LoadingState from "@/components/ui/loading";
import {
  getUniqueDepartments,
  calculateSkillStatistics,
  type SkillData,
} from "@/lib/utils";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SkillsInventory() {
  const { data, loading } = useData();
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [minEmployees, setMinEmployees] = useState("0");
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("count-desc");

  const employees: Employee[] = data?.employees || [];
  const departments = getUniqueDepartments(employees);

  // Generate skills from employees using shared utility
  const organizationSkills: SkillData[] = useMemo(
    () => calculateSkillStatistics(employees),
    [employees]
  );

  // Filter and sort skills
  const filteredSkills = useMemo(() => {
    let filtered = organizationSkills.filter((skill) => {
      const meetsMinEmployees = skill.count >= parseInt(minEmployees);

      if (departmentFilter === "all") return meetsMinEmployees;

      // Filter by department: check if any employee with this skill is in the department
      const employeesWithSkill = employees.filter((emp: any) =>
        emp.skills?.some((s: any) => s.technology === skill.name)
      );
      const hasDeptEmployee = employeesWithSkill.some(
        (emp: any) => emp.department === departmentFilter
      );

      return meetsMinEmployees && hasDeptEmployee;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "count-desc":
          return b.count - a.count;
        case "count-asc":
          return a.count - b.count;
        case "rating-desc":
          return b.avgRating - a.avgRating;
        case "rating-asc":
          return a.avgRating - b.avgRating;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [organizationSkills, departmentFilter, minEmployees, sortBy, employees]);

  // Early return after all hooks
  if (loading || !data) {
    return (
      <DashboardLayout
        role="hr"
        title="Skills Inventory"
        currentPath="/hr/skills"
      >
        <LoadingState message="Loading skills data..." />
      </DashboardLayout>
    );
  }

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

  const getTrendIcon = (trend: string) => {
    if (trend === "up-high" || trend === "up") {
      return <TrendingUp size={16} className="text-green-600" />;
    } else if (trend === "down") {
      return <TrendingDown size={16} className="text-red-600" />;
    }
    return <Minus size={16} className="text-gray-500" />;
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case "up-high":
        return "High Demand";
      case "up":
        return "Growing";
      case "stable":
        return "Stable";
      case "down":
        return "Declining";
      default:
        return trend;
    }
  };

  const getEmployeesForSkill = (skillName: string) => {
    return employees.filter((emp: any) =>
      emp.skills?.some((s: any) => s.technology === skillName)
    );
  };

  return (
    <DashboardLayout
      role="hr"
      title="Skills Inventory"
      currentPath="/hr/skills"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Skills Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Organization-wide skills overview and distribution
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download size={16} className="mr-2" />
          Export Skills Data
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {organizationSkills.length}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Skills
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Across organization
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {organizationSkills.reduce((sum, s) => sum + s.count, 0)}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Skill Instances
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Sum of all skills
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {(
                  organizationSkills.reduce((sum, s) => sum + s.avgRating, 0) /
                  organizationSkills.length
                ).toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Average Rating
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Across all skills
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {organizationSkills.filter((s) => s.trend === "up").length}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Trending Up
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                High demand skills
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
                  {departments.map((dept: string) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Minimum Employees
              </label>
              <Select value={minEmployees} onValueChange={setMinEmployees}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
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
                  <SelectItem value="count-desc">
                    Employee Count (High to Low)
                  </SelectItem>
                  <SelectItem value="count-asc">
                    Employee Count (Low to High)
                  </SelectItem>
                  <SelectItem value="rating-desc">
                    Average Rating (High to Low)
                  </SelectItem>
                  <SelectItem value="rating-asc">
                    Average Rating (Low to High)
                  </SelectItem>
                  <SelectItem value="name-asc">Skill Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Skill Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Rank</th>
                  <th className="text-left p-4 font-medium text-sm">
                    Skill Name
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    Employees
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    Avg Rating
                  </th>
                  <th className="text-left p-4 font-medium text-sm">Trend</th>
                  <th className="text-left p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSkills.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <Star size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No skills found matching your filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredSkills.map((skill, index) => {
                    const isExpanded = expandedSkill === skill.name;
                    const employeesWithSkill = getEmployeesForSkill(skill.name);

                    return (
                      <React.Fragment key={skill.name}>
                        <tr className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-4 text-sm font-bold text-muted-foreground">
                            #{index + 1}
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-medium">
                              {skill.name}
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary">
                              {skill.count} employees
                            </Badge>
                          </td>
                          <td className="p-4 text-sm">
                            {renderStars(skill.avgRating)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getTrendIcon(skill.trend)}
                              <span className="text-xs">
                                {getTrendLabel(skill.trend)}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setExpandedSkill(isExpanded ? null : skill.name)
                              }
                            >
                              {isExpanded ? (
                                <ChevronUp size={16} className="mr-1" />
                              ) : (
                                <ChevronDown size={16} className="mr-1" />
                              )}
                              {isExpanded ? "Hide" : "Show"} Details
                            </Button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="bg-muted/20 p-4">
                              <div>
                                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                                  <Users size={16} />
                                  Employees with {skill.name} (
                                  {employeesWithSkill.length})
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {employeesWithSkill.map((emp: any) => {
                                    const empSkill = emp.skills?.find(
                                      (s: any) => s.technology === skill.name
                                    );
                                    return (
                                      <div
                                        key={emp.id}
                                        className="border rounded-lg p-3 bg-card"
                                      >
                                        <p className="font-medium text-sm">
                                          {emp.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {emp.designation} • {emp.department}
                                        </p>
                                        {empSkill && (
                                          <p className="text-xs mt-1">
                                            {renderStars(empSkill.rating)}
                                          </p>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Footer */}
      {filteredSkills.length > 0 && (
        <Card className="mt-6 bg-muted/30">
          <CardContent className="py-4">
            <p className="text-sm text-center text-muted-foreground">
              Showing {filteredSkills.length} skill
              {filteredSkills.length !== 1 ? "s" : ""} • Total skill instances:{" "}
              {filteredSkills.reduce((sum, s) => sum + s.count, 0)}
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
