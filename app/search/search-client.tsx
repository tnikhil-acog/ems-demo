"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData, Employee } from "@/hooks/use-data";
import { EmployeeDetailModal } from "@/components/modals";
import { getInitials } from "@/lib/utils";
import LoadingState from "@/components/ui/loading";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";

function SearchContent() {
  const { data, loading } = useData();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentRole, setCurrentRole] = useState<"employee" | "manager" | "hr">(
    "employee"
  );
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        title="Search Colleagues"
        currentPath="/search"
        breadcrumbs={[{ label: "Search Colleagues" }]}
      >
        <LoadingState message="Loading search..." />
      </DashboardLayout>
    );
  }

  const filteredEmployees = data.employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      role={currentRole}
      title="Search Colleagues"
      currentPath="/search"
      breadcrumbs={[{ label: "Search Colleagues" }]}
    >
      <div className="space-y-6">
        {/* Search Box */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by name, designation, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <SearchIcon size={20} />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEmployees.map((employee) => (
            <Card
              key={employee.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                    {getInitials(employee.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {employee.name}
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {employee.designation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {employee.department}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Email:</span>{" "}
                    {employee.email}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Phone:</span>{" "}
                    {employee.phone}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setIsModalOpen(true);
                  }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No colleagues found matching your search.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Employee Detail Modal */}
        <EmployeeDetailModal
          employee={selectedEmployee}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEmployee(null);
          }}
          canEdit={false}
        />
      </div>
    </DashboardLayout>
  );
}

export function SearchClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
