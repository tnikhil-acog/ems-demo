"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamMemberRow, TeamMember } from "@/components/manager";
import { useData } from "@/hooks/use-data";
import { Users, Search, Download } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MyTeamPage() {
  const { data, loading } = useData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  if (loading || !data) {
    return (
      <DashboardLayout
        role="manager"
        title="My Team"
        currentPath="/manager/team"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading team members...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Team members from employees data with actual allocation data
  const allocations = data.project_allocations || [];
  const allTeamMembers: TeamMember[] = data.employees
    .slice(0, 12)
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

  // Apply filters
  let filteredMembers = allTeamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && member.available >= 40) ||
      (statusFilter === "busy" && member.available < 40);
    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  filteredMembers = filteredMembers.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "allocation":
        return b.allocation - a.allocation;
      case "available":
        return b.available - a.available;
      default:
        return 0;
    }
  });

  const handleViewProfile = (member: TeamMember) => {
    router.push(`/manager/employee/${member.id}`);
  };

  const handleAssign = (member: TeamMember) => {
    // This would open a modal in a real implementation
    alert(`Assign ${member.name} to a project (modal would open here)`);
  };

  const handleViewProjects = (member: TeamMember) => {
    alert(`View projects for ${member.name} (would navigate to projects view)`);
  };

  const handleViewReports = (member: TeamMember) => {
    alert(`View weekly reports for ${member.name}`);
  };

  return (
    <DashboardLayout role="manager" title="My Team" currentPath="/manager/team">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users size={32} />
              My Team
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredMembers.length} team member
              {filteredMembers.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export Team
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search by name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available (≥40%)</SelectItem>
                  <SelectItem value="busy">Busy (&lt;40%)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="allocation">Allocation</SelectItem>
                  <SelectItem value="available">Availability</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Team Table */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
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
                      Designation
                    </th>
                    <th className="text-left py-3 font-semibold text-sm">
                      Allocation
                    </th>
                    <th className="text-center py-3 font-semibold text-sm">
                      Available
                    </th>
                    <th className="text-center py-3 font-semibold text-sm">
                      Projects
                    </th>
                    <th className="text-left py-3 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <TeamMemberRow
                      key={member.id}
                      member={member}
                      variant="table"
                      onViewProfile={handleViewProfile}
                      onAssign={handleAssign}
                      onViewProjects={handleViewProjects}
                      onViewReports={handleViewReports}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users size={48} className="mx-auto mb-4 opacity-20" />
                <p>No team members found matching your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
