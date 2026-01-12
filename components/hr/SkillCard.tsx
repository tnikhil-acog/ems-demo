import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  ArrowUp,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

export interface SkillWithEmployees {
  skill: string;
  category?: string;
  employeeCount: number;
  avgRating: number;
  trend: "up-high" | "up" | "stable" | "down";
  employees?: Array<{
    id: string;
    name: string;
    rating: number;
  }>;
}

interface SkillCardProps {
  skill: SkillWithEmployees;
  rank: number;
  expandable?: boolean;
}

export function SkillCard({ skill, rank, expandable = false }: SkillCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTrendIcon = () => {
    switch (skill.trend) {
      case "up-high":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 gap-1">
            <TrendingUp size={12} />
            High Demand
          </Badge>
        );
      case "up":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 gap-1">
            <ArrowUp size={12} />
            Growing
          </Badge>
        );
      case "stable":
        return (
          <Badge variant="secondary" className="gap-1">
            <ArrowRight size={12} />
            Stable
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <span className="text-yellow-500 text-sm">
        {"★".repeat(Math.floor(rating))}
        {"☆".repeat(5 - Math.floor(rating))}
      </span>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                {rank}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{skill.skill}</h4>
                {skill.category && (
                  <p className="text-xs text-muted-foreground">
                    {skill.category}
                  </p>
                )}
              </div>
            </div>
            {getTrendIcon()}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Employees</p>
              <p className="font-bold text-lg">{skill.employeeCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Avg Rating</p>
              <div className="flex items-center gap-1">
                {renderStars(skill.avgRating)}
                <span className="text-xs font-semibold ml-1">
                  ({skill.avgRating.toFixed(1)})
                </span>
              </div>
            </div>
          </div>

          {expandable && skill.employees && skill.employees.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-2"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Hide" : "Show"} Employees
                {isExpanded ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </Button>

              {isExpanded && (
                <div className="border-t pt-3 space-y-2 max-h-48 overflow-y-auto">
                  {skill.employees.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between text-sm p-2 hover:bg-muted rounded"
                    >
                      <span>{emp.name}</span>
                      {renderStars(emp.rating)}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface TopSkillsListProps {
  skills: SkillWithEmployees[];
  maxDisplay?: number;
  expandable?: boolean;
}

export function TopSkillsList({
  skills,
  maxDisplay = 5,
  expandable = false,
}: TopSkillsListProps) {
  const displaySkills = maxDisplay ? skills.slice(0, maxDisplay) : skills;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displaySkills.map((skill, index) => (
        <SkillCard
          key={skill.skill}
          skill={skill}
          rank={index + 1}
          expandable={expandable}
        />
      ))}
    </div>
  );
}
