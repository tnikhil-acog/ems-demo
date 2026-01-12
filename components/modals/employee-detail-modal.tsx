"use client";

import { useState, useEffect } from "react";
import { Employee } from "@/hooks/use-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getInitials } from "@/lib/utils";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit2,
  X,
} from "lucide-react";

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  canEdit?: boolean;
  onSave?: (employee: Employee) => void;
}

export function EmployeeDetailModal({
  employee,
  isOpen,
  onClose,
  canEdit = false,
  onSave,
}: EmployeeDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(
    employee
  );

  // Sync editedEmployee with employee prop when it changes
  useEffect(() => {
    setEditedEmployee(employee);
    setIsEditing(false);
  }, [employee]);

  if (!employee) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedEmployee(employee);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedEmployee(employee);
  };

  const handleSave = () => {
    if (editedEmployee && onSave) {
      onSave(editedEmployee);
      setIsEditing(false);
    }
  };

  const handleInputChange = (field: keyof Employee, value: any) => {
    if (editedEmployee) {
      setEditedEmployee({ ...editedEmployee, [field]: value });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? "Edit Employee" : "Employee Details"}</span>
            {canEdit && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="ml-auto"
              >
                <Edit2 size={16} className="mr-2" />
                Edit
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-4 pb-4 border-b">
            <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 text-white text-xl font-bold shrink-0">
              {getInitials(employee.name)}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editedEmployee?.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={editedEmployee?.designation || ""}
                        onChange={(e) =>
                          handleInputChange("designation", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={editedEmployee?.department || ""}
                        onChange={(e) =>
                          handleInputChange("department", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{employee.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {employee.designation}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.department}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <Label className="text-sm font-medium">Status</Label>
            {isEditing ? (
              <Select
                value={editedEmployee?.status || ""}
                onValueChange={(val) => handleInputChange("status", val)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge
                variant={employee.status === "active" ? "default" : "secondary"}
                className="mt-1"
              >
                {employee.status.replace("-", " ")}
              </Badge>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Mail size={16} />
                Email
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editedEmployee?.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              ) : (
                <p className="text-sm">{employee.email}</p>
              )}
            </div>

            <div>
              <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Phone size={16} />
                Phone
              </Label>
              {isEditing ? (
                <Input
                  value={editedEmployee?.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              ) : (
                <p className="text-sm">{employee.phone || "-"}</p>
              )}
            </div>

            <div>
              <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                <MapPin size={16} />
                Location
              </Label>
              {isEditing ? (
                <Input
                  value={editedEmployee?.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
              ) : (
                <p className="text-sm">{employee.location || "-"}</p>
              )}
            </div>

            <div>
              <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Calendar size={16} />
                Join Date
              </Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editedEmployee?.joinDate || ""}
                  onChange={(e) =>
                    handleInputChange("joinDate", e.target.value)
                  }
                />
              ) : (
                <p className="text-sm">{employee.joinDate}</p>
              )}
            </div>
          </div>

          {/* Additional Fields */}
          <div>
            <Label className="text-sm font-medium mb-2">Reporting To</Label>
            {isEditing ? (
              <Input
                value={editedEmployee?.reportingTo || ""}
                onChange={(e) =>
                  handleInputChange("reportingTo", e.target.value)
                }
                placeholder="Manager name"
              />
            ) : (
              <p className="text-sm">{employee.reportingTo || "-"}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2">
                Employment Type
              </Label>
              {isEditing ? (
                <Select
                  value={editedEmployee?.employmentType || ""}
                  onValueChange={(val) =>
                    handleInputChange("employmentType", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm">{employee.employmentType || "-"}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium mb-2">
                Onboarding Progress
              </Label>
              <p className="text-sm">{employee.onboardingProgress || 0}%</p>
            </div>
          </div>

          {/* Skills */}
          {employee.skills && employee.skills.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2">Skills</Label>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary">
                    {typeof skill === "string"
                      ? skill
                      : skill.technology || "Unknown"}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={onClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
