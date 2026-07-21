import Link from "next/link";
import { formatSubmissionDate, type HazardListItem } from "@campus-hazard/shared";

type HazardCardProps = {
  hazard: HazardListItem;
  detailHref?: string;
};

export function HazardCard({ hazard, detailHref }: HazardCardProps) {
  const content = (
    <>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-emerald-800">
          {hazard.hazardId}
        </h2>
        <time
          className="shrink-0 text-sm text-zinc-500"
          dateTime={hazard.submittedAt}
        >
          {formatSubmissionDate(hazard.submittedAt)}
        </time>
      </div>
      <p className="mt-2 text-base font-medium break-words text-zinc-900">
        {hazard.shortDescription}
      </p>
      <p className="mt-2 text-sm break-words text-zinc-600">{hazard.location}</p>
    </>
  );

  const className =
    "block w-full min-w-0 rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50 active:bg-emerald-100";

  if (detailHref) {
    return (
      <Link href={detailHref} className={className}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}
