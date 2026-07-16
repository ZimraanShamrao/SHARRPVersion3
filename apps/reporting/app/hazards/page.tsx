import Link from "next/link";

export default function HazardListStatusPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 via-white to-zinc-50 font-sans">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <Link
          href="/"
          className="mb-8 inline-flex h-12 items-center gap-2 self-start rounded-xl px-3 text-base font-medium text-emerald-700 transition-colors hover:bg-emerald-50 active:bg-emerald-100"
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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Hazard List &amp; Status
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            View hazards by their current status.
          </p>
        </header>

        <nav aria-label="Hazard status lists" className="flex flex-col gap-4">
          <button
            type="button"
            className="flex h-14 w-full items-center justify-center rounded-xl bg-emerald-600 px-6 text-base font-semibold text-white shadow-md shadow-emerald-600/20 transition-colors hover:bg-emerald-700 active:bg-emerald-800"
          >
            Unresolved Hazards
          </button>
          <button
            type="button"
            className="flex h-14 w-full items-center justify-center rounded-xl border-2 border-emerald-600 bg-white px-6 text-base font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 active:bg-emerald-100"
          >
            In Progress Hazards
          </button>
          <button
            type="button"
            className="flex h-14 w-full items-center justify-center rounded-xl border-2 border-zinc-300 bg-white px-6 text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 active:bg-zinc-100"
          >
            Resolved Hazards
          </button>
        </nav>
      </main>
    </div>
  );
}
