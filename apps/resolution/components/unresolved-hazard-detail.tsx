import type { ReactNode } from "react";
import {
  formatSubmissionDate,
  getStoragePublicUrl,
  SUBMISSION_IMAGES_BUCKET,
  type HazardDetail,
} from "@campus-hazard/shared";
import { UnresolvedHazardDetailActions } from "@/components/unresolved-hazard-detail-actions";

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
        <DetailField label="Short Description">
          {hazard.shortDescription}
        </DetailField>
        <DetailField label="Detailed Description">
          {hazard.detailedDescription?.trim()
            ? hazard.detailedDescription
            : "No detailed description provided."}
        </DetailField>
        <DetailField label="Location">{hazard.location}</DetailField>
        <DetailField label="Submission Date">
          <time dateTime={hazard.submittedAt}>
            {formatSubmissionDate(hazard.submittedAt)}
          </time>
        </DetailField>
        <DetailField label="Current Status">{hazard.status}</DetailField>
      </dl>

      <UnresolvedHazardDetailActions hazardId={hazard.hazardId} />
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
