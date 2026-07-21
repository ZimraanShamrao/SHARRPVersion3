import Link from "next/link";
import { HazardList } from "@/components/hazard-list";
import { fetchInProgressHazards } from "@/lib/queries/fetch-in-progress-hazards";

export default async function InProgressHazardsPage() {
  const { hazards, error } = await fetchInProgressHazards();

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-gradient-to-b from-emerald-50 via-white to-zinc-50 font-sans">
      <main className="mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] sm:px-6 sm:py-10">
        <Link
          href="/hazards"
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
          Back to Hazard List &amp; Status
        </Link>

        <header className="mb-6">
          <h1 className="text-balance break-words text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            In Progress Hazards
          </h1>
          <p className="mt-2 text-base leading-relaxed text-pretty text-zinc-600">
            View hazards currently being addressed, newest first.
          </p>
        </header>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm break-words text-red-700"
          >
            {error}
          </p>
        ) : (
          <HazardList
            hazards={hazards}
            searchInputId="in-progress-hazard-search"
            searchLabel="Search in progress hazards"
            emptyMessage="No in progress hazards at this time."
            detailHrefPrefix="/hazards/in-progress/"
          />
        )}
      </main>
    </div>
  );
}
