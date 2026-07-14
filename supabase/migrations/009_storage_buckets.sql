-- Migration: 009_storage_buckets
-- Three image buckets with public read and client write restrictions.
--
--   submission-images  → {HazardId}_Submission.jpg
--   progress-images    → {HazardId}_Progress#.jpg
--   resolution-images  → {HazardId}_Resolution.jpg

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'submission-images',
    'submission-images',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  ),
  (
    'progress-images',
    'progress-images',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  ),
  (
    'resolution-images',
    'resolution-images',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  )
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- -----------------------------------------------------------------------------
-- Drop existing storage policies (idempotent re-run)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read hazard images" ON storage.objects;
DROP POLICY IF EXISTS "Deny public insert hazard images" ON storage.objects;
DROP POLICY IF EXISTS "Deny public update hazard images" ON storage.objects;
DROP POLICY IF EXISTS "Deny public delete hazard images" ON storage.objects;

-- -----------------------------------------------------------------------------
-- Public read access (all three buckets)
-- -----------------------------------------------------------------------------
CREATE POLICY "Public read hazard images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id IN (
    'submission-images',
    'progress-images',
    'resolution-images'
  )
);

-- -----------------------------------------------------------------------------
-- Block client-side writes (anon + authenticated)
-- Uploads are performed only via Server Actions using service_role.
-- -----------------------------------------------------------------------------
CREATE POLICY "Deny public insert hazard images"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id IN (
    'submission-images',
    'progress-images',
    'resolution-images'
  )
  AND false
);

CREATE POLICY "Deny public update hazard images"
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (
  bucket_id IN (
    'submission-images',
    'progress-images',
    'resolution-images'
  )
  AND false
)
WITH CHECK (
  bucket_id IN (
    'submission-images',
    'progress-images',
    'resolution-images'
  )
  AND false
);

CREATE POLICY "Deny public delete hazard images"
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (
  bucket_id IN (
    'submission-images',
    'progress-images',
    'resolution-images'
  )
  AND false
);
