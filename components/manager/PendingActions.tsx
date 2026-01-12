import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, FileText, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TransferRequest {
  id: string;
  employeeName: string;
  requester: string;
  projectId: string;
  projectName: string;
}

interface PendingReport {
  employeeName: string;
  dueDate: string;
}

interface PendingActionsProps {
  transferRequests?: TransferRequest[];
  pendingReports?: PendingReport[];
  otherAlerts?: Array<{
    id: string;
    title: string;
    description: string;
    variant?: "default" | "warning" | "danger";
  }>;
}

export function PendingActions({
  transferRequests = [],
  pendingReports = [],
  otherAlerts = [],
}: PendingActionsProps) {
  const hasActions =
    transferRequests.length > 0 ||
    pendingReports.length > 0 ||
    otherAlerts.length > 0;

  if (!hasActions) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell size={20} />
          Pending Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Transfer Requests */}
        {transferRequests.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="text-blue-600" />
                {transferRequests.length} Transfer Request
                {transferRequests.length > 1 ? "s" : ""} Pending
              </h4>
              <Link href="/manager/requests">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight size={14} className="ml-1" />
                </Button>
              </Link>
            </div>
            {transferRequests.slice(0, 3).map((request) => (
              <div
                key={request.id}
                className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <p className="text-sm font-medium">
                  {request.requester} wants {request.employeeName} for Project{" "}
                  {request.projectId}
                </p>
                <Link href={`/manager/requests?id=${request.id}`}>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-xs mt-1"
                  >
                    Review Request
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pending Reports */}
        {pendingReports.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText size={16} className="text-orange-600" />
                {pendingReports.length} Weekly Report
                {pendingReports.length > 1 ? "s" : ""} Pending
              </h4>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm">
                <span className="font-medium">
                  {pendingReports
                    .slice(0, 3)
                    .map((r) => r.employeeName)
                    .join(", ")}
                </span>
                {pendingReports.length > 3 &&
                  ` and ${pendingReports.length - 3} more`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Due {pendingReports[0]?.dueDate || "today"}
              </p>
            </div>
          </div>
        )}

        {/* Other Alerts */}
        {otherAlerts.length > 0 && (
          <div className="space-y-2">
            {otherAlerts.map((alert) => {
              const bgClass =
                alert.variant === "danger"
                  ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                  : alert.variant === "warning"
                  ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
                  : "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800";

              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${bgClass}`}
                >
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
