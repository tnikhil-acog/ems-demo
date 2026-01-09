import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: "up" | "down"
  trendValue?: string
}

export function StatCard({ title, value, icon, trend, trendValue }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && trendValue && (
              <p className={`text-xs mt-2 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {trend === "up" ? "↑" : "↓"} {trendValue}
              </p>
            )}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
