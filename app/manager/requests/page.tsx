"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useData } from "@/hooks/use-data";
import {
  Bell,
  ArrowRightLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";

interface TransferRequest {
  id: string;
  type: "incoming" | "outgoing";
  employeeName: string;
  employeeId: string;
  requester: string;
  sourceProject: {
    id: string;
    name: string;
    currentAllocation: number;
    newAllocation: number;
  };
  targetProject: {
    id: string;
    name: string;
    newAllocation: number;
  };
  duration: string;
  priority: "urgent" | "high" | "medium" | "low";
  justification: string;
  impact: string;
  dependency: number;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  approvals?: {
    sourceManager?: "pending" | "approved" | "rejected";
    sourceManagerNotes?: string;
    hr?: "pending" | "approved" | "rejected";
  };
}

export default function TransferRequestsPage() {
  const { data, loading } = useData();
  const [activeTab, setActiveTab] = useState("incoming");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<TransferRequest | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");

  if (loading || !data) {
    return (
      <DashboardLayout
        role="manager"
        title="Transfer Requests"
        currentPath="/manager/requests"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading requests...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const mockRequests: TransferRequest[] = [
    {
      id: "TR001",
      type: "incoming",
      employeeName: "Jane Doe",
      employeeId: "E002",
      requester: "Tom Brown",
      sourceProject: {
        id: "C042",
        name: "Analytics Dashboard",
        currentAllocation: 90,
        newAllocation: 30,
      },
      targetProject: {
        id: "C060",
        name: "Mobile Redesign",
        newAllocation: 60,
      },
      duration: "6 weeks (Feb 20 - Apr 3)",
      priority: "urgent",
      justification:
        "Urgent client deadline for mobile app. Will provide backend developer in return.",
      impact:
        "Will lose 24% of Jane's time. Jane has Medium dependency (3/5). Work can be redistributed.",
      dependency: 3,
      submittedDate: "2 days ago",
      status: "pending",
    },
    {
      id: "TR002",
      type: "outgoing",
      employeeName: "Alice Wilson",
      employeeId: "E005",
      requester: "You",
      sourceProject: {
        id: "E004",
        name: "Data Analytics",
        currentAllocation: 40,
        newAllocation: 10,
      },
      targetProject: {
        id: "C042",
        name: "Analytics Dashboard",
        newAllocation: 30,
      },
      duration: "4 weeks",
      priority: "high",
      justification: "Need ML expertise for customer segmentation feature",
      impact: "Requires approval from Karen Lee (E004 Manager) and HR Team",
      dependency: 4,
      submittedDate: "5 days ago",
      status: "approved",
      approvals: {
        sourceManager: "approved",
        sourceManagerNotes: "Approved for 4 weeks",
        hr: "pending",
      },
    },
  ];

  const incomingRequests = mockRequests.filter((r) => r.type === "incoming");
  const outgoingRequests = mockRequests.filter((r) => r.type === "outgoing");

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} className="text-green-600" />;
      case "rejected":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const handleApprove = (request: TransferRequest) => {
    setSelectedRequest(request);
    setShowApproveModal(true);
  };

  const handleReject = (request: TransferRequest) => {
    if (
      confirm(
        `Are you sure you want to reject the transfer request for ${request.employeeName}?`
      )
    ) {
      alert("Request rejected");
    }
  };

  const submitApproval = () => {
    alert(`Request approved with notes: ${approvalNotes}`);
    setShowApproveModal(false);
    setApprovalNotes("");
  };

  return (
    <DashboardLayout
      role="manager"
      title="Transfer Requests"
      currentPath="/manager/requests"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell size={32} />
            Transfer Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage incoming and outgoing resource transfer requests
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="incoming">
              Incoming ({incomingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="outgoing">
              Outgoing ({outgoingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="all">All ({mockRequests.length})</TabsTrigger>
          </TabsList>

          {/* Incoming Requests */}
          <TabsContent value="incoming" className="space-y-4">
            {incomingRequests.length > 0 ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle size={16} />
                  <span>
                    {
                      incomingRequests.filter((r) => r.status === "pending")
                        .length
                    }{" "}
                    requests require your action
                  </span>
                </div>

                {incomingRequests.map((request) => (
                  <Card key={request.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                              <ArrowRightLeft
                                size={20}
                                className="text-red-600 dark:text-red-400"
                              />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">
                                {request.requester} requests{" "}
                                {request.employeeName}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                {getPriorityBadge(request.priority)}
                                <span className="text-xs text-muted-foreground">
                                  • {request.submittedDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Transfer Details */}
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">
                                From (Your Project):
                              </p>
                              <p className="text-sm">
                                {request.sourceProject.id} -{" "}
                                {request.sourceProject.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {request.sourceProject.currentAllocation}% →{" "}
                                {request.sourceProject.newAllocation}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">To:</p>
                              <p className="text-sm">
                                {request.targetProject.id} -{" "}
                                {request.targetProject.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                +{request.targetProject.newAllocation}%
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Duration:</p>
                            <p className="text-sm text-muted-foreground">
                              {request.duration}
                            </p>
                          </div>
                        </div>

                        {/* Justification */}
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Justification:
                          </p>
                          <p className="text-sm text-muted-foreground italic">
                            "{request.justification}"
                          </p>
                        </div>

                        {/* Impact */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                          <p className="text-sm font-medium flex items-center gap-2 mb-1">
                            <AlertCircle
                              size={14}
                              className="text-yellow-600"
                            />
                            Impact on {request.sourceProject.name}:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.impact}
                          </p>
                        </div>

                        {/* Actions */}
                        {request.status === "pending" && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              onClick={() => handleApprove(request)}
                              className="gap-2"
                            >
                              <CheckCircle size={16} />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleApprove(request)}
                              className="gap-2"
                            >
                              Approve with Conditions
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(request)}
                              className="gap-2"
                            >
                              <XCircle size={16} />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Bell size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No incoming transfer requests</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Outgoing Requests */}
          <TabsContent value="outgoing" className="space-y-4">
            {outgoingRequests.length > 0 ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={16} />
                  <span>
                    {
                      outgoingRequests.filter((r) => r.status === "pending")
                        .length
                    }{" "}
                    requests pending approval
                  </span>
                </div>

                {outgoingRequests.map((request) => (
                  <Card key={request.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                              <ArrowRightLeft
                                size={20}
                                className="text-blue-600 dark:text-blue-400"
                              />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">
                                You requested {request.employeeName}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                {getPriorityBadge(request.priority)}
                                <span className="text-xs text-muted-foreground">
                                  • {request.submittedDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Transfer Details */}
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">From:</p>
                              <p className="text-sm">
                                {request.sourceProject.id} -{" "}
                                {request.sourceProject.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {request.sourceProject.currentAllocation}% →{" "}
                                {request.sourceProject.newAllocation}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                To (Your Project):
                              </p>
                              <p className="text-sm">
                                {request.targetProject.id} -{" "}
                                {request.targetProject.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                +{request.targetProject.newAllocation}%
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Duration:</p>
                            <p className="text-sm text-muted-foreground">
                              {request.duration}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        {request.approvals && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">
                              Approval Status:
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-sm">Source Manager</span>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(
                                    request.approvals.sourceManager || "pending"
                                  )}
                                  <span className="text-sm capitalize">
                                    {request.approvals.sourceManager}
                                  </span>
                                </div>
                              </div>
                              {request.approvals.sourceManagerNotes && (
                                <p className="text-xs text-muted-foreground pl-2">
                                  Note: {request.approvals.sourceManagerNotes}
                                </p>
                              )}
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-sm">HR Approval</span>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(
                                    request.approvals.hr || "pending"
                                  )}
                                  <span className="text-sm capitalize">
                                    {request.approvals.hr}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Expected Timeline */}
                        {request.status === "pending" && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <p className="text-sm">
                              <span className="font-medium">Expected:</span>{" "}
                              Approved by Jan 10
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {request.status === "pending" && (
                            <Button variant="ghost" size="sm">
                              Withdraw Request
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <ArrowRightLeft
                    size={48}
                    className="mx-auto mb-4 opacity-20"
                  />
                  <p>No outgoing transfer requests</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* All Requests */}
          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4">
              {mockRequests.map((request) => (
                <Card key={request.id} className="border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {request.type === "incoming"
                            ? "Incoming: "
                            : "Outgoing: "}
                          {request.employeeName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {request.submittedDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(request.priority)}
                        {getStatusIcon(request.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Approve Modal */}
        <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Transfer Request</DialogTitle>
              <DialogDescription>
                {selectedRequest?.employeeName} to Project{" "}
                {selectedRequest?.targetProject.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Status</Label>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="font-medium">Approve</span>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Conditions/Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any conditions or notes for this approval..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowApproveModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={submitApproval}>Submit Approval</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
