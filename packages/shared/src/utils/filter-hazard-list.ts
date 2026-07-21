import type { HazardListItem } from "../types/hazard";
import { formatSubmissionDate } from "./format-submission-date";

export function filterHazardList(
  hazards: HazardListItem[],
  query: string
): HazardListItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return hazards;
  }

  return hazards.filter((hazard) => {
    const haystack = [
      hazard.hazardId,
      hazard.shortDescription,
      hazard.location,
      formatSubmissionDate(hazard.submittedAt),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
