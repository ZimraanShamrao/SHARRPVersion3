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
  submitInProgressUpdate,
  type SubmitInProgressState,
} from "@/lib/actions/submit-in-progress-update";

const initialState: SubmitInProgressState = {};

const inputClassName =
  "min-w-0 w-full max-w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 disabled:cursor-not-allowed disabled:opacity-60";

const primaryButtonClassName =
  "flex min-h-14 w-full shrink-0 items-center justify-center rounded-xl bg-slate-800 px-4 text-base font-semibold text-white shadow-md shadow-slate-800/20 transition-colors hover:bg-slate-900 active:bg-black disabled:cursor-not-allowed disabled:opacity-60 sm:px-6";

type InProgressSubmissionFormProps = {
  hazardId: string;
  detailHref: string;
  listHref?: string;
  listLabel?: string;
  successDetail?: string;
};

export function InProgressSubmissionForm({
  hazardId,
  detailHref,
  listHref = "/hazards/unresolved",
  listLabel = "Back to Unresolved List",
  successDetail,
}: InProgressSubmissionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState(
    submitInProgressUpdate,
    initialState
  );
  const [, startTransition] = useTransition();
  const [clientError, setClientError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const displayError = clientError ?? state.error;

  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
    }
  }, [state.success]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

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

  function clearSelectedImage() {
    setSelectedImage(null);
    setImagePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return null;
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function buildFormData(form: HTMLFormElement): FormData {
    const formData = new FormData(form);

    if (selectedImage) {
      formData.set("image", selectedImage);
    }

    return formData;
  }

  function validateClientForm(formData: FormData): string | null {
    const notes = formData.get("notes")?.toString().trim();

    if (!notes) {
      return "Please enter maintenance notes.";
    }

    return null;
  }

  if (showSuccess && state.hazardId) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-8 text-center sm:px-6"
      >
        <p className="text-lg font-semibold text-emerald-900">
          Progress update saved.
        </p>
        <p className="mt-2 break-words text-base text-emerald-800">
          {successDetail ?? `${state.hazardId} is now marked In Progress.`}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={listHref}
            className="flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-emerald-700 bg-white px-4 text-base font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 active:bg-emerald-200"
          >
            {listLabel}
          </Link>
          <Link
            href="/hazards"
            className="flex min-h-14 w-full items-center justify-center rounded-xl bg-emerald-700 px-4 text-base font-semibold text-white transition-colors hover:bg-emerald-800 active:bg-emerald-900"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
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
      <input type="hidden" name="hazardId" value={hazardId} />

      <div>
        <label
          htmlFor="maintenance-notes"
          className="mb-2 block text-sm font-medium text-zinc-700"
        >
          Maintenance Notes <span className="text-red-600">*</span>
        </label>
        <textarea
          id="maintenance-notes"
          name="notes"
          rows={5}
          required
          disabled={isPending}
          placeholder='e.g. "Leak source identified."'
          className={`${inputClassName} min-h-32 resize-y`}
        />
      </div>

      <div>
        <p className="mb-2 block text-sm font-medium text-zinc-700">
          Progress Image <span className="font-normal text-zinc-500">(optional)</span>
        </p>

        {imagePreviewUrl ? (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreviewUrl}
              alt="Selected progress image preview"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="flex flex-col gap-2 p-3 sm:flex-row">
              <button
                type="button"
                disabled={isPending}
                onClick={() => imageInputRef.current?.click()}
                className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 active:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Change Photo
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={clearSelectedImage}
                className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 active:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Remove Photo
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={() => imageInputRef.current?.click()}
            className="flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-white px-4 text-base font-semibold text-zinc-700 transition-colors hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Add Progress Photo
          </button>
        )}

        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="sr-only"
          onChange={handleImageChange}
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

      <button type="submit" disabled={isPending} className={primaryButtonClassName}>
        {isPending ? "Submitting…" : "Submit Progress Update"}
      </button>

      <Link
        href={detailHref}
        className="flex min-h-14 w-full shrink-0 items-center justify-center rounded-xl border-2 border-slate-800 bg-white px-4 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 active:bg-slate-100 sm:px-6"
      >
        Back to Detail
      </Link>
    </form>
  );
}
