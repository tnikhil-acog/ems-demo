import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AllocationBar } from "./AllocationBar";
import {
  MoreVertical,
  User,
  Briefcase,
  FileText,
  UserPlus,
} from "lucide-react";
import { getInitials } from "@/lib/utils";

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  department?: string;
  allocation: number;
  available: number;
  projectCount: number;
  email?: string;
}

interface TeamMemberRowProps {
  member: TeamMember;
  variant?: "table" | "card";
  onAssign?: (member: TeamMember) => void;
  onViewProfile?: (member: TeamMember) => void;
  onViewProjects?: (member: TeamMember) => void;
  onViewReports?: (member: TeamMember) => void;
}

export function TeamMemberRow({
  member,
  variant = "table",
  onAssign,
  onViewProfile,
  onViewProjects,
  onViewReports,
}: TeamMemberRowProps) {
  if (variant === "card") {
    return (
      <TeamMemberCard
        member={member}
        onAssign={onAssign}
        onViewProfile={onViewProfile}
      />
    );
  }

  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-semibold">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{member.name}</p>
            {member.email && (
              <p className="text-xs text-muted-foreground">{member.email}</p>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 text-sm">{member.designation}</td>
      <td className="py-3">
        <AllocationBar
          percentage={member.allocation}
          showPercentage={true}
          height="sm"
        />
      </td>
      <td className="py-3 text-center">
        <span
          className={`text-sm font-semibold ${
            member.available >= 40 ? "text-green-600" : "text-muted-foreground"
          }`}
        >
          {member.available}%
        </span>
      </td>
      <td className="py-3 text-center text-sm">{member.projectCount}</td>
      <td className="py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewProfile?.(member)}>
              <User size={14} className="mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewProjects?.(member)}>
              <Briefcase size={14} className="mr-2" />
              View Projects
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAssign?.(member)}>
              <UserPlus size={14} className="mr-2" />
              Assign to Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewReports?.(member)}>
              <FileText size={14} className="mr-2" />
              View Reports
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

function TeamMemberCard({
  member,
  onAssign,
  onViewProfile,
}: {
  member: TeamMember;
  onAssign?: (member: TeamMember) => void;
  onViewProfile?: (member: TeamMember) => void;
}) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="font-semibold">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-semibold">{member.name}</h4>
          <p className="text-sm text-muted-foreground">{member.designation}</p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="text-sm">
          <span className="text-muted-foreground">Allocation: </span>
          <span className="font-semibold">{member.allocation}%</span>
        </div>
        <AllocationBar
          percentage={member.allocation}
          showPercentage={false}
          height="sm"
        />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Available: {member.available}%
          </span>
          <span className="text-muted-foreground">
            Projects: {member.projectCount}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProfile?.(member)}
        >
          View Profile
        </Button>
        <Button size="sm" onClick={() => onAssign?.(member)}>
          Assign to Project
        </Button>
      </div>
    </div>
  );
}
