import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
  subtitle?: string;
}

export function QuickStats({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  subtitle,
}: StatCardProps) {
  const getVariantClass = () => {
    if (variant === "success") return "text-green-600";
    if (variant === "warning") return "text-yellow-600";
    if (variant === "danger") return "text-red-600";
    return "text-primary";
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-2">
          {Icon && (
            <div className="flex justify-center mb-2">
              <Icon className={`h-5 w-5 ${getVariantClass()}`} />
            </div>
          )}
          <div className={`text-3xl font-bold ${getVariantClass()}`}>
            {value}
          </div>
          <p className="text-sm text-muted-foreground">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
