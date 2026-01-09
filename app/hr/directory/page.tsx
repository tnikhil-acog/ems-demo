"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/hooks/use-data";
import {
  Users,
  UserPlus,
  Download,
  Upload,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  LogOut as LogOutIcon,
  MoreVertical,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  status: string;
  location?: string;
  employmentType?: string;
  joinDate: string;
  reportingTo?: string;
}

type SortField = "name" | "department" | "designation" | "joinDate" | "status";
type SortDirection = "asc" | "desc";

export default function EmployeeDirectory() {
  const { data, loading } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  if (loading || !data) {
    return (
      <DashboardLayout
        role="hr"
        title="Employee Directory"
        currentPath="/hr/directory"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading employees...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const employees: Employee[] = data.employees || [];

  // Get unique values for filters
  const departments = Array.from(new Set(employees.map((e) => e.department)));
  const locations = Array.from(
    new Set(employees.map((e) => e.location).filter(Boolean))
  );
  const employmentTypes = Array.from(
    new Set(employees.map((e) => e.employmentType).filter(Boolean))
  );
  const statuses = Array.from(new Set(employees.map((e) => e.status)));

  // Filtering and sorting
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter((emp) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        emp.name.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.id.toLowerCase().includes(searchLower);

      // Department filter
      const matchesDepartment =
        departmentFilter === "all" || emp.department === departmentFilter;

      // Status filter
      const matchesStatus =
        statusFilter === "all" || emp.status === statusFilter;

      // Location filter
      const matchesLocation =
        locationFilter === "all" || emp.location === locationFilter;

      // Employment type filter
      const matchesEmploymentType =
        employmentTypeFilter === "all" ||
        emp.employmentType === employmentTypeFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesLocation &&
        matchesEmploymentType
      );
    });

    // Sorting
    filtered.sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      switch (sortField) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "department":
          aVal = a.department.toLowerCase();
          bVal = b.department.toLowerCase();
          break;
        case "designation":
          aVal = a.designation.toLowerCase();
          bVal = b.designation.toLowerCase();
          break;
        case "joinDate":
          aVal = new Date(a.joinDate).getTime();
          bVal = new Date(b.joinDate).getTime();
          break;
        case "status":
          aVal = a.status.toLowerCase();
          bVal = b.status.toLowerCase();
          break;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    employees,
    searchQuery,
    departmentFilter,
    statusFilter,
    locationFilter,
    employmentTypeFilter,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / pageSize);
  const paginatedEmployees = filteredAndSortedEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.size === paginatedEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(paginatedEmployees.map((e) => e.id)));
    }
  };

  const handleSelectEmployee = (id: string) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEmployees(newSelected);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "exit-initiated":
        return "destructive";
      case "exited":
        return "secondary";
      default:
        return "outline";
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="inline ml-1" size={14} />
    ) : (
      <ChevronDown className="inline ml-1" size={14} />
    );
  };

  return (
    <DashboardLayout
      role="hr"
      title="Employee Directory"
      currentPath="/hr/directory"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employee Directory</h1>
          <p className="text-muted-foreground mt-1">
            {filteredAndSortedEmployees.length} employee
            {filteredAndSortedEmployees.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload size={16} className="mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
          <Button size="sm">
            <UserPlus size={16} className="mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter size={18} />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Department Filter */}
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Department" />
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

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc!}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(searchQuery ||
            departmentFilter !== "all" ||
            statusFilter !== "all" ||
            locationFilter !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery("")}
                >
                  Search: {searchQuery} ×
                </Badge>
              )}
              {departmentFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setDepartmentFilter("all")}
                >
                  Dept: {departmentFilter} ×
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setStatusFilter("all")}
                >
                  Status: {statusFilter} ×
                </Badge>
              )}
              {locationFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setLocationFilter("all")}
                >
                  Location: {locationFilter} ×
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedEmployees.size > 0 && (
        <Card className="mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {selectedEmployees.size} employee
                {selectedEmployees.size !== 1 ? "s" : ""} selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download size={14} className="mr-2" />
                  Export Selected
                </Button>
                <Button variant="outline" size="sm">
                  Send Notification
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEmployees(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-4 w-12">
                    <Checkbox
                      checked={
                        selectedEmployees.size === paginatedEmployees.length &&
                        paginatedEmployees.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    <button
                      onClick={() => handleSort("name")}
                      className="hover:text-primary flex items-center"
                    >
                      Employee ID
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    <button
                      onClick={() => handleSort("name")}
                      className="hover:text-primary flex items-center"
                    >
                      Name <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    <button
                      onClick={() => handleSort("designation")}
                      className="hover:text-primary flex items-center"
                    >
                      Designation <SortIcon field="designation" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    <button
                      onClick={() => handleSort("department")}
                      className="hover:text-primary flex items-center"
                    >
                      Department <SortIcon field="department" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    <button
                      onClick={() => handleSort("status")}
                      className="hover:text-primary flex items-center"
                    >
                      Status <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    Location
                  </th>
                  <th className="text-left p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <Users size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No employees found matching your filters.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={selectedEmployees.has(emp.id)}
                          onCheckedChange={() => handleSelectEmployee(emp.id)}
                        />
                      </td>
                      <td className="p-4 text-sm font-mono text-muted-foreground">
                        {emp.id}
                      </td>
                      <td className="p-4">
                        <button className="text-sm font-medium hover:text-primary hover:underline text-left">
                          {emp.name}
                        </button>
                        <p className="text-xs text-muted-foreground">
                          {emp.email}
                        </p>
                      </td>
                      <td className="p-4 text-sm">{emp.designation}</td>
                      <td className="p-4 text-sm">{emp.department}</td>
                      <td className="p-4">
                        <Badge variant={getStatusBadgeVariant(emp.status)}>
                          {emp.status.replace("-", " ")}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{emp.location || "-"}</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye size={14} className="mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit size={14} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <LogOutIcon size={14} className="mr-2" />
                              Initiate Exit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page:
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(val) => {
                    setPageSize(parseInt(val));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
