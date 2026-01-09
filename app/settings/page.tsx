"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Palette, Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function SettingsContent() {
  const searchParams = useSearchParams();
  const [currentRole, setCurrentRole] = useState<"employee" | "manager" | "hr">(
    "employee"
  );

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (
      roleParam === "manager" ||
      roleParam === "hr" ||
      roleParam === "employee"
    ) {
      setCurrentRole(roleParam);
    }
  }, [searchParams]);

  return (
    <DashboardLayout
      role={currentRole}
      title="Settings"
      currentPath="/settings"
      breadcrumbs={[{ label: "Settings" }]}
    >
      <div className="space-y-6 max-w-2xl">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell size={20} />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Email Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive email updates for important events
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Push Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Get push notifications on your device
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Weekly Report Reminders</p>
                <p className="text-xs text-muted-foreground">
                  Remind me to submit weekly reports
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette size={20} />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-sm mb-2">Theme</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border rounded-lg bg-white text-sm font-medium border-primary">
                  Light
                </button>
                <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted">
                  Dark
                </button>
                <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted">
                  Auto
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe size={20} />
              Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="font-semibold text-sm mb-2">Preferred Language</p>
              <select className="w-full px-3 py-2 border rounded-lg bg-background">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
