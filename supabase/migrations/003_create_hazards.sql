-- Migration: 003_create_hazards
-- Primary hazard entity. Records are permanent and never deleted.

CREATE TABLE IF NOT EXISTS public.hazards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_id text NOT NULL UNIQUE,
  short_description text NOT NULL,
  detailed_description text,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'Unresolved'
    CHECK (status IN ('Unresolved', 'In Progress', 'Resolved')),
  submission_image_path text NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  resolution_image_path text,
  resolution_notes text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hazards_status_submitted
  ON public.hazards (status, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_hazards_location
  ON public.hazards (location);

CREATE INDEX IF NOT EXISTS idx_hazards_submitted_at
  ON public.hazards (submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_hazards_resolved_at
  ON public.hazards (resolved_at)
  WHERE resolved_at IS NOT NULL;

COMMENT ON TABLE public.hazards IS
  'Campus hazard reports. Status lifecycle: Unresolved -> In Progress -> Resolved.';

COMMENT ON COLUMN public.hazards.hazard_id IS
  'Human-readable ID in HZ-0001 format.';

COMMENT ON COLUMN public.hazards.submission_image_path IS
  'Path in submission-images bucket, e.g. HZ-0001_Submission.jpg';

COMMENT ON COLUMN public.hazards.resolution_image_path IS
  'Path in resolution-images bucket, e.g. HZ-0001_Resolution.jpg';
