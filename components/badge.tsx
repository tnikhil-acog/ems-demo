interface BadgeProps {
  label: string
  variant?: "default" | "success" | "warning" | "danger" | "info"
}

export function Badge({ label, variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  }

  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${variants[variant]}`}>{label}</span>
}
