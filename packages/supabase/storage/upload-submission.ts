import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  SUBMISSION_IMAGES_BUCKET,
  getSubmissionImagePath,
} from "@campus-hazard/shared";
import type { SupabaseClient } from "@supabase/supabase-js";

type UploadResult =
  | { ok: true; path: string }
  | { ok: false; error: string };

function isAllowedMimeType(type: string): boolean {
  return (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(type);
}

export async function uploadSubmissionImage(
  supabase: SupabaseClient,
  hazardId: string,
  file: File
): Promise<UploadResult> {
  if (!isAllowedMimeType(file.type)) {
    return {
      ok: false,
      error: "Please upload a JPEG, PNG, or WebP image.",
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      ok: false,
      error: "Image must be 10 MB or smaller.",
    };
  }

  const path = getSubmissionImagePath(hazardId);
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(SUBMISSION_IMAGES_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return {
      ok: false,
      error: "Unable to upload the hazard image. Please try again.",
    };
  }

  return { ok: true, path };
}
