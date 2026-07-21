import type { ReactNode } from "react";
import Link from "next/link";
import {
  formatSubmissionDate,
  getStoragePublicUrl,
  PROGRESS_IMAGES_BUCKET,
  RESOLUTION_IMAGES_BUCKET,
  SUBMISSION_IMAGES_BUCKET,
  type ResolvedHazardDetail,
} from "@campus-hazard/shared";

type ResolvedHazardDetailProps = {
  hazard: ResolvedHazardDetail;
  submissionImageUrl: string;
  resolutionImageUrl: string | null;
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

export function ResolvedHazardDetail({
  hazard,
  submissionImageUrl,
  resolutionImageUrl,
  supabaseUrl,
}: ResolvedHazardDetailProps) {
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
            No maintenance updates recorded.
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
                    <p className="text-sm font-semibold text-emerald-800">
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

      <section aria-label="Resolution details" className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">Resolution</h2>
        <dl className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          {resolutionImageUrl ? (
            <div>
              <dt className="text-sm font-medium text-zinc-500">
                Resolution Image
              </dt>
              <dd className="mt-2 overflow-hidden rounded-lg border border-zinc-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolutionImageUrl}
                  alt={`Resolution photo for ${hazard.hazardId}`}
                  className="aspect-[4/3] w-full object-cover"
                />
              </dd>
            </div>
          ) : null}
          <DetailField label="Resolution Notes">
            {hazard.resolutionNotes?.trim()
              ? hazard.resolutionNotes
              : "No resolution notes provided."}
          </DetailField>
          <DetailField label="Resolution Date">
            {hazard.resolvedAt ? (
              <time dateTime={hazard.resolvedAt}>
                {formatSubmissionDate(hazard.resolvedAt)}
              </time>
            ) : (
              "Not available"
            )}
          </DetailField>
        </dl>
      </section>

      <Link
        href="/hazards/resolved"
        className="flex min-h-14 w-full shrink-0 items-center justify-center rounded-xl border-2 border-emerald-600 bg-white px-4 text-base font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 active:bg-emerald-100 sm:px-6"
      >
        Back to List
      </Link>
    </div>
  );
}

export function buildSubmissionImageUrl(
  hazard: Pick<ResolvedHazardDetail, "submissionImagePath">,
  supabaseUrl: string
): string {
  return getStoragePublicUrl(
    supabaseUrl,
    SUBMISSION_IMAGES_BUCKET,
    hazard.submissionImagePath
  );
}

export function buildResolutionImageUrl(
  hazard: Pick<ResolvedHazardDetail, "resolutionImagePath">,
  supabaseUrl: string
): string | null {
  if (!hazard.resolutionImagePath) {
    return null;
  }

  return getStoragePublicUrl(
    supabaseUrl,
    RESOLUTION_IMAGES_BUCKET,
    hazard.resolutionImagePath
  );
}
