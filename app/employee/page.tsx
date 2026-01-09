"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useData } from "@/hooks/use-data"
import { AlertCircle, CheckCircle, Briefcase, FileText } from "lucide-react"

export default function EmployeeDashboard() {
  const { data, loading } = useData()

  if (loading || !data) {
    return (
      <DashboardLayout role="employee" title="Dashboard" currentPath="/employee">
        <div>Loading...</div>
      </DashboardLayout>
    )
  }

  const projectsForUser = data.projects.filter((p) => p.members.includes("EMP001"))
  const userEmployee = data.employees[0]

  return (
    <DashboardLayout role="employee" title="Dashboard" currentPath="/employee">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{projectsForUser.length}</div>
                <p className="text-sm text-muted-foreground">Current Projects</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">85%</div>
                <p className="text-sm text-muted-foreground">Profile Complete</p>
                <div className="mt-2 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">1</div>
                <p className="text-sm text-muted-foreground">Reports Due</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase size={20} />
              My Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-semibold">Project Name</th>
                    <th className="text-left py-3 font-semibold">Role</th>
                    <th className="text-left py-3 font-semibold">Allocation</th>
                    <th className="text-left py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsForUser.map((project) => (
                    <tr key={project.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 font-medium">{project.name}</td>
                      <td className="py-3">Senior Engineer</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2 max-w-xs">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${project.allocation}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold">{project.allocation}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            project.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Report Status and Pending Actions Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly Report Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Weekly Report Submission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Submit a consolidated report of your work across all projects this week
                </p>
                <p className="text-xs text-muted-foreground mb-4">Last submitted: January 3, 2026</p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
                <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-amber-700">Due Friday</span>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">Write This Week's Report</Button>
            </CardContent>
          </Card>

          {/* Pending Actions Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-900">Submit weekly report</p>
                  <p className="text-xs text-yellow-700">Due Friday</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-900">Profile updated</p>
                  <p className="text-xs text-green-700">Completed</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Add skills</p>
                  <p className="text-xs text-blue-700">Enhance your profile</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
