"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  UserPlus,
  LogOut,
  DollarSign,
  Bell,
  Database,
} from "lucide-react";

export default function HRSettings() {
  const [onboardingDays, setOnboardingDays] = useState("14");
  const [noticePeriod, setNoticePeriod] = useState("30");

  return (
    <DashboardLayout role="hr" title="HR Settings" currentPath="/hr/settings">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">HR Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure HR system behavior and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="onboarding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="onboarding">
            <UserPlus size={16} className="mr-2" />
            Onboarding
          </TabsTrigger>
          <TabsTrigger value="exit">
            <LogOut size={16} className="mr-2" />
            Exit
          </TabsTrigger>
          <TabsTrigger value="cost">
            <DollarSign size={16} className="mr-2" />
            Cost
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell size={16} className="mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="retention">
            <Database size={16} className="mr-2" />
            Data Retention
          </TabsTrigger>
        </TabsList>

        {/* Onboarding Settings */}
        <TabsContent value="onboarding">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="target-days">Target Completion Days</Label>
                <Input
                  id="target-days"
                  type="number"
                  value={onboardingDays}
                  onChange={(e) => setOnboardingDays(e.target.value)}
                  className="mt-2 max-w-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Number of days new employees have to complete onboarding
                </p>
              </div>

              <div>
                <Label className="mb-3 block">Required Profile Items</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="picture" defaultChecked />
                    <label htmlFor="picture" className="text-sm">
                      Profile Picture
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="skills" defaultChecked />
                    <label htmlFor="skills" className="text-sm">
                      Skills
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="resume" defaultChecked />
                    <label htmlFor="resume" className="text-sm">
                      Resume/CV
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="education" defaultChecked />
                    <label htmlFor="education" className="text-sm">
                      Education
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="bio" defaultChecked />
                    <label htmlFor="bio" className="text-sm">
                      Bio/About
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="contact" defaultChecked />
                    <label htmlFor="contact" className="text-sm">
                      Contact Information
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Reminder Schedule</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="3" className="w-20" />
                    <span className="text-sm">
                      days after joining - First reminder
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="7" className="w-20" />
                    <span className="text-sm">
                      days after joining - Second reminder
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="14" className="w-20" />
                    <span className="text-sm">
                      days after joining - Escalation
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline">
                  <RotateCcw size={16} className="mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exit Settings */}
        <TabsContent value="exit">
          <Card>
            <CardHeader>
              <CardTitle>Exit Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="notice-period">
                  Default Notice Period (Days)
                </Label>
                <Input
                  id="notice-period"
                  type="number"
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  className="mt-2 max-w-xs"
                />
              </div>

              <div>
                <Label className="mb-3 block">
                  Default Exit Checklist Items
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="handover" defaultChecked />
                    <label htmlFor="handover" className="text-sm">
                      Handover Documentation
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="knowledge-transfer" defaultChecked />
                    <label htmlFor="knowledge-transfer" className="text-sm">
                      Knowledge Transfer
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="equipment-return" defaultChecked />
                    <label htmlFor="equipment-return" className="text-sm">
                      Equipment Return
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="access-revoke" defaultChecked />
                    <label htmlFor="access-revoke" className="text-sm">
                      Access Revocation
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="final-payroll" defaultChecked />
                    <label htmlFor="final-payroll" className="text-sm">
                      Final Payroll
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="exit-interview" defaultChecked />
                    <label htmlFor="exit-interview" className="text-sm">
                      Exit Interview
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline">
                  <RotateCcw size={16} className="mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Hierarchy */}
        <TabsContent value="cost">
          <Card>
            <CardHeader>
              <CardTitle>Cost Hierarchy Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Seniority Level</Label>
                  </div>
                  <div>
                    <Label>Cost Factor</Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input defaultValue="Junior" />
                  <Input type="number" defaultValue="1.0" step="0.1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input defaultValue="Mid-Level" />
                  <Input type="number" defaultValue="1.5" step="0.1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input defaultValue="Senior" />
                  <Input type="number" defaultValue="2.0" step="0.1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input defaultValue="Lead" />
                  <Input type="number" defaultValue="2.5" step="0.1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input defaultValue="Manager" />
                  <Input type="number" defaultValue="3.0" step="0.1" />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline">
                  <RotateCcw size={16} className="mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">HR Notifications</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="onboarding-overdue" defaultChecked />
                    <label htmlFor="onboarding-overdue" className="text-sm">
                      Onboarding overdue alerts
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="exit-initiated" defaultChecked />
                    <label htmlFor="exit-initiated" className="text-sm">
                      Exit initiated
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="new-employee" defaultChecked />
                    <label htmlFor="new-employee" className="text-sm">
                      New employee added
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Manager Notifications</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="team-onboarding" defaultChecked />
                    <label htmlFor="team-onboarding" className="text-sm">
                      Team member onboarding status
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="skill-verification" defaultChecked />
                    <label htmlFor="skill-verification" className="text-sm">
                      Skills pending verification
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Employee Notifications</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="profile-incomplete" defaultChecked />
                    <label htmlFor="profile-incomplete" className="text-sm">
                      Profile completion reminders
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="skill-endorsement" defaultChecked />
                    <label htmlFor="skill-endorsement" className="text-sm">
                      Skill endorsements
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline">
                  <RotateCcw size={16} className="mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Retention */}
        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle>Data Retention Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="archived-employees">
                  Archived Employee Records (Months)
                </Label>
                <Input
                  id="archived-employees"
                  type="number"
                  defaultValue="60"
                  className="mt-2 max-w-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How long to keep exited employee records
                </p>
              </div>

              <div>
                <Label htmlFor="audit-logs">Audit Logs (Months)</Label>
                <Input
                  id="audit-logs"
                  type="number"
                  defaultValue="24"
                  className="mt-2 max-w-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How long to keep audit trail records
                </p>
              </div>

              <div>
                <Label htmlFor="reports">Generated Reports (Months)</Label>
                <Input
                  id="reports"
                  type="number"
                  defaultValue="12"
                  className="mt-2 max-w-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How long to keep historical reports
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline">
                  <RotateCcw size={16} className="mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
