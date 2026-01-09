"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/hooks/use-data";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function ReportsContent() {
  const { data, loading } = useData();
  const searchParams = useSearchParams();
  const [currentRole, setCurrentRole] = useState<"employee" | "manager" | "hr">(
    "employee"
  );

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
        title="Weekly Reports"
        currentPath="/reports"
        breadcrumbs={[{ label: "Weekly Reports" }]}
      >
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  const userReports = data.reports.filter((r) => r.employeeId === "EMP001");

  return (
    <DashboardLayout
      role={currentRole}
      title="Weekly Reports"
      currentPath="/reports"
      breadcrumbs={[{ label: "Weekly Reports" }]}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About Weekly Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Submit a consolidated report covering your work across{" "}
              <strong>all projects</strong> each week. Your report should
              include progress, achievements, challenges, and plans across all
              your active assignments.
            </p>
          </CardContent>
        </Card>

        {userReports.length > 0 ? (
          userReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Week of {report.week}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Consolidated report covering all projects
                    </p>
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
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {report.summary}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">No reports submitted yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportsContent />
    </Suspense>
  );
}
