-- Migration: 006_create_functions
-- Database functions for hazard ID generation and progress numbering.

-- Atomically increments hazard_id_counter and returns e.g. 'HZ-0001'.
CREATE OR REPLACE FUNCTION public.generate_hazard_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_value integer;
BEGIN
  UPDATE public.hazard_id_counter
  SET last_value = last_value + 1
  WHERE id = 1
  RETURNING last_value INTO new_value;

  IF new_value IS NULL THEN
    RAISE EXCEPTION
      'hazard_id_counter is not initialized. Run migration 010_seed_data.sql or insert row (1, 0).';
  END IF;

  RETURN 'HZ-' || lpad(new_value::text, 4, '0');
END;
$$;

COMMENT ON FUNCTION public.generate_hazard_id() IS
  'Returns the next unique hazard ID in HZ-0001 format. Call within a transaction before inserting into hazards.';

-- Returns the next progress sequence number for a hazard (1, 2, 3, ...).
CREATE OR REPLACE FUNCTION public.next_progress_number(p_hazard_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num integer;
BEGIN
  IF p_hazard_uuid IS NULL THEN
    RAISE EXCEPTION 'p_hazard_uuid cannot be null';
  END IF;

  -- Serialize progress updates for the same hazard.
  PERFORM 1
  FROM public.hazards
  WHERE id = p_hazard_uuid
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Hazard not found for uuid: %', p_hazard_uuid;
  END IF;

  SELECT COALESCE(MAX(progress_number), 0) + 1
  INTO next_num
  FROM public.maintenance_updates
  WHERE hazard_uuid = p_hazard_uuid;

  RETURN next_num;
END;
$$;

COMMENT ON FUNCTION public.next_progress_number(uuid) IS
  'Returns the next progress_number for maintenance_updates (used for HZ-0001_Progress1.jpg naming).';

-- Trigger function: automatically sets hazards.updated_at on UPDATE.
CREATE OR REPLACE FUNCTION public.set_hazards_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_hazards_updated_at() IS
  'BEFORE UPDATE trigger function that refreshes hazards.updated_at.';
