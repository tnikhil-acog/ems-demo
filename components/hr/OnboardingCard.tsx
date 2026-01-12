import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";

export interface OnboardingEmployee {
  id: string;
  name: string;
  designation?: string;
  joinDate: string;
  onboardingProgress: number;
}

interface OnboardingCardProps {
  employee: OnboardingEmployee;
  onSendReminder?: (employee: OnboardingEmployee) => void;
  onViewProfile?: (employee: OnboardingEmployee) => void;
}

export function OnboardingCard({
  employee,
  onSendReminder,
  onViewProfile,
}: OnboardingCardProps) {
  const daysSinceJoin = Math.floor(
    (new Date().getTime() - new Date(employee.joinDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const isOverdue = daysSinceJoin > 14;

  const getProgressColor = () => {
    if (employee.onboardingProgress === 100) return "bg-green-500";
    if (employee.onboardingProgress >= 75) return "bg-blue-500";
    if (employee.onboardingProgress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">{employee.name}</h4>
          {employee.designation && (
            <p className="text-sm text-muted-foreground">
              {employee.designation}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Joined: {new Date(employee.joinDate).toLocaleDateString()}
          </p>
        </div>
        {isOverdue && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle size={12} />
            Overdue
          </Badge>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium">Profile Completion</span>
          <span className="text-xs font-bold">
            {employee.onboardingProgress}%
          </span>
        </div>
        <div className="bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${employee.onboardingProgress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{daysSinceJoin} days since joining</span>
        {employee.onboardingProgress === 100 && (
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle size={12} />
            Complete
          </span>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onSendReminder?.(employee)}
        >
          Send Reminder
        </Button>
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
      </div>
    </div>
  );
}

interface OnboardingListProps {
  employees: OnboardingEmployee[];
  maxDisplay?: number;
  onSendReminder?: (employee: OnboardingEmployee) => void;
  onViewProfile?: (employee: OnboardingEmployee) => void;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export function OnboardingList({
  employees,
  maxDisplay = 3,
  onSendReminder,
  onViewProfile,
  showViewAll = true,
  onViewAll,
}: OnboardingListProps) {
  const displayEmployees = employees.slice(0, maxDisplay);
  const hasMore = employees.length > maxDisplay;

  if (employees.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
        <p className="font-medium">All employees completed onboarding!</p>
        <p className="text-sm mt-1">No pending profile completions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayEmployees.map((employee) => (
        <OnboardingCard
          key={employee.id}
          employee={employee}
          onSendReminder={onSendReminder}
          onViewProfile={onViewProfile}
        />
      ))}
      {showViewAll && hasMore && (
        <Link href="/hr/onboarding">
          <Button variant="outline" className="w-full" onClick={onViewAll}>
            View All {employees.length} Employees
          </Button>
        </Link>
      )}
    </div>
  );
}
