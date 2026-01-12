import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AllocationBar } from "./AllocationBar";
import { Calendar, Users, AlertCircle } from "lucide-react";
import Link from "next/link";

export interface ProjectCardProps {
  id: string;
  name: string;
  client?: string;
  type: string;
  status: "healthy" | "at-risk" | "blocked";
  teamSize: number;
  avgAllocation: number;
  timeline?: {
    start: string;
    end: string;
    daysLeft?: number;
  };
  sentiment?: "positive" | "neutral" | "negative";
  blockers?: number;
  href?: string;
}

export function ProjectCard({
  id,
  name,
  client,
  type,
  status,
  teamSize,
  avgAllocation,
  timeline,
  sentiment,
  blockers,
  href = `/manager/projects/${id}`,
}: ProjectCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "healthy":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">✓ Healthy</Badge>
        );
      case "at-risk":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            ⚠️ At Risk
          </Badge>
        );
      case "blocked":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">🛑 Blocked</Badge>
        );
    }
  };

  const getSentimentEmoji = () => {
    if (sentiment === "positive") return "😊";
    if (sentiment === "neutral") return "😐";
    if (sentiment === "negative") return "😟";
    return null;
  };

  const getPriorityLabel = (type: string) => {
    const priorities: Record<string, number> = {
      B: 1,
      C: 1,
      M: 2,
      O: 3,
      P: 4,
      R: 5,
      S: 6,
      U: 7,
      E: 8,
    };
    const priority = priorities[type] || 9;
    return `${type} (P${priority})`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="font-bold text-lg mb-1">
            {id} - {name}
          </h3>
          {client && (
            <p className="text-sm text-muted-foreground">Client: {client}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{getPriorityLabel(type)}</Badge>
            {getStatusBadge()}
          </div>
        </div>

        {/* Team Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Users size={14} />
              Team Size
            </span>
            <span className="font-semibold">{teamSize} members</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg Allocation</span>
              <span className="font-semibold">{avgAllocation}%</span>
            </div>
            <AllocationBar
              percentage={avgAllocation}
              showPercentage={false}
              height="sm"
            />
          </div>
        </div>

        {/* Timeline */}
        {timeline && (
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={14} />
              <span>
                Timeline: {timeline.start} - {timeline.end}
              </span>
            </div>
            {timeline.daysLeft !== undefined && (
              <p className="text-xs text-muted-foreground pl-5">
                {timeline.daysLeft} days remaining
              </p>
            )}
          </div>
        )}

        {/* Status Indicators */}
        <div className="flex items-center justify-between text-sm pt-2 border-t">
          {blockers !== undefined && blockers > 0 && (
            <div className="flex items-center gap-1 text-red-600">
              <AlertCircle size={14} />
              <span className="text-xs font-semibold">{blockers} blockers</span>
            </div>
          )}
          {sentiment && (
            <div className="flex items-center gap-1">
              <span className="text-lg">{getSentimentEmoji()}</span>
              <span className="text-xs text-muted-foreground capitalize">
                {sentiment}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Link href={href}>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <Link href={`${href}?tab=team`}>
            <Button variant="outline" size="sm" className="w-full">
              Manage Team
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
