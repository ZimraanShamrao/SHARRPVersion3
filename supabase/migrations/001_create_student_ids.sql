-- Migration: 001_create_student_ids
-- Validates student access for hazard reporting. No other student PII is stored.

CREATE TABLE IF NOT EXISTS public.student_ids (
  id text PRIMARY KEY,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.student_ids IS
  'College-issued student IDs allowed to submit hazard reports.';
