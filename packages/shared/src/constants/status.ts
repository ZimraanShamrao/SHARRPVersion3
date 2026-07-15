export const HAZARD_STATUS = {
  UNRESOLVED: "Unresolved",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
} as const;

export type HazardStatus = (typeof HAZARD_STATUS)[keyof typeof HAZARD_STATUS];
