"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useData } from "@/hooks/use-data"
import { Users, AlertCircle, BarChart3, CheckCircle2 } from "lucide-react"

export default function ManagerDashboard() {
  const { data, loading } = useData()

  if (loading || !data) {
    return (
      <DashboardLayout role="manager" title="Dashboard" currentPath="/manager">
        <div>Loading...</div>
      </DashboardLayout>
    )
  }

  const managerProjects = data.projects.filter((p) => p.members.includes("EMP002") || p.members.includes("EMP001"))

  return (
    <DashboardLayout role="manager" title="Dashboard" currentPath="/manager">
      <div className="space-y-6">
        {/* Team Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">8</div>
                <p className="text-sm text-muted-foreground">Team Size</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">75%</div>
                <p className="text-sm text-muted-foreground">Available Capacity</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">2</div>
                <p className="text-sm text-muted-foreground">On Bench</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{managerProjects.length}</div>
                <p className="text-sm text-muted-foreground">Projects Managed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={20} />
              Project Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {managerProjects.map((project) => (
                <Card key={project.id} className="border">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">{project.name}</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Team Size</span>
                        <span className="font-semibold">{project.teamSize} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">Health:</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            project.health === "healthy"
                              ? "bg-green-100 text-green-700"
                              : project.health === "at-risk"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {project.health === "healthy" && "🟢"}
                          {project.health === "at-risk" && "🟡"}
                          {project.health === "blocked" && "🔴"}
                          {" " + (project.health.charAt(0).toUpperCase() + project.health.slice(1))}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Allocation</span>
                          <span className="font-semibold">{project.allocation}%</span>
                        </div>
                        <div className="bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${project.allocation}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full text-xs mt-2 bg-transparent">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Report Summaries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 size={20} />
              Team Weekly Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.reports.slice(0, 3).map((report) => {
                const employee = data.employees.find((e) => e.id === report.employeeId)
                return (
                  <div key={report.id} className="p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={employee?.avatar || "/placeholder.svg"}
                          alt={employee?.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-sm">{employee?.name}</p>
                          <p className="text-xs text-muted-foreground">Week of {report.week}</p>
                        </div>
                      </div>
                      <span
                        className={`text-lg ${
                          report.sentiment === "positive"
                            ? "text-green-600"
                            : report.sentiment === "neutral"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {report.sentiment === "positive" && "😊"}
                        {report.sentiment === "neutral" && "😐"}
                        {report.sentiment === "negative" && "😟"}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{report.summary}</p>
                    <Button variant="link" className="text-xs p-0">
                      Read full report →
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Budget Alerts & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle size={20} className="text-yellow-600" />
                Budget Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {managerProjects
                  .filter((p) => p.allocation > 80)
                  .map((project) => (
                    <div key={project.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-semibold text-yellow-900">{project.name}</p>
                      <p className="text-xs text-yellow-700">Budget usage: {project.allocation}%</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                Assign Resource
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                Verify Skills
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                Review Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
