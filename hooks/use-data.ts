"use client";

import { useEffect, useState } from "react";

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

export interface EMSData {
  employees: Employee[];
  projects: Project[];
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
}

export function useData() {
  const [data, setData] = useState<EMSData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
}
