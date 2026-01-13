import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Date utility functions
 */

/**
 * Calculate days between a past date and today
 * @param dateString - Date string in ISO format or parseable by Date constructor
 * @returns Number of days (positive integer)
 */
export function calculateDaysSince(dateString: string): number {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate days until a future date
 * @param dateString - Date string in ISO format or parseable by Date constructor
 * @returns Number of days remaining (can be negative if past), or null if no date
 */
export function calculateDaysUntil(dateString?: string): number | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Progress color utilities
 */

/**
 * Get color class based on progress percentage
 * @param progress - Progress value (0-100)
 * @returns Tailwind color class
 */
export function getProgressColor(progress: number): string {
  if (progress >= 90) return "bg-green-500";
  if (progress >= 70) return "bg-blue-500";
  if (progress >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

/**
 * Get utilization color based on percentage
 * @param utilization - Utilization percentage (0-100)
 * @returns Tailwind color class
 */
export function getUtilizationColor(utilization: number): string {
  if (utilization >= 90) return "text-green-600";
  if (utilization >= 70) return "text-blue-600";
  if (utilization >= 50) return "text-yellow-600";
  return "text-red-600";
}

/**
 * Array utility functions
 */

/**
 * Extract unique departments from an array of employees
 * @param employees - Array of employee objects with department property
 * @returns Sorted array of unique department names
 */
export function getUniqueDepartments(
  employees: Array<{ department: string }>
): string[] {
  return Array.from(new Set(employees.map((e) => e.department))).sort();
}

/**
 * Extract unique values for a specific key from an array of objects
 * @param items - Array of objects
 * @param key - Key to extract values from
 * @param filterNull - Whether to filter out null/undefined values (default: true)
 * @returns Array of unique values
 */
export function getUniqueValues<T>(
  items: T[],
  key: keyof T,
  filterNull = true
): any[] {
  const values = items.map((item) => item[key]);
  const filtered = filterNull ? values.filter(Boolean) : values;
  return Array.from(new Set(filtered));
}

/**
 * Skills statistics utilities
 */

export interface SkillData {
  name: string;
  count: number;
  avgRating: number;
  trend: "up" | "down" | "stable";
  experts: string[];
}

/**
 * Calculate organization-wide skill statistics from employees
 * @param employees - Array of employees with skills
 * @returns Array of skills with aggregated statistics
 */
export function calculateSkillStatistics(
  employees: Array<{
    name: string;
    skills?: Array<{ technology: string; rating: number }>;
  }>
): SkillData[] {
  const skillsMap = new Map<
    string,
    { ratings: number[]; employeeNames: string[] }
  >();

  employees.forEach((emp) => {
    if (emp.skills) {
      emp.skills.forEach((skill) => {
        if (!skillsMap.has(skill.technology)) {
          skillsMap.set(skill.technology, { ratings: [], employeeNames: [] });
        }
        const skillData = skillsMap.get(skill.technology)!;
        skillData.ratings.push(skill.rating);
        skillData.employeeNames.push(emp.name);
      });
    }
  });

  return Array.from(skillsMap.entries()).map(([name, data]) => ({
    name,
    count: data.employeeNames.length,
    avgRating: data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length,
    trend:
      data.employeeNames.length > 15
        ? "up"
        : data.employeeNames.length > 10
        ? "stable"
        : "down",
    experts: data.employeeNames.slice(0, 5),
  }));
}

/**
 * Department statistics utilities
 */

export interface DepartmentStats {
  department: string;
  employeeCount: number;
  utilization?: number;
  onBench?: number;
  trend?: "up" | "down" | "stable";
}

/**
 * Group employees by department and calculate basic statistics
 * @param employees - Array of employees
 * @param options - Optional configuration for calculations
 * @returns Map of department name to employees array
 */
export function groupEmployeesByDepartment<T extends { department: string }>(
  employees: T[]
): Map<string, T[]> {
  const deptMap = new Map<string, T[]>();
  employees.forEach((emp) => {
    if (!deptMap.has(emp.department)) {
      deptMap.set(emp.department, []);
    }
    deptMap.get(emp.department)!.push(emp);
  });
  return deptMap;
}

/**
 * Calculate department statistics with optional utilization data
 * @param employees - Array of employees with department and status
 * @param allocations - Optional array of project allocations for utilization calculation
 * @returns Array of department statistics
 */
export function calculateDepartmentStatistics(
  employees: Array<{
    id: string;
    department: string;
    status: string;
    skills?: any[];
  }>,
  allocations?: Array<{ emp_id: string; allocation_percentage: number }>
): DepartmentStats[] {
  const deptMap = groupEmployeesByDepartment(
    employees.filter((e) => e.status === "active")
  );

  return Array.from(deptMap.entries()).map(([dept, emps]) => {
    const stats: DepartmentStats = {
      department: dept,
      employeeCount: emps.length,
      trend: "stable" as const,
    };

    // Calculate utilization if allocations provided
    if (allocations) {
      const deptAllocations = allocations.filter((alloc) =>
        emps.some((emp) => emp.id === alloc.emp_id)
      );
      const totalAllocation = deptAllocations.reduce(
        (sum, alloc) => sum + alloc.allocation_percentage,
        0
      );
      stats.utilization =
        emps.length > 0 ? Math.round(totalAllocation / emps.length) : 0;
      stats.onBench = emps.filter(
        (e) => !e.skills || e.skills.length === 0
      ).length;
    }

    return stats;
  });
}
