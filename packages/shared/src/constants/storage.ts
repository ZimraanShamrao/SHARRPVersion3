export const SUBMISSION_IMAGES_BUCKET = "submission-images";
export const PROGRESS_IMAGES_BUCKET = "progress-images";
export const RESOLUTION_IMAGES_BUCKET = "resolution-images";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export function getSubmissionImagePath(hazardId: string): string {
  return `${hazardId}_Submission.jpg`;
}

export function getProgressImagePath(
  hazardId: string,
  progressNumber: number
): string {
  return `${hazardId}_Progress${progressNumber}.jpg`;
}

export function getResolutionImagePath(hazardId: string): string {
  return `${hazardId}_Resolution.jpg`;
}

export function getStoragePublicUrl(
  supabaseUrl: string,
  bucket: string,
  path: string
): string {
  const base = supabaseUrl.replace(/\/$/, "");
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${base}/storage/v1/object/public/${bucket}/${encodedPath}`;
}
