import type { HazardStatus } from "../constants/status";

export type HazardListItem = {
  hazardId: string;
  shortDescription: string;
  location: string;
  submittedAt: string;
};

export type HazardDetail = {
  hazardId: string;
  shortDescription: string;
  detailedDescription: string | null;
  location: string;
  submittedAt: string;
  status: HazardStatus;
  submissionImagePath: string;
};

export type MaintenanceUpdate = {
  progressNumber: number;
  notes: string;
  progressImagePath: string | null;
  createdAt: string;
};

export type InProgressHazardDetail = HazardDetail & {
  maintenanceUpdates: MaintenanceUpdate[];
};

export type ResolvedHazardDetail = HazardDetail & {
  maintenanceUpdates: MaintenanceUpdate[];
  resolutionImagePath: string | null;
  resolutionNotes: string | null;
  resolvedAt: string | null;
};
