import {
  HAZARD_STATUS,
  type HazardDetail,
  type HazardStatus,
} from "@campus-hazard/shared";
import { createClient } from "@/lib/supabase/server";

export async function fetchUnresolvedHazardById(
  hazardId: string
): Promise<{ hazard: HazardDetail | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hazards")
    .select(
      "hazard_id, short_description, detailed_description, location, submitted_at, status, submission_image_path"
    )
    .eq("hazard_id", hazardId)
    .eq("status", HAZARD_STATUS.UNRESOLVED)
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
    },
    error: null,
  };
}
