"use client";

import type React from "react";

import Link from "next/link";
import { useState } from "react";
import {
  Home,
  Users,
  Briefcase,
  FileText,
  Search,
  BarChart3,
  UserPlus,
  LogOut,
  FileTextIcon,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  submenu?: MenuItem[];
}

interface SidebarProps {
  role: "employee" | "manager" | "hr";
  currentPath: string;
}

export function Sidebar({ role, currentPath }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const getMenuItems = (): MenuItem[] => {
    const baseSize = 20;

    const commonItems: MenuItem[] = [
      {
        label: "Dashboard",
        icon: <Home size={baseSize} />,
        href: `/${role}`,
      },
      {
        label: "My Profile",
        icon: <Users size={baseSize} />,
        href: "/profile",
      },
    ];

    if (role === "employee") {
      return [
        ...commonItems,
        {
          label: "My Projects",
          icon: <Briefcase size={baseSize} />,
          href: "/projects",
        },
        {
          label: "Weekly Reports",
          icon: <FileText size={baseSize} />,
          href: "/reports",
        },
        {
          label: "Search Colleagues",
          icon: <Search size={baseSize} />,
          href: "/search",
        },
      ];
    } else if (role === "manager") {
      return [
        ...commonItems,
        {
          label: "My Team",
          icon: <Users size={baseSize} />,
          href: "/manager/team",
        },
        {
          label: "My Projects",
          icon: <Briefcase size={baseSize} />,
          href: "/manager/projects",
        },
        {
          label: "Find Resources",
          icon: <Search size={baseSize} />,
          href: "/manager/resources",
        },
        {
          label: "Requests",
          icon: <AlertCircle size={baseSize} />,
          href: "/manager/requests",
        },
      ];
    } else {
      // HR role
      return [
        {
          label: "Dashboard",
          icon: <Home size={baseSize} />,
          href: `/${role}`,
        },
        {
          label: "My Profile",
          icon: <Users size={baseSize} />,
          href: "/profile",
        },
        {
          label: "Search Employees",
          icon: <Search size={baseSize} />,
          href: "/search",
        },
        {
          label: "Onboarding",
          icon: <UserPlus size={baseSize} />,
          href: "/hr/onboarding",
        },
        {
          label: "Exit Management",
          icon: <LogOut size={baseSize} />,
          href: "/hr/exits",
        },
        {
          label: "Skills Inventory",
          icon: <Star size={baseSize} />,
          href: "/hr/skills",
        },
        {
          label: "Analytics",
          icon: <BarChart3 size={baseSize} />,
          href: "/hr/analytics",
        },
        {
          label: "Audit Logs",
          icon: <FileText size={baseSize} />,
          href: "/hr/audit",
        },
        {
          label: "All Projects",
          icon: <Briefcase size={baseSize} />,
          href: "/projects",
        },
        {
          label: "Weekly Reports",
          icon: <FileText size={baseSize} />,
          href: "/hr/reports",
        },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-linear-to-b from-sidebar via-slate-800 to-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-80"
      } flex flex-col z-40`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className="flex-1">
              <h1 className="text-sidebar-foreground font-bold text-sm">
                Aganitha
              </h1>
              <p className="text-xs text-sidebar-accent-foreground">EMS</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item, index) => (
          <div key={index}>
            <Link
              href={`${item.href}${
                item.href.includes("?") ? "&" : "?"
              }role=${role}`}
            >
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 px-4 py-2 h-auto text-sidebar-foreground hover:bg-sidebar-accent ${
                  currentPath === item.href
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : ""
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <span className="shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Button>
            </Link>
            {item.submenu && expandedMenu === item.label && !isCollapsed && (
              <div className="ml-4 mt-1">
                {item.submenu.map((subitem, subindex) => (
                  <Link
                    key={subindex}
                    href={`${subitem.href}${
                      subitem.href.includes("?") ? "&" : "?"
                    }role=${role}`}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 px-2 py-1 h-auto text-xs text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                    >
                      {subitem.icon}
                      <span>{subitem.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Profile Section */}
      {!isCollapsed && (
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">
                User Profile
              </p>
              <p className="text-xs text-sidebar-accent-foreground truncate">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
