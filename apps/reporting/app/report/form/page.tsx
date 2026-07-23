"use client";

import Link from "next/link";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
} from "react";
import {
  submitHazard,
  type SubmitHazardState,
} from "@/lib/actions/submit-hazard";

const initialState: SubmitHazardState = {};

const RESET_DELAY_MS = 20_000;
const RESET_DELAY_SECONDS = RESET_DELAY_MS / 1000;

const inputClassName =
  "min-w-0 w-full max-w-full rounded-xl border border-zinc-300 bg-white px-4 text-base text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60";

export default function ReportFormPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState(
    submitHazard,
    initialState
  );
  const [, startTransition] = useTransition();
  const [clientError, setClientError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [successHazardId, setSuccessHazardId] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(RESET_DELAY_SECONDS);

  const displayError = clientError ?? state.error;
  const showSuccess = successHazardId !== null;

  useEffect(() => {
    if (state.success && state.hazardId) {
      setSuccessHazardId(state.hazardId);
    }
  }, [state.success, state.hazardId]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    if (!successHazardId) {
      return;
    }

    setSecondsRemaining(RESET_DELAY_SECONDS);

    const timeoutId = window.setTimeout(() => {
      formRef.current?.reset();
      setSelectedImage(null);
      setImagePreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }
        return null;
      });
      setClientError(null);
      setSuccessHazardId(null);
    }, RESET_DELAY_MS);

    const intervalId = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [successHazardId]);

  function setFormImage(file: File) {
    setSelectedImage(file);
    setImagePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return URL.createObjectURL(file);
    });
    setClientError(null);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFormImage(file);
  }

  function buildFormData(form: HTMLFormElement): FormData {
    const formData = new FormData(form);

    if (selectedImage) {
      formData.set("image", selectedImage);
    }

    return formData;
  }

  function validateClientForm(formData: FormData): string | null {
    const image = formData.get("image");
    const shortDescription = formData
      .get("shortDescription")
      ?.toString()
      .trim();
    const location = formData.get("location")?.toString().trim();

    if (!(image instanceof File) || image.size === 0) {
      return "Please upload a hazard image.";
    }

    if (!shortDescription) {
      return "Please describe the hazard in one short sentence.";
    }

    if (!location) {
      return "Please provide the location of the hazard.";
    }

    return null;
  }

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-gradient-to-b from-emerald-50 via-white to-zinc-50 font-sans">
      <main className="mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] sm:px-6 sm:py-10">
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

        <header className="mb-8 text-center">
          <h1 className="text-balance break-words text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Report a Hazard
          </h1>
          <p className="mt-3 text-base leading-relaxed text-pretty text-zinc-600">
            Submit a photo and details about the hazard you observed.
          </p>
        </header>

        {showSuccess ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-8 text-center sm:px-6"
          >
            <p className="text-lg font-semibold text-emerald-900">
              Thank you for your submission.
            </p>
            <p className="mt-2 break-words text-base text-emerald-800">
              Hazard ID: {successHazardId}
            </p>
            <p className="mt-2 text-base font-bold text-pretty text-red-600">
              Save your Hazard ID so that you can use it to search for and verify
              the status of your hazard.
            </p>
            <p className="mt-4 text-sm text-pretty text-emerald-700">
              This form will reset in {secondsRemaining}{" "}
              {secondsRemaining === 1 ? "second" : "seconds"} so you can submit
              another report.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            className="flex min-w-0 flex-col gap-5"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();

              const formData = buildFormData(event.currentTarget);
              const validationError = validateClientForm(formData);

              if (validationError) {
                setClientError(validationError);
                return;
              }

              setClientError(null);
              startTransition(() => {
                formAction(formData);
              });
            }}
          >
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-zinc-700">Image Upload</h2>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex min-h-14 w-full shrink-0 items-center justify-center rounded-xl border-2 border-emerald-600 bg-white px-4 text-base font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 active:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Take Photo
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex min-h-14 w-full shrink-0 items-center justify-center rounded-xl border-2 border-zinc-300 bg-white px-4 text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 active:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Choose from Gallery
                </button>
              </div>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                capture="environment"
                className="hidden"
                disabled={isPending}
                onChange={handleImageChange}
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                disabled={isPending}
                onChange={handleImageChange}
              />

              {selectedImage ? (
                <p className="break-all text-sm text-zinc-600">
                  Selected: {selectedImage.name}
                </p>
              ) : (
                <p className="text-sm text-zinc-500">
                  No image selected yet.
                </p>
              )}

              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Selected hazard preview"
                  className="max-h-64 w-full max-w-full rounded-xl border border-zinc-200 object-cover"
                />
              ) : null}
            </section>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="shortDescription"
                className="text-sm font-medium text-zinc-700"
              >
                Describe the hazard in one short sentence
              </label>
              <input
                id="shortDescription"
                name="shortDescription"
                type="text"
                disabled={isPending}
                className={`${inputClassName} h-14`}
                placeholder="e.g. Water leak in the hallway"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="detailedDescription"
                className="text-sm font-medium text-zinc-700"
              >
                Please provide any additional details about the hazard
              </label>
              <textarea
                id="detailedDescription"
                name="detailedDescription"
                rows={4}
                disabled={isPending}
                className={`${inputClassName} resize-y py-3`}
                placeholder="Optional additional information"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="location"
                className="text-sm font-medium text-zinc-700"
              >
                Provide the location (be specific)
              </label>
              <input
                id="location"
                name="location"
                type="text"
                disabled={isPending}
                className={`${inputClassName} h-14`}
                placeholder="e.g. Building A, 2nd floor, Room 204"
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
              {isPending ? "Submitting…" : "Submit"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
