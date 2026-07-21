import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  PROGRESS_IMAGES_BUCKET,
  getProgressImagePath,
} from "@campus-hazard/shared";
import type { SupabaseClient } from "@supabase/supabase-js";

type UploadResult =
  | { ok: true; path: string }
  | { ok: false; error: string };

function isAllowedMimeType(type: string): boolean {
  return (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(type);
}

export async function uploadProgressImage(
  supabase: SupabaseClient,
  hazardId: string,
  progressNumber: number,
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

  const path = getProgressImagePath(hazardId, progressNumber);
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(PROGRESS_IMAGES_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return {
      ok: false,
      error: "Unable to upload the progress image. Please try again.",
    };
  }

  return { ok: true, path };
}
