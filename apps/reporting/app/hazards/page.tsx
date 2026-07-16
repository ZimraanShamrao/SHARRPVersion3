import Link from "next/link";

export default function HazardListStatusPage() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-gradient-to-b from-emerald-50 via-white to-zinc-50 font-sans">
      <main className="mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col justify-center px-4 py-12 pb-[max(3rem,env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))] sm:px-6 sm:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-xl px-3 text-base font-medium text-emerald-700 transition-colors hover:bg-emerald-50 active:bg-emerald-100"
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
          Back to Home
        </Link>

        <header className="mb-14 text-center">
          <h1 className="text-balance break-words text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Hazard List &amp; Status
          </h1>
          <p className="mt-4 text-base leading-relaxed text-pretty text-zinc-600">
            View hazards by their current status.
          </p>
        </header>

        <nav aria-label="Hazard status lists" className="flex flex-col gap-4">
          <button
            type="button"
            className="flex min-h-14 w-full shrink-0 items-center justify-center rounded-xl bg-emerald-600 px-4 text-base font-semibold text-white shadow-md shadow-emerald-600/20 transition-colors hover:bg-emerald-700 active:bg-emerald-800 sm:px-6"
          >
            Unresolved Hazards
          </button>
          <button
            type="button"
            className="flex min-h-14 w-full shrink-0 items-center justify-center rounded-xl border-2 border-emerald-600 bg-white px-4 text-base font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 active:bg-emerald-100 sm:px-6"
          >
            In Progress Hazards
          </button>
          <button
            type="button"
            className="flex min-h-14 w-full shrink-0 items-center justify-center rounded-xl border-2 border-zinc-300 bg-white px-4 text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 active:bg-zinc-100 sm:px-6"
          >
            Resolved Hazards
          </button>
        </nav>
      </main>
    </div>
  );
}
