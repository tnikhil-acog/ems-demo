"use client";

import { useState } from "react";
import { Bell, User, ChevronDown, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  currentRole: "employee" | "manager" | "hr";
}

export function Header({ title, breadcrumbs, currentRole }: HeaderProps) {
  const router = useRouter();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);

  const roles = ["employee", "manager", "hr"];

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-80 z-30 bg-background border-b h-16 flex items-center justify-between px-6 shadow-sm">
      {/* Left side - Breadcrumbs */}
      <div className="flex items-center gap-2 flex-1">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-muted-foreground">/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-primary hover:underline"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        ) : (
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          className={`hidden md:flex items-center px-3 py-2 bg-muted text-foreground text-sm rounded-lg border transition-all ${
            searchFocus
              ? "border-primary ring-2 ring-primary/20"
              : "border-border"
          }`}
        >
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            className="bg-transparent focus:outline-none w-64"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-muted transition-colors"
        >
          <Bell size={20} className="text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
        </Button>

        <div className="relative">
          <Button
            variant="outline"
            className="gap-2 bg-transparent hover:bg-muted transition-colors"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
          >
            <span className="text-xs text-muted-foreground">Current:</span>
            <span className="font-semibold capitalize">{currentRole}</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                showRoleMenu ? "rotate-180" : ""
              }`}
            />
          </Button>

          {showRoleMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-lg shadow-lg z-50 min-w-max animate-in fade-in slide-in-from-top-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    router.push(`/${role}`);
                    setShowRoleMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    currentRole === role
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          title="Back to role selector"
          onClick={() => router.push("/")}
          className="hover:bg-muted transition-colors"
        >
          <Home size={20} className="text-muted-foreground" />
        </Button>

        {/* Profile */}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted transition-colors"
        >
          <User size={20} className="text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
}
