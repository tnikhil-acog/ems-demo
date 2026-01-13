import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getProgressColor, getUtilizationColor } from "@/lib/utils";

export interface DepartmentStats {
  department: string;
  employeeCount: number;
  utilization: number;
  onBench: number;
  trend?: "up" | "down" | "stable";
  avgExperience?: number;
}

interface DepartmentCardProps {
  department: DepartmentStats;
  onClick?: (department: DepartmentStats) => void;
}

export function DepartmentCard({ department, onClick }: DepartmentCardProps) {
  const getTrendIcon = () => {
    switch (department.trend) {
      case "up":
        return <TrendingUp size={14} className="text-green-600" />;
      case "down":
        return <TrendingDown size={14} className="text-red-600" />;
      default:
        return <Minus size={14} className="text-gray-600" />;
    }
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(department)}
    >
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-lg">{department.department}</h4>
              <p className="text-sm text-muted-foreground">
                {department.employeeCount} employees
              </p>
            </div>
            {department.trend && getTrendIcon()}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Utilization</span>
              <span
                className={`text-lg font-bold ${getUtilizationColor(
                  department.utilization
                )}`}
              >
                {department.utilization}%
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getProgressColor(
                    department.utilization
                  )}`}
                  style={{ width: `${department.utilization}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm pt-2 border-t">
            <span className="text-muted-foreground">On Bench</span>
            <Badge
              variant={department.onBench > 3 ? "destructive" : "secondary"}
            >
              {department.onBench}{" "}
              {department.onBench === 1 ? "person" : "people"}
            </Badge>
          </div>

          {department.avgExperience && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg Experience</span>
              <span className="font-semibold">
                {department.avgExperience.toFixed(1)} years
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DepartmentAnalyticsProps {
  departments: DepartmentStats[];
  onDepartmentClick?: (department: DepartmentStats) => void;
}

export function DepartmentAnalytics({
  departments,
  onDepartmentClick,
}: DepartmentAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((dept) => (
        <DepartmentCard
          key={dept.department}
          department={dept}
          onClick={onDepartmentClick}
        />
      ))}
    </div>
  );
}

interface DepartmentSummaryProps {
  departments: DepartmentStats[];
  variant?: "horizontal" | "vertical";
}

export function DepartmentSummary({
  departments,
  variant = "vertical",
}: DepartmentSummaryProps) {
  if (variant === "horizontal") {
    return (
      <div className="space-y-3">
        {departments.map((dept) => (
          <div key={dept.department} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{dept.department}</span>
              <span className="text-muted-foreground">
                {dept.employeeCount} employees | {dept.utilization}% utilized |{" "}
                {dept.onBench} bench
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  dept.utilization >= 90
                    ? "bg-green-500"
                    : dept.utilization >= 70
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                }`}
                style={{ width: `${dept.utilization}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((dept) => (
        <DepartmentCard key={dept.department} department={dept} />
      ))}
    </div>
  );
}
