"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, ShieldAlert } from "lucide-react"

export default function Home() {
  const router = useRouter()

  const roles = [
    {
      title: "Employee Dashboard",
      description: "View as a regular employee",
      icon: <Users className="w-12 h-12 text-primary" />,
      href: "/employee",
    },
    {
      title: "Manager Dashboard",
      description: "View as a team manager",
      icon: <Briefcase className="w-12 h-12 text-primary" />,
      href: "/manager",
    },
    {
      title: "HR Dashboard",
      description: "View as HR administrator",
      icon: <ShieldAlert className="w-12 h-12 text-primary" />,
      href: "/hr",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Aganitha EMS</h1>
              <p className="text-muted-foreground">Employee Management System</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Select Your View</h2>
          <p className="text-muted-foreground">Choose a dashboard to explore the system in demo mode</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card
              key={role.href}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary group"
              onClick={() => router.push(role.href)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">{role.icon}</div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(role.href)
                  }}
                >
                  Enter Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-2">Demo Mode</h3>
          <p className="text-sm text-muted-foreground">
            This is a fully interactive demo. All data is loaded from{" "}
            <code className="bg-muted px-2 py-1 rounded">data.json</code> and reflects sample employees, projects, and
            reports. No backend connections required.
          </p>
        </div>
      </div>
    </div>
  )
}
