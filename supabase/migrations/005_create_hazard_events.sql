-- Migration: 005_create_hazard_events
-- Append-only audit/analytics event log.

CREATE TABLE IF NOT EXISTS public.hazard_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_uuid uuid NOT NULL REFERENCES public.hazards (id) ON DELETE RESTRICT,
  hazard_id text NOT NULL,
  event_type text NOT NULL
    CHECK (event_type IN (
      'submitted',
      'marked_in_progress',
      'progress_updated',
      'resolved'
    )),
  event_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb
);

CREATE INDEX IF NOT EXISTS idx_hazard_events_type_at
  ON public.hazard_events (event_type, event_at DESC);

CREATE INDEX IF NOT EXISTS idx_hazard_events_hazard_uuid
  ON public.hazard_events (hazard_uuid, event_at ASC);

CREATE INDEX IF NOT EXISTS idx_hazard_events_hazard_id
  ON public.hazard_events (hazard_id);

COMMENT ON TABLE public.hazard_events IS
  'Append-only audit trail for analytics and operational history.';
