-- Migration: 004_create_maintenance_updates
-- Append-only maintenance history for In Progress workflow updates.

CREATE TABLE IF NOT EXISTS public.maintenance_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_uuid uuid NOT NULL REFERENCES public.hazards (id) ON DELETE RESTRICT,
  hazard_id text NOT NULL,
  progress_number integer NOT NULL,
  notes text NOT NULL,
  progress_image_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (hazard_uuid, progress_number)
);

CREATE INDEX IF NOT EXISTS idx_maintenance_hazard_created
  ON public.maintenance_updates (hazard_uuid, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_maintenance_hazard_id
  ON public.maintenance_updates (hazard_id);

COMMENT ON TABLE public.maintenance_updates IS
  'Append-only log of maintenance progress notes and optional progress images.';

COMMENT ON COLUMN public.maintenance_updates.progress_number IS
  'Sequential number per hazard, used for HZ-0001_Progress1.jpg naming.';

COMMENT ON COLUMN public.maintenance_updates.progress_image_path IS
  'Path in progress-images bucket when an image was uploaded.';
