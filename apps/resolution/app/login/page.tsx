"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import {
  adminLogin,
  type AdminLoginState,
} from "@/lib/actions/admin-login";

const initialState: AdminLoginState = {};

const inputClassName =
  "h-14 w-full rounded-xl border border-zinc-300 bg-white px-4 text-base text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 disabled:cursor-not-allowed disabled:opacity-60";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(
    adminLogin,
    initialState
  );
  const [, startTransition] = useTransition();
  const [clientError, setClientError] = useState<string | null>(null);

  const displayError = clientError ?? state.error;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-zinc-50 font-sans">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <Link
          href="/"
          className="mb-8 inline-flex h-12 items-center gap-2 self-start rounded-xl px-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200"
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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Admin Login
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            Enter your administrator credentials to continue.
          </p>
        </header>

        <form
          className="flex flex-col gap-5"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);
            const username = formData.get("username")?.toString().trim() ?? "";
            const password = formData.get("password")?.toString() ?? "";

            if (!username || !password) {
              setClientError("Please enter both username and password.");
              return;
            }

            setClientError(null);
            startTransition(() => {
              formAction(formData);
            });
          }}
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-zinc-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              disabled={isPending}
              className={inputClassName}
              placeholder="Enter username"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              disabled={isPending}
              className={inputClassName}
              placeholder="Enter password"
            />
          </div>

          {displayError ? (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {displayError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-slate-800 px-6 text-base font-semibold text-white shadow-md shadow-slate-800/20 transition-colors hover:bg-slate-900 active:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Signing in…" : "Login"}
          </button>
        </form>
      </main>
    </div>
  );
}
