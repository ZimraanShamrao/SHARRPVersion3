import type { HazardListItem, HazardStatus } from "@campus-hazard/shared";
import { createClient } from "@/lib/supabase/server";

export type AnalyticsHazardListItem = HazardListItem & {
  status: HazardStatus;
};

export async function fetchHazardsForSearch(): Promise<{
  hazards: AnalyticsHazardListItem[];
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hazards")
    .select("hazard_id, short_description, location, submitted_at, status")
    .order("submitted_at", { ascending: false });

  if (error) {
    return {
      hazards: [],
      error: "Unable to load hazards for search. Please try again.",
    };
  }

  return {
    hazards: (data ?? []).map((row) => ({
      hazardId: row.hazard_id,
      shortDescription: row.short_description,
      location: row.location,
      submittedAt: row.submitted_at,
      status: row.status as HazardStatus,
    })),
    error: null,
  };
}
