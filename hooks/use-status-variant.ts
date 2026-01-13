/**
 * Status Variant Hook
 * Convert status strings to badge variants
 * Eliminates 18+ duplicate status mapping functions across the application
 */

import { UI_CONSTANTS } from "@/lib/constants";
import type { StatusVariant } from "@/lib/constants";

/**
 * Convert any status string to badge variant
 * Single source of truth for status-to-badge mapping
 *
 * Usage in 18 different badge locations:
 * const variant = useStatusVariant(status);
 *
 * Examples:
 * useStatusVariant('healthy') → 'default'
 * useStatusVariant('at-risk') → 'secondary'
 * useStatusVariant('blocked') → 'destructive'
 * useStatusVariant('active') → 'default'
 * useStatusVariant('exit-initiated') → 'warning'
 */
export const useStatusVariant = (status?: string | null): string => {
  if (!status) return "default";

  const variant = UI_CONSTANTS.STATUS_VARIANTS[status as StatusVariant];
  return variant || "default";
};

/**
 * Convert health status to human-readable format with emoji
 * Used for project and resource health indicators
 *
 * Usage: const health = useHealthStatus('healthy');
 * Returns: { variant: 'default', label: '🟢 Healthy' }
 */
export const useHealthStatus = (health?: string | null) => {
  const variants: Record<string, any> = {
    healthy: { variant: "default", label: "Healthy", icon: "🟢" },
    "at-risk": { variant: "secondary", label: "At Risk", icon: "🟡" },
    blocked: { variant: "destructive", label: "Blocked", icon: "🔴" },
  };

  return variants[health || "healthy"] || variants.healthy;
};

/**
 * Convert employee status to variant
 * Used for filtering and displaying employee records
 *
 * Usage: const variant = useEmployeeStatusVariant('active');
 */
export const useEmployeeStatusVariant = (status?: string | null): string => {
  const statusMap: Record<string, string> = {
    active: "default",
    "exit-initiated": "warning",
    exited: "secondary",
  };

  return statusMap[status || "active"] || "default";
};

/**
 * Convert project status to variant
 * Used in project cards and lists
 *
 * Usage: const variant = useProjectStatusVariant('active');
 */
export const useProjectStatusVariant = (status?: string | null): string => {
  const statusMap: Record<string, string> = {
    active: "default",
    paused: "secondary",
    completed: "default",
  };

  return statusMap[status || "active"] || "default";
};

/**
 * Convert skill verification status to variant
 * Used in skills inventory displays
 *
 * Usage: const variant = useSkillStatusVariant('verified');
 */
export const useSkillStatusVariant = (status?: string | null): string => {
  const statusMap: Record<string, string> = {
    verified: "default",
    pending: "secondary",
  };

  return statusMap[status || "pending"] || "secondary";
};

/**
 * Convert utilization status to variant based on percentage
 * Color-codes allocation levels
 *
 * Usage: const variant = useUtilizationVariant(45);
 * 45% → 'destructive' (too low)
 * 75% → 'secondary' (moderate)
 * 95% → 'default' (optimal)
 */
export const useUtilizationVariant = (utilization?: number): string => {
  if (!utilization) return "destructive";

  if (utilization >= 85) return "default";
  if (utilization >= 60) return "secondary";
  return "destructive";
};

/**
 * Convert attendance status to variant
 * Used in attendance tracking displays
 *
 * Usage: const variant = useAttendanceVariant('present');
 */
export const useAttendanceVariant = (status?: string | null): string => {
  const statusMap: Record<string, string> = {
    present: "default",
    absent: "destructive",
    leave: "secondary",
  };

  return statusMap[status || "present"] || "default";
};

/**
 * Get all status variant utilities as a single object
 * Useful for passing to components that need multiple status handlers
 *
 * Usage:
 * const statusUtils = useStatusUtils();
 * const variant = statusUtils.getVariant(status);
 */
export const useStatusUtils = () => {
  return {
    getVariant: useStatusVariant,
    getHealth: useHealthStatus,
    getEmployeeStatus: useEmployeeStatusVariant,
    getProjectStatus: useProjectStatusVariant,
    getSkillStatus: useSkillStatusVariant,
    getUtilization: useUtilizationVariant,
    getAttendance: useAttendanceVariant,
  };
};
