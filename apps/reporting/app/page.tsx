import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 via-white to-zinc-50 font-sans">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <header className="mb-14 text-center">
          <div
            aria-hidden="true"
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/20"
          >
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Campus Hazard Reporting
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Report hazards on campus and check the status of existing reports.
          </p>
        </header>

        <nav
          aria-label="Main navigation"
          className="flex flex-col gap-4"
        >
          <Link
            href="/report/validate"
            className="flex h-14 w-full items-center justify-center rounded-xl bg-emerald-600 px-6 text-base font-semibold text-white shadow-md shadow-emerald-600/20 transition-colors hover:bg-emerald-700 active:bg-emerald-800"
          >
            Report a Hazard
          </Link>
          <Link
            href="/hazards"
            className="flex h-14 w-full items-center justify-center rounded-xl border-2 border-emerald-600 bg-white px-6 text-base font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 active:bg-emerald-100"
          >
            Hazard List & Status
          </Link>
        </nav>
      </main>
    </div>
  );
}
