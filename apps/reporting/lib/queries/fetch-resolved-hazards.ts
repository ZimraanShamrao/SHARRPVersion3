import { HAZARD_STATUS, type HazardListItem } from "@campus-hazard/shared";
import { createClient } from "@/lib/supabase/server";

export async function fetchResolvedHazards(): Promise<{
  hazards: HazardListItem[];
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hazards")
    .select("hazard_id, short_description, location, submitted_at")
    .eq("status", HAZARD_STATUS.RESOLVED)
    .order("submitted_at", { ascending: false });

  if (error) {
    return {
      hazards: [],
      error: "Unable to load resolved hazards. Please try again.",
    };
  }

  return {
    hazards: (data ?? []).map((row) => ({
      hazardId: row.hazard_id,
      shortDescription: row.short_description,
      location: row.location,
      submittedAt: row.submitted_at,
    })),
    error: null,
  };
}
