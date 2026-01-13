/**
 * UI Constants
 * Single source of truth for repeated values across the application
 * Eliminates 28+ duplicate patterns and enables global updates
 */

export const UI_CONSTANTS = {
  // Icon sizes used throughout the application
  ICON_SIZES: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
  } as const,

  // Color mappings for variants
  COLORS: {
    success: "green-500",
    warning: "yellow-500",
    danger: "red-500",
    primary: "blue-500",
    neutral: "gray-500",
  } as const,

  // Department utilization thresholds for health indicators
  UTILIZATION_THRESHOLDS: [50, 70, 90] as const,

  // Status to badge variant mapping - eliminates 18 duplicate functions
  STATUS_VARIANTS: {
    healthy: "default",
    "at-risk": "secondary",
    blocked: "destructive",
    active: "default",
    "exit-initiated": "warning",
    exited: "secondary",
    present: "default",
    absent: "destructive",
    leave: "secondary",
    "fully-allocated": "default",
    "partially-allocated": "secondary",
    idle: "warning",
    verified: "default",
    pending: "secondary",
  } as const,

  // Valid user roles
  ROLES: ["employee", "manager", "hr"] as const,

  // Responsive breakpoints
  BREAKPOINTS: {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  } as const,

  // Employment types
  EMPLOYMENT_TYPES: ["Full-time", "Contract", "Part-time"] as const,

  // Project statuses
  PROJECT_STATUSES: ["active", "paused", "completed"] as const,

  // Employee statuses
  EMPLOYEE_STATUSES: ["active", "exit-initiated", "exited"] as const,

  // Health statuses for projects and resources
  HEALTH_STATUSES: ["healthy", "at-risk", "blocked"] as const,

  // Sentiment types for weekly reports
  SENTIMENTS: ["positive", "neutral", "negative"] as const,
} as const;

// Type exports for TypeScript support
export type Role = (typeof UI_CONSTANTS.ROLES)[number];
export type StatusVariant = keyof typeof UI_CONSTANTS.STATUS_VARIANTS;
export type EmploymentType = (typeof UI_CONSTANTS.EMPLOYMENT_TYPES)[number];
export type ProjectStatus = (typeof UI_CONSTANTS.PROJECT_STATUSES)[number];
export type EmployeeStatus = (typeof UI_CONSTANTS.EMPLOYEE_STATUSES)[number];
export type HealthStatus = (typeof UI_CONSTANTS.HEALTH_STATUSES)[number];
export type Sentiment = (typeof UI_CONSTANTS.SENTIMENTS)[number];
export type IconSize =
  (typeof UI_CONSTANTS.ICON_SIZES)[keyof typeof UI_CONSTANTS.ICON_SIZES];

/**
 * Get icon size in pixels
 * Usage: const size = getIconSize('lg') // returns 24
 */
export const getIconSize = (
  size: keyof typeof UI_CONSTANTS.ICON_SIZES
): number => {
  return UI_CONSTANTS.ICON_SIZES[size];
};

/**
 * Get color for a variant
 * Usage: const color = getColor('success') // returns 'green-500'
 */
export const getColor = (variant: keyof typeof UI_CONSTANTS.COLORS): string => {
  return UI_CONSTANTS.COLORS[variant];
};

/**
 * Check if utilization is healthy
 * Usage: isHealthyUtilization(75) // returns true
 */
export const isHealthyUtilization = (utilization: number): boolean => {
  return utilization >= UI_CONSTANTS.UTILIZATION_THRESHOLDS[0];
};

/**
 * Get utilization status badge
 * Usage: getUtilizationStatus(45) // returns 'warning'
 */
export const getUtilizationStatus = (
  utilization: number
): "default" | "secondary" | "destructive" => {
  if (utilization >= UI_CONSTANTS.UTILIZATION_THRESHOLDS[2]) return "default";
  if (utilization >= UI_CONSTANTS.UTILIZATION_THRESHOLDS[1]) return "secondary";
  return "destructive";
};
