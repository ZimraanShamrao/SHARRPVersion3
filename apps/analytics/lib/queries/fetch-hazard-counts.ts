import { HAZARD_STATUS } from "@campus-hazard/shared";
import { createClient } from "@/lib/supabase/server";

export type HazardCounts = {
  total: number;
  unresolved: number;
  inProgress: number;
};

export async function fetchHazardCounts(): Promise<{
  counts: HazardCounts | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const [totalResult, unresolvedResult, inProgressResult] = await Promise.all([
    supabase.from("hazards").select("*", { count: "exact", head: true }),
    supabase
      .from("hazards")
      .select("*", { count: "exact", head: true })
      .eq("status", HAZARD_STATUS.UNRESOLVED),
    supabase
      .from("hazards")
      .select("*", { count: "exact", head: true })
      .eq("status", HAZARD_STATUS.IN_PROGRESS),
  ]);

  if (totalResult.error || unresolvedResult.error || inProgressResult.error) {
    return {
      counts: null,
      error: "Unable to load hazard counts. Please try again.",
    };
  }

  return {
    counts: {
      total: totalResult.count ?? 0,
      unresolved: unresolvedResult.count ?? 0,
      inProgress: inProgressResult.count ?? 0,
    },
    error: null,
  };
}
