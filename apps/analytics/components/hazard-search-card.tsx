import { formatSubmissionDate } from "@campus-hazard/shared";
import type { AnalyticsHazardListItem } from "@/lib/queries/fetch-hazards-for-search";

type HazardSearchCardProps = {
  hazard: AnalyticsHazardListItem;
};

export function HazardSearchCard({ hazard }: HazardSearchCardProps) {
  return (
    <article className="rounded-lg border border-[#a7d7b5] bg-white p-2 shadow-sm">
      <div className="flex min-w-0 items-start justify-between gap-1.5">
        <h3 className="text-xs font-semibold text-[#2f6b3f]">{hazard.hazardId}</h3>
        <time
          className="shrink-0 text-[11px] text-[#4b5563]"
          dateTime={hazard.submittedAt}
        >
          {formatSubmissionDate(hazard.submittedAt)}
        </time>
      </div>
      <p className="mt-0.5 line-clamp-2 text-xs font-medium break-words text-[#323232]">
        {hazard.shortDescription}
      </p>
      <p className="mt-0.5 line-clamp-1 text-[11px] break-words text-[#4b5563]">
        {hazard.location}
      </p>
      <p className="mt-1 text-[11px] font-medium text-[#991b1b]">{hazard.status}</p>
    </article>
  );
}
