"use client";

import { useCallback, useEffect, useState } from "react";

export interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  reportingTo: string;
  joinDate: string;
  status: "active" | "exit-initiated" | "exited";
  employmentType?: string;
  onboardingProgress?: number;
  exitDate?: string;
  exitInitiatedDate?: string;
  exitReason?: string;
  skills: Array<{
    id: string;
    technology: string;
    rating: number;
    status: "verified" | "pending";
  }>;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  status: "active" | "paused" | "completed";
  health: "healthy" | "at-risk" | "blocked";
  teamSize: number;
  members: string[];
  budget: number;
  budgetUsed: number;
  allocation: number;
  description: string;
}

export interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "leave";
}

export interface Report {
  id: string;
  employeeId: string;
  week: string;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
}

export interface Skill {
  skill: string;
  category: string;
  employeeCount: number;
  avgRating: number;
  trend: "up-high" | "up" | "stable" | "down";
  employees: Array<{ id: string; name: string; rating: number }>;
}

export interface DepartmentStat {
  department: string;
  employeeCount: number;
  utilization: number;
  onBench: number;
  trend: "up" | "down" | "stable";
  avgExperience?: number;
}

export interface EMSData {
  employees: Employee[];
  projects: Project[];
  project_allocations?: Array<{
    allocation_id: string;
    emp_id: string;
    project_id: string;
    allocation_percentage: number;
    date_allocated: string;
    period?: string;
    utilization_status?: string;
    billability?: string;
    availability_date?: string;
    is_lead: boolean;
    dependency_score?: number;
    transferable?: string;
    is_client_facing?: boolean;
    transferability_score?: number;
  }>;
  attendance: Record<string, AttendanceRecord[]>;
  currentUser: {
    id: string;
    name: string;
    role: string;
    designation: string;
    department: string;
    avatar: string;
  };
  reports: Report[];
  organizationSkills?: Skill[];
  departmentStats?: DepartmentStat[];
}

export function useData() {
  const [data, setData] = useState<EMSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load data";
      setError(errorMessage);
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
