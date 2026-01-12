interface AllocationBarProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  variant?: "default" | "danger" | "warning" | "success";
  height?: "sm" | "md" | "lg";
}

export function AllocationBar({
  percentage,
  label,
  showPercentage = true,
  variant = "default",
  height = "md",
}: AllocationBarProps) {
  const getColorClass = () => {
    if (variant === "danger") return "bg-red-500";
    if (variant === "warning") return "bg-yellow-500";
    if (variant === "success") return "bg-green-500";

    // Auto-detect based on percentage
    if (percentage >= 95) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-primary";
  };

  const getHeightClass = () => {
    if (height === "sm") return "h-1.5";
    if (height === "lg") return "h-3";
    return "h-2";
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {label && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {label}
        </span>
      )}
      <div className="flex-1 flex items-center gap-2">
        <div className={`flex-1 bg-muted rounded-full ${getHeightClass()}`}>
          <div
            className={`${getHeightClass()} rounded-full transition-all ${getColorClass()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {showPercentage && (
          <span className="text-xs font-semibold whitespace-nowrap min-w-[3ch]">
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
}
