"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from "@/hooks/use-data";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Plus,
  CheckCircle,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Skill {
  id: string;
  technology: string;
  rating: number;
  status: "verified" | "pending";
}

function ProfileContent() {
  const { data, loading } = useData();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("skills");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillRating, setSkillRating] = useState(0);
  const [initializedSkills, setInitializedSkills] = useState(false);
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

  if (loading || !data) {
    return (
      <DashboardLayout
        role={currentRole}
        title="Profile"
        currentPath="/profile"
        breadcrumbs={[{ label: "My Profile" }]}
      >
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  const employee = data.employees[0];

  // Initialize skills from employee data on first render
  if (!initializedSkills && employee.skills) {
    setSkills(employee.skills as Skill[]);
    setInitializedSkills(true);
  }

  const handleAddSkill = () => {
    if (skillName.trim() && skillRating > 0) {
      const newSkill: Skill = {
        id: `SK${Date.now()}`,
        technology: skillName,
        rating: skillRating,
        status: "verified",
      };
      setSkills([...skills, newSkill]);
      setSkillName("");
      setSkillRating(0);
      setShowAddSkillModal(false);
    }
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const renderStars = (rating: number, onRate?: (rate: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate?.(star)}
            className={`transition-colors ${
              onRate ? "cursor-pointer hover:scale-110" : "cursor-default"
            }`}
          >
            <Star
              size={16}
              className={
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout
      role={currentRole}
      title="Profile"
      currentPath="/profile"
      breadcrumbs={[{ label: "My Profile" }]}
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex gap-6 flex-1">
                <img
                  src={employee.avatar || "/placeholder.svg"}
                  alt={employee.name}
                  className="w-24 h-24 rounded-lg"
                />
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-1">
                    {employee.name}
                  </h1>
                  <p className="text-lg text-primary font-semibold mb-3">
                    {employee.designation}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 size={16} />
                      {employee.department}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail size={16} />
                      {employee.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone size={16} />
                      {employee.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={16} />
                      {employee.location}
                    </div>
                  </div>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {["skills", "education", "documents", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Skills & Expertise</CardTitle>
              <Button
                variant="outline"
                className="gap-2 bg-transparent"
                size="sm"
                onClick={() => setShowAddSkillModal(true)}
              >
                <Plus size={16} />
                Add Skill
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-semibold">
                        Skill Name
                      </th>
                      <th className="text-left py-3 font-semibold">Rating</th>
                      <th className="text-left py-3 font-semibold">Status</th>
                      <th className="text-left py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill) => (
                      <tr key={skill.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 font-medium">{skill.technology}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            {renderStars(skill.rating)}
                            <span className="text-xs font-semibold text-muted-foreground">
                              {skill.rating}/5
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            {skill.status === "verified" ? (
                              <>
                                <CheckCircle
                                  size={16}
                                  className="text-green-600"
                                />
                                <span className="text-xs font-semibold text-green-600">
                                  Verified ✓
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-semibold text-yellow-600">
                                Pending
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <Button
                            variant="link"
                            className="text-xs p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleRemoveSkill(skill.id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={showAddSkillModal} onOpenChange={setShowAddSkillModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Skill Name
                </label>
                <Input
                  placeholder="e.g., React, Python, AWS"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Rating
                </label>
                <div className="flex items-center gap-3">
                  {renderStars(skillRating, setSkillRating)}
                  <span className="text-sm font-semibold text-muted-foreground">
                    {skillRating > 0 ? `${skillRating}/5` : "Select rating"}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddSkillModal(false);
                  setSkillName("");
                  setSkillRating(0);
                }}
                className="bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSkill}
                disabled={!skillName.trim() || skillRating === 0}
                className="bg-primary hover:bg-primary/90"
              >
                Add Skill
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Education Tab */}
        {activeTab === "education" && (
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                No education records yet.
              </p>
              <Button variant="outline" className="mt-4 gap-2 bg-transparent">
                <Plus size={16} />
                Add Education
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                No documents uploaded yet.
              </p>
              <Button variant="outline" className="mt-4 gap-2 bg-transparent">
                <Plus size={16} />
                Upload Document
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-start pb-3 border-b">
                  <div>
                    <p className="font-semibold text-sm">Profile Updated</p>
                    <p className="text-xs text-muted-foreground">
                      You updated your profile information
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    2 hours ago
                  </span>
                </div>
                <div className="flex justify-between items-start pb-3 border-b">
                  <div>
                    <p className="font-semibold text-sm">Skills Verified</p>
                    <p className="text-xs text-muted-foreground">
                      React skill was verified by admin
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    1 day ago
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
