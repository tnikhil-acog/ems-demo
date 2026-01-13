import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import { calculateDaysUntil } from "@/lib/utils";

export interface ExitEmployee {
  id: string;
  name: string;
  designation?: string;
  department?: string;
  exitDate?: string;
  exitInitiatedDate?: string;
  currentProjects?: string[];
  exitReason?: string;
}

interface ExitCardProps {
  employee: ExitEmployee;
  onViewProfile?: (employee: ExitEmployee) => void;
  onViewProjects?: (employee: ExitEmployee) => void;
}

export function ExitCard({
  employee,
  onViewProfile,
  onViewProjects,
}: ExitCardProps) {
  const daysUntilExit = employee.exitDate
    ? calculateDaysUntil(employee.exitDate)
    : null;

  const getUrgencyBadge = () => {
    if (!daysUntilExit) return null;
    if (daysUntilExit <= 7)
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle size={12} />
          Urgent: {daysUntilExit} days
        </Badge>
      );
    if (daysUntilExit <= 14)
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600 gap-1">
          <Calendar size={12} />
          {daysUntilExit} days
        </Badge>
      );
    return (
      <Badge variant="secondary" className="gap-1">
        <Calendar size={12} />
        {daysUntilExit} days
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold">{employee.name}</h4>
          {employee.designation && (
            <p className="text-sm text-muted-foreground">
              {employee.designation}
            </p>
          )}
          {employee.department && (
            <p className="text-xs text-muted-foreground">
              {employee.department}
            </p>
          )}
        </div>
        {getUrgencyBadge()}
      </div>

      <div className="space-y-2 text-sm">
        {employee.exitDate && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Last Working Day:</span>
            <span className="font-medium">
              {new Date(employee.exitDate).toLocaleDateString()}
            </span>
          </div>
        )}
        {employee.exitInitiatedDate && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Exit Initiated:</span>
            <span className="text-xs">
              {new Date(employee.exitInitiatedDate).toLocaleDateString()}
            </span>
          </div>
        )}
        {employee.currentProjects && employee.currentProjects.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">
              Current Projects:
            </p>
            <div className="flex flex-wrap gap-1">
              {employee.currentProjects.map((project, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {project}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Link href={`/hr/employee/${employee.id}`} className="flex-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => onViewProfile?.(employee)}
          >
            View Profile
          </Button>
        </Link>
        {employee.currentProjects && employee.currentProjects.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onViewProjects?.(employee)}
          >
            View Projects
          </Button>
        )}
      </div>
    </div>
  );
}

interface ExitListProps {
  employees: ExitEmployee[];
  maxDisplay?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export function ExitList({
  employees,
  maxDisplay = 3,
  showViewAll = true,
  onViewAll,
}: ExitListProps) {
  const displayEmployees = employees.slice(0, maxDisplay);
  const hasMore = employees.length > maxDisplay;

  if (employees.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar size={48} className="mx-auto mb-3 opacity-20" />
        <p className="font-medium">No active exits</p>
        <p className="text-sm mt-1">All employees are active</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayEmployees.map((employee) => (
        <ExitCard key={employee.id} employee={employee} />
      ))}
      {showViewAll && hasMore && (
        <Link href="/hr/exits">
          <Button variant="outline" className="w-full" onClick={onViewAll}>
            View All {employees.length} Exits
          </Button>
        </Link>
      )}
    </div>
  );
}
