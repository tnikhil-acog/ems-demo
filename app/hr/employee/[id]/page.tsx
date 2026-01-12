"use client";

import { use } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useData, Employee } from "@/hooks/use-data";
import { getInitials } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  FileText,
  Clock,
  User,
} from "lucide-react";
import Link from "next/link";

export default function EmployeeProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data, loading } = useData();

  if (loading || !data) {
    return (
      <DashboardLayout
        role="hr"
        title="Employee Profile"
        currentPath="/hr/employee"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading employee profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const employees: Employee[] = data.employees || [];
  const employee = employees.find((emp) => emp.id === resolvedParams.id);

  if (!employee) {
    return (
      <DashboardLayout
        role="hr"
        title="Employee Not Found"
        currentPath="/hr/employee"
      >
        <div className="text-center py-12">
          <User
            size={64}
            className="mx-auto mb-4 text-muted-foreground opacity-20"
          />
          <h2 className="text-2xl font-bold mb-2">Employee Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The employee with ID {resolvedParams.id} could not be found.
          </p>
          <Link href="/hr/directory">
            <Button>
              <ArrowLeft size={16} className="mr-2" />
              Back to Directory
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const manager = employees.find((emp: any) => emp.id === employee.reportingTo);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
        );
      case "exit-initiated":
        return <Badge variant="destructive">Exit Initiated</Badge>;
      case "exited":
        return <Badge variant="secondary">Exited</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <span className="text-yellow-500">
        {"★".repeat(fullStars)}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  return (
    <DashboardLayout role="hr" title={employee.name} currentPath="/hr/employee">
      {/* Header */}
      <div className="mb-6">
        <Link href="/hr/directory">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Directory
          </Button>
        </Link>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-3xl font-bold">
                  {getInitials(employee.name)}
                </AvatarFallback>
              </Avatar>

              {/* Employee Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{employee.name}</h1>
                    <p className="text-lg text-muted-foreground">
                      {employee.designation} • {employee.department}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Employee ID: {employee.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(employee.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-muted-foreground" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span>{employee.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>
                      Joined:{" "}
                      {new Date(employee.joinDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {manager && (
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-muted-foreground" />
                      <span>Reports to: {manager.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase size={16} className="text-muted-foreground" />
                    <span>{employee.employmentType || "Full-time"}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button>
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                  {employee.status === "active" && (
                    <Button variant="destructive">
                      <LogOut size={16} className="mr-2" />
                      Initiate Exit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase size={18} />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Designation</p>
                  <p className="font-medium">{employee.designation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Employment Type
                  </p>
                  <p className="font-medium">
                    {employee.employmentType || "Full-time"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </p>
                </div>
                {manager && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Reporting Manager
                    </p>
                    <p className="font-medium">{manager.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact & Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail size={18} />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{employee.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{employee.location}</p>
                </div>
              </CardContent>
            </Card>

            {/* Onboarding Status */}
            {employee.onboardingProgress !== undefined &&
              employee.onboardingProgress < 100 && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock size={18} />
                      Onboarding Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Profile Completion</p>
                      <p className="text-sm font-bold">
                        {employee.onboardingProgress}%
                      </p>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${employee.onboardingProgress}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Exit Information */}
            {employee.status === "exit-initiated" && employee.exitDate && (
              <Card className="lg:col-span-2 border-red-200 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LogOut size={18} />
                    Exit Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Last Working Day
                    </p>
                    <p className="font-medium">
                      {new Date(employee.exitDate).toLocaleDateString()}
                    </p>
                  </div>
                  {employee.exitReason && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Exit Reason
                      </p>
                      <p className="font-medium capitalize">
                        {employee.exitReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star size={18} />
                Skills & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              {employee.skills && employee.skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employee.skills.map((skill: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{skill.technology}</h3>
                        <Badge
                          variant={
                            skill.status === "verified"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {skill.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Rating:
                        </span>
                        {renderStars(skill.rating)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Star size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No skills added yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase size={18} />
                Project Allocations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                <p>Project allocation information will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={18} />
                Activity History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4 py-2">
                  <p className="text-sm font-medium">Profile created</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </p>
                </div>
                {employee.skills && employee.skills.length > 0 && (
                  <div className="border-l-2 border-green-500 pl-4 py-2">
                    <p className="text-sm font-medium">Skills added</p>
                    <p className="text-xs text-muted-foreground">
                      {employee.skills.length} skills added to profile
                    </p>
                  </div>
                )}
                {employee.status === "exit-initiated" && (
                  <div className="border-l-2 border-red-500 pl-4 py-2">
                    <p className="text-sm font-medium">Exit initiated</p>
                    <p className="text-xs text-muted-foreground">
                      Last working day:{" "}
                      {employee.exitDate
                        ? new Date(employee.exitDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
