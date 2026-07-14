-- Migration: 002_create_hazard_id_counter
-- Single-row counter for atomic HZ-0001 hazard ID generation.

CREATE TABLE IF NOT EXISTS public.hazard_id_counter (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  last_value integer NOT NULL DEFAULT 0
);

COMMENT ON TABLE public.hazard_id_counter IS
  'Single-row sequence backing generate_hazard_id().';
