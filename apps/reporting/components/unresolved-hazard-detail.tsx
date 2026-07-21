import type { ReactNode } from "react";
import Link from "next/link";
import {
  formatSubmissionDate,
  getStoragePublicUrl,
  SUBMISSION_IMAGES_BUCKET,
  type HazardDetail,
} from "@campus-hazard/shared";

type UnresolvedHazardDetailProps = {
  hazard: HazardDetail;
  submissionImageUrl: string;
};

function DetailField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="text-sm font-medium text-zinc-500">{label}</dt>
      <dd className="mt-1 text-base break-words text-zinc-900">{children}</dd>
    </div>
  );
}

export function UnresolvedHazardDetail({
  hazard,
  submissionImageUrl,
}: UnresolvedHazardDetailProps) {
  return (
    <div className="flex flex-col gap-6">
      <section
        aria-label="Hazard submission image"
        className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={submissionImageUrl}
          alt={`Submission photo for ${hazard.hazardId}`}
          className="aspect-[4/3] w-full object-cover"
        />
      </section>

      <dl className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <DetailField label="Hazard ID">{hazard.hazardId}</DetailField>
        <DetailField label="Hazard Details">
          <div className="space-y-2">
            <p>{hazard.shortDescription}</p>
            {hazard.detailedDescription?.trim() ? (
              <p className="text-zinc-600">{hazard.detailedDescription}</p>
            ) : null}
          </div>
        </DetailField>
        <DetailField label="Location">{hazard.location}</DetailField>
        <DetailField label="Submission Date">
          <time dateTime={hazard.submittedAt}>
            {formatSubmissionDate(hazard.submittedAt)}
          </time>
        </DetailField>
        <DetailField label="Status">{hazard.status}</DetailField>
      </dl>

      <Link
        href="/hazards/unresolved"
        className="flex min-h-14 w-full shrink-0 items-center justify-center rounded-xl border-2 border-emerald-600 bg-white px-4 text-base font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 active:bg-emerald-100 sm:px-6"
      >
        Back to List
      </Link>
    </div>
  );
}

export function buildSubmissionImageUrl(
  hazard: HazardDetail,
  supabaseUrl: string
): string {
  return getStoragePublicUrl(
    supabaseUrl,
    SUBMISSION_IMAGES_BUCKET,
    hazard.submissionImagePath
  );
}
