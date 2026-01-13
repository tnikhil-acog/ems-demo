"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getUniqueValues } from "@/lib/utils";
import { Download, Filter, FileText, User, Calendar, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  objectType: string;
  objectName: string;
  action: string;
  summary: string;
}

export default function AuditLogs() {
  const [actorFilter, setActorFilter] = useState("all");
  const [objectTypeFilter, setObjectTypeFilter] = useState("all");
  const [actionTypeFilter, setActionTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7days");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Demo audit logs
  const auditLogs: AuditLog[] = [
    {
      id: "1",
      timestamp: "2025-01-08 10:30:00",
      actor: "Sarah Williams",
      objectType: "Employee",
      objectName: "Alice Chen",
      action: "create",
      summary: "Added new employee",
    },
    {
      id: "2",
      timestamp: "2025-01-08 09:15:00",
      actor: "Sarah Williams",
      objectType: "Employee",
      objectName: "Jane Smith",
      action: "exit-initiate",
      summary: "Initiated exit process",
    },
    {
      id: "3",
      timestamp: "2025-01-07 14:20:00",
      actor: "John Doe",
      objectType: "Profile",
      objectName: "John Doe",
      action: "update",
      summary: "Updated skills: Added React",
    },
    {
      id: "4",
      timestamp: "2025-01-07 11:45:00",
      actor: "Sarah Williams",
      objectType: "Employee",
      objectName: "Bob Wilson",
      action: "update",
      summary: "Updated department: Engineering",
    },
    {
      id: "5",
      timestamp: "2025-01-06 16:30:00",
      actor: "Mike Johnson",
      objectType: "Profile",
      objectName: "Mike Johnson",
      action: "update",
      summary: "Updated profile picture",
    },
  ];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesActor = actorFilter === "all" || log.actor === actorFilter;
    const matchesObjectType =
      objectTypeFilter === "all" || log.objectType === objectTypeFilter;
    const matchesAction =
      actionTypeFilter === "all" || log.action === actionTypeFilter;
    return matchesActor && matchesObjectType && matchesAction;
  });

  const actors = getUniqueValues(auditLogs, "actor", false);
  const objectTypes = getUniqueValues(auditLogs, "objectType", false);
  const actionTypes = getUniqueValues(auditLogs, "action", false);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getActionBadge = (action: string) => {
    switch (action) {
      case "create":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Create</Badge>
        );
      case "update":
        return <Badge variant="secondary">Update</Badge>;
      case "delete":
        return <Badge variant="destructive">Delete</Badge>;
      case "exit-initiate":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">
            Exit Initiate
          </Badge>
        );
      default:
        return <Badge>{action}</Badge>;
    }
  };

  return (
    <DashboardLayout role="hr" title="Audit Logs" currentPath="/hr/audit">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            Track system changes and user actions
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download size={16} className="mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter size={18} />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Actor</label>
              <Select value={actorFilter} onValueChange={setActorFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {actors.map((actor) => (
                    <SelectItem key={actor} value={actor}>
                      {actor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Object Type
              </label>
              <Select
                value={objectTypeFilter}
                onValueChange={setObjectTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {objectTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Action</label>
              <Select
                value={actionTypeFilter}
                onValueChange={setActionTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {actionTypes.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Date Range
              </label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">
                    Timestamp
                  </th>
                  <th className="text-left p-4 font-medium text-sm">Actor</th>
                  <th className="text-left p-4 font-medium text-sm">Object</th>
                  <th className="text-left p-4 font-medium text-sm">Action</th>
                  <th className="text-left p-4 font-medium text-sm">Summary</th>
                  <th className="text-left p-4 font-medium text-sm">Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <FileText size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No audit logs found matching your filters.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {log.actor}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-medium">
                            {log.objectName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {log.objectType}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">{getActionBadge(log.action)}</td>
                      <td className="p-4 text-sm">{log.summary}</td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm">
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • {filteredLogs.length} total
                logs
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
