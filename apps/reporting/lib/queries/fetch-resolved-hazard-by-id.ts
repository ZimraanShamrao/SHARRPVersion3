import {
  HAZARD_STATUS,
  type MaintenanceUpdate,
  type ResolvedHazardDetail,
  type HazardStatus,
} from "@campus-hazard/shared";
import { createClient } from "@/lib/supabase/server";

type MaintenanceUpdateRow = {
  progress_number: number;
  notes: string;
  progress_image_path: string | null;
  created_at: string;
};

function mapMaintenanceUpdates(
  rows: MaintenanceUpdateRow[] | null | undefined
): MaintenanceUpdate[] {
  return (rows ?? [])
    .map((row) => ({
      progressNumber: row.progress_number,
      notes: row.notes,
      progressImagePath: row.progress_image_path,
      createdAt: row.created_at,
    }))
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export async function fetchResolvedHazardById(
  hazardId: string
): Promise<{ hazard: ResolvedHazardDetail | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hazards")
    .select(
      `
      hazard_id,
      short_description,
      detailed_description,
      location,
      submitted_at,
      status,
      submission_image_path,
      resolution_image_path,
      resolution_notes,
      resolved_at,
      maintenance_updates (
        progress_number,
        notes,
        progress_image_path,
        created_at
      )
    `
    )
    .eq("hazard_id", hazardId)
    .eq("status", HAZARD_STATUS.RESOLVED)
    .maybeSingle();

  if (error) {
    return {
      hazard: null,
      error: "Unable to load hazard details. Please try again.",
    };
  }

  if (!data) {
    return { hazard: null, error: null };
  }

  return {
    hazard: {
      hazardId: data.hazard_id,
      shortDescription: data.short_description,
      detailedDescription: data.detailed_description,
      location: data.location,
      submittedAt: data.submitted_at,
      status: data.status as HazardStatus,
      submissionImagePath: data.submission_image_path,
      resolutionImagePath: data.resolution_image_path,
      resolutionNotes: data.resolution_notes,
      resolvedAt: data.resolved_at,
      maintenanceUpdates: mapMaintenanceUpdates(data.maintenance_updates),
    },
    error: null,
  };
}
