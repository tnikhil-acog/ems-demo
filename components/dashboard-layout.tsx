"use client"

import { Sidebar } from "./sidebar"
import { Header } from "./header"
import type { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
  role: "employee" | "manager" | "hr"
  title: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  currentPath: string
}

export function DashboardLayout({ children, role, title, breadcrumbs, currentPath }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={role} currentPath={currentPath} />
      <Header title={title} breadcrumbs={breadcrumbs} currentRole={role} />
      <main className="ml-80 mt-16 p-6">{children}</main>
    </div>
  )
}
