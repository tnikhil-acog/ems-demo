"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "employee" | "manager" | "hr";
  title: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  currentPath: string;
}

export function DashboardLayout({
  children,
  role,
  title,
  breadcrumbs,
  currentPath,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={role} currentPath={currentPath} />
      <Header title={title} breadcrumbs={breadcrumbs} currentRole={role} />
      <main className="transition-all duration-300 p-4 md:p-6 lg:ml-20 xl:ml-80 mt-16 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
