import type { ReactNode } from "react";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#efefef]">
      <header className="border-b border-[#1f1f1f] bg-[#2b2b2b] text-white shadow-md">
        <div className="mx-auto flex w-full max-w-[1600px] items-center gap-4 px-6 py-4">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#0079c1]"
          >
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.75}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              College Hazard Analytics Dashboard
            </h1>
            <p className="mt-0.5 text-sm text-[#bdbdbd]">
              Facilities management overview
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] flex-1 bg-[#1a365d] px-6 py-6">
        {children}
      </main>
    </div>
  );
}
