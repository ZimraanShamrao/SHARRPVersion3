import type { ReactNode } from "react";
import {
  formatSubmissionDate,
  getStoragePublicUrl,
  PROGRESS_IMAGES_BUCKET,
  SUBMISSION_IMAGES_BUCKET,
  type InProgressHazardDetail,
} from "@campus-hazard/shared";
import { InProgressHazardDetailActions } from "@/components/in-progress-hazard-detail-actions";

type InProgressHazardDetailProps = {
  hazard: InProgressHazardDetail;
  submissionImageUrl: string;
  supabaseUrl: string;
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

export function InProgressHazardDetail({
  hazard,
  submissionImageUrl,
  supabaseUrl,
}: InProgressHazardDetailProps) {
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

      <section aria-label="Maintenance history" className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">
          Maintenance History
        </h2>

        {hazard.maintenanceUpdates.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-4 py-6 text-center text-base text-zinc-600">
            No maintenance updates recorded yet.
          </p>
        ) : (
          <ol className="flex flex-col gap-3">
            {hazard.maintenanceUpdates.map((update) => {
              const progressImageUrl = update.progressImagePath
                ? getStoragePublicUrl(
                    supabaseUrl,
                    PROGRESS_IMAGES_BUCKET,
                    update.progressImagePath
                  )
                : null;

              return (
                <li
                  key={`${update.progressNumber}-${update.createdAt}`}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-800">
                      Update #{update.progressNumber}
                    </p>
                    <time
                      className="shrink-0 text-sm text-zinc-500"
                      dateTime={update.createdAt}
                    >
                      {formatSubmissionDate(update.createdAt)}
                    </time>
                  </div>
                  <p className="mt-2 text-base break-words text-zinc-900">
                    {update.notes}
                  </p>
                  {progressImageUrl ? (
                    <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={progressImageUrl}
                        alt={`Progress photo ${update.progressNumber} for ${hazard.hazardId}`}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <InProgressHazardDetailActions hazardId={hazard.hazardId} />
    </div>
  );
}

export function buildSubmissionImageUrl(
  hazard: Pick<InProgressHazardDetail, "submissionImagePath">,
  supabaseUrl: string
): string {
  return getStoragePublicUrl(
    supabaseUrl,
    SUBMISSION_IMAGES_BUCKET,
    hazard.submissionImagePath
  );
}
