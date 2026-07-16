"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  validateStudentId,
  type ValidateStudentIdState,
} from "@/lib/actions/validate-student-id";

const initialState: ValidateStudentIdState = {};

export default function ValidateStudentPage() {
  const [state, formAction, isPending] = useActionState(
    validateStudentId,
    initialState
  );
  const [clientError, setClientError] = useState<string | null>(null);

  const displayError = clientError ?? state.error;

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

        <header className="mb-10 text-center">
          <h1 className="text-balance break-words text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Student ID Validation
          </h1>
          <p className="mt-3 text-base leading-relaxed text-pretty text-zinc-600">
            Enter your Student ID to report a campus hazard.
          </p>
        </header>

        <form
          action={formAction}
          className="flex min-w-0 flex-col gap-5"
          noValidate
          onSubmit={(event) => {
            const formData = new FormData(event.currentTarget);
            const studentId = formData.get("studentId")?.toString().trim() ?? "";

            if (!studentId) {
              event.preventDefault();
              setClientError("Please enter your Student ID.");
              return;
            }

            setClientError(null);
          }}
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="studentId"
              className="text-sm font-medium text-zinc-700"
            >
              Student ID
            </label>
            <input
              id="studentId"
              name="studentId"
              type="text"
              autoComplete="off"
              inputMode="text"
              disabled={isPending}
              className="h-14 min-w-0 w-full max-w-full rounded-xl border border-zinc-300 bg-white px-4 text-base text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Enter your Student ID"
            />
          </div>

          {displayError ? (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm break-words text-red-700"
            >
              {displayError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="flex min-h-14 w-full shrink-0 items-center justify-center rounded-xl bg-emerald-600 px-4 text-base font-semibold text-white shadow-md shadow-emerald-600/20 transition-colors hover:bg-emerald-700 active:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6"
          >
            {isPending ? "Validating…" : "Validate"}
          </button>
        </form>
      </main>
    </div>
  );
}
