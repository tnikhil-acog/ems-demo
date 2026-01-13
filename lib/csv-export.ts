/**
 * CSV Export Utility
 * Exports employees, projects, and allocations data to CSV format
 */

interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  email?: string;
  phone?: string;
  location?: string;
  reportingTo?: string;
  joinDate?: string;
  status?: string;
  employmentType?: string;
  onboardingProgress?: number;
  skills?: Array<{
    id?: string;
    technology?: string;
    rating?: number;
    status?: string;
  }>;
}

interface Project {
  id: string;
  name?: string;
  code?: string;
  status?: string;
  health?: string;
  type?: string;
  teamSize?: number;
  budget?: number;
  budgetUsed?: number;
  description?: string;
}

interface ProjectAllocation {
  allocation_id: string;
  emp_id: string;
  project_id: string;
  allocation_percentage?: number;
  date_allocated?: string;
  period?: string;
  utilization_status?: string;
  billability?: string;
  availability_date?: string;
  is_lead?: boolean;
  dependency_score?: number;
  transferable?: string;
  is_client_facing?: boolean;
  transferability_score?: number;
}

/**
 * Convert array to CSV format
 */
function arrayToCSV(data: any[]): string {
  if (data.length === 0) return "";

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV header row
  const csvHeaders = headers.map((h) => `"${h}"`).join(",");

  // Create CSV data rows
  const csvRows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header];
        // Handle null/undefined
        if (value === null || value === undefined) return '""';
        // Handle arrays (skills)
        if (Array.isArray(value)) {
          return `"${JSON.stringify(value)}"`;
        }
        // Handle strings with quotes and commas
        const stringValue = String(value);
        const escaped = stringValue.replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(",")
  );

  return [csvHeaders, ...csvRows].join("\n");
}

/**
 * Download CSV file
 * Adds UTF-8 BOM to ensure proper Unicode character rendering in Excel
 */
function downloadCSV(csv: string, filename: string): void {
  // UTF-8 BOM (Byte Order Mark) ensures Excel renders Unicode correctly
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Export employees to CSV
 */
export function exportEmployeesCSV(employees: Employee[]): void {
  const exportData = employees.map((emp) => ({
    "Employee ID": emp.id,
    "Employee Name": emp.name,
    Designation: emp.designation,
    Department: emp.department,
    Email: emp.email,
    Phone: emp.phone,
    Location: emp.location,
    "Reporting To": emp.reportingTo || "N/A",
    "Join Date": emp.joinDate,
    Status: emp.status,
    "Employment Type": emp.employmentType,
    "Onboarding Progress %": emp.onboardingProgress,
    Skills:
      emp.skills?.map((s) => `${s.technology} (${s.rating}/5)`).join("; ") ||
      "N/A",
  }));

  const csv = arrayToCSV(exportData);
  const timestamp = new Date().toISOString().split("T")[0];
  downloadCSV(csv, `employees_${timestamp}.csv`);
}

/**
 * Export projects to CSV
 */
export function exportProjectsCSV(projects: Project[]): void {
  const exportData = projects.map((proj) => ({
    "Project ID": proj.id,
    "Project Name": proj.name,
    "Project Code": proj.code,
    Status: proj.status,
    Health: proj.health || "N/A",
    Type: proj.type,
    "Team Size": proj.teamSize,
    Budget: proj.budget || "N/A",
    "Budget Used": proj.budgetUsed || "N/A",
    Description: proj.description || "N/A",
  }));

  const csv = arrayToCSV(exportData);
  const timestamp = new Date().toISOString().split("T")[0];
  downloadCSV(csv, `projects_${timestamp}.csv`);
}

/**
 * Export allocations to CSV with employee and project names
 */
export function exportAllocationsCSV(
  allocations: ProjectAllocation[],
  employees: Employee[],
  projects: Project[]
): void {
  const employeeMap = new Map(employees.map((e) => [e.id, e]));
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const exportData = allocations.map((alloc) => {
    const employee = employeeMap.get(alloc.emp_id);
    const project = projectMap.get(alloc.project_id);

    return {
      "Allocation ID": alloc.allocation_id,
      "Employee ID": alloc.emp_id,
      "Employee Name": employee?.name || "N/A",
      "Employee Department": employee?.department || "N/A",
      "Project ID": alloc.project_id,
      "Project Name": project?.name || "N/A",
      "Project Code": project?.code || "N/A",
      "Allocation %": alloc.allocation_percentage,
      "Date Allocated": alloc.date_allocated,
      Period: alloc.period,
      "Utilization Status": alloc.utilization_status,
      Billability: alloc.billability,
      "Availability Date": alloc.availability_date,
      "Is Lead": alloc.is_lead ? "Yes" : "No",
      "Dependency Score": alloc.dependency_score,
      Transferable: alloc.transferable,
      "Client Facing": alloc.is_client_facing ? "Yes" : "No",
      "Transferability Score": alloc.transferability_score,
    };
  });

  const csv = arrayToCSV(exportData);
  const timestamp = new Date().toISOString().split("T")[0];
  downloadCSV(csv, `allocations_${timestamp}.csv`);
}

/**
 * Export comprehensive report with all data
 */
export function exportComprehensiveCSV(
  employees: Employee[],
  projects: Project[],
  allocations: ProjectAllocation[]
): void {
  const timestamp = new Date().toISOString().split("T")[0];

  // Export each dataset
  exportEmployeesCSV(employees);
  exportProjectsCSV(projects);
  exportAllocationsCSV(allocations, employees, projects);

  // Optional: Could also create a zip file with all three, but this requires additional library
}
