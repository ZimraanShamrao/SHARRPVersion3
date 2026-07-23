import {
  filterHazardList,
  type HazardStatus,
} from "@campus-hazard/shared";
import type { AnalyticsHazardListItem } from "@/lib/queries/fetch-hazards-for-search";

export function filterAnalyticsHazards(
  hazards: AnalyticsHazardListItem[],
  selectedStatuses: HazardStatus[],
  query: string
): AnalyticsHazardListItem[] {
  if (selectedStatuses.length === 0) {
    return [];
  }

  const statusSet = new Set(selectedStatuses);
  const statusFiltered = hazards.filter((hazard) => statusSet.has(hazard.status));

  return filterHazardList(statusFiltered, query) as AnalyticsHazardListItem[];
}
