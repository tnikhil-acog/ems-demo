"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/hooks/use-data";
import {
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
} from "lucide-react";
import { useState } from "react";

export default function HRReportsPage() {
  const { data, loading } = useData();
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading || !data) {
    return (
      <DashboardLayout
        role="hr"
        title="Weekly Reports"
        currentPath="/hr/reports"
      >
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Implement actual submission logic
    setTimeout(() => {
      setIsSubmitting(false);
      setReportText("");
      alert("Report submitted successfully!");
    }, 1000);
  };

  // Mock previous reports
  const previousReports = [
    {
      id: 1,
      week: "Jan 1-5, 2026",
      status: "submitted",
      submittedOn: "Jan 5, 2026",
      summary:
        "Completed onboarding for 5 new hires. Processed 3 exit requests. Updated skills inventory for Engineering department.",
    },
    {
      id: 2,
      week: "Dec 25-29, 2025",
      status: "submitted",
      submittedOn: "Dec 29, 2025",
      summary:
        "Year-end performance reviews completed. HR analytics dashboard updated with Q4 data.",
    },
  ];

  const currentWeek = "Jan 6-12, 2026";
  const dueDate = "Friday, Jan 12, 2026";

  return (
    <DashboardLayout role="hr" title="Weekly Reports" currentPath="/hr/reports">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Weekly Reports</h1>
          <p className="text-muted-foreground mt-1">
            Submit your consolidated weekly report
          </p>
        </div>

        {/* Current Week Report Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Report for Week: {currentWeek}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Due Date Banner */}
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
              <span className="text-sm font-semibold text-amber-700">
                Due: {dueDate}
              </span>
            </div>

            {/* Guidelines */}
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">What to include:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Key HR activities completed this week</li>
                <li>Onboarding progress and new hires</li>
                <li>Exit management updates</li>
                <li>Skills inventory changes</li>
                <li>Any blockers or concerns</li>
                <li>Plans for next week</li>
              </ul>
            </div>

            {/* Report Text Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Report</label>
              <Textarea
                placeholder="Write your consolidated weekly report here..."
                rows={12}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {reportText.length} characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setReportText("")}
                disabled={!reportText || isSubmitting}
              >
                Clear
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!reportText || isSubmitting}
                className="gap-2"
              >
                <Send size={16} />
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Previous Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} />
              Previous Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {previousReports.map((report) => (
              <div
                key={report.id}
                className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span className="font-semibold">{report.week}</span>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-700"
                  >
                    <CheckCircle size={12} className="mr-1" />
                    Submitted
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {report.summary}
                </p>
                <p className="text-xs text-muted-foreground">
                  Submitted on: {report.submittedOn}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
