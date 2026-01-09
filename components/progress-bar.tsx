interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showLabel?: boolean
  color?: "primary" | "success" | "warning" | "danger"
}

export function ProgressBar({ value, max = 100, label, showLabel = false, color = "primary" }: ProgressBarProps) {
  const percentage = (value / max) * 100

  const colorClasses = {
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  }

  return (
    <div className="space-y-1">
      {label && showLabel && (
        <div className="flex justify-between text-xs font-semibold">
          <span>{label}</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`${colorClasses[color]} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}
