import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ResolvedHazardDetail,
  buildResolutionImageUrl,
  buildSubmissionImageUrl,
} from "@/components/resolved-hazard-detail";
import { fetchResolvedHazardById } from "@/lib/queries/fetch-resolved-hazard-by-id";

type ResolvedHazardDetailPageProps = {
  params: Promise<{ hazardId: string }>;
};

export default async function ResolvedHazardDetailPage({
  params,
}: ResolvedHazardDetailPageProps) {
  const { hazardId } = await params;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return (
      <div className="flex min-h-dvh flex-col overflow-x-hidden bg-gradient-to-b from-emerald-50 via-white to-zinc-50 font-sans">
        <main className="mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm break-words text-red-700"
          >
            Unable to load hazard details. Please try again.
          </p>
        </main>
      </div>
    );
  }

  const { hazard, error } = await fetchResolvedHazardById(hazardId);

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col overflow-x-hidden bg-gradient-to-b from-emerald-50 via-white to-zinc-50 font-sans">
        <main className="mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm break-words text-red-700"
          >
            {error}
          </p>
        </main>
      </div>
    );
  }

  if (!hazard) {
    notFound();
  }

  const submissionImageUrl = buildSubmissionImageUrl(hazard, supabaseUrl);
  const resolutionImageUrl = buildResolutionImageUrl(hazard, supabaseUrl);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-gradient-to-b from-emerald-50 via-white to-zinc-50 font-sans">
      <main className="mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] sm:px-6 sm:py-10">
        <Link
          href="/hazards/resolved"
          className="mb-6 inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-xl px-3 text-base font-medium text-emerald-700 transition-colors hover:bg-emerald-50 active:bg-emerald-100"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back to List
        </Link>

        <header className="mb-6">
          <h1 className="text-balance break-words text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            {hazard.hazardId}
          </h1>
          <p className="mt-2 text-base leading-relaxed text-pretty text-zinc-600">
            Resolved hazard details
          </p>
        </header>

        <ResolvedHazardDetail
          hazard={hazard}
          submissionImageUrl={submissionImageUrl}
          resolutionImageUrl={resolutionImageUrl}
          supabaseUrl={supabaseUrl}
        />
      </main>
    </div>
  );
}
