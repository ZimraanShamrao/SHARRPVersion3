-- Migration: 008_rls_policies
-- Row Level Security strategy:
--   • anon / authenticated → read-only on public hazard data
--   • anon / authenticated → no direct access to student_ids, hazard_events, hazard_id_counter
--   • All writes → Server Actions using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)

-- -----------------------------------------------------------------------------
-- 1. Enable RLS on all tables
-- -----------------------------------------------------------------------------
ALTER TABLE public.student_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hazard_id_counter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hazards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hazard_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.student_ids FORCE ROW LEVEL SECURITY;
ALTER TABLE public.hazard_id_counter FORCE ROW LEVEL SECURITY;
ALTER TABLE public.hazards FORCE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_updates FORCE ROW LEVEL SECURITY;
ALTER TABLE public.hazard_events FORCE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 2. Drop existing policies (idempotent re-run)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read hazards" ON public.hazards;
DROP POLICY IF EXISTS "Public read maintenance updates" ON public.maintenance_updates;

DROP POLICY IF EXISTS "Deny anon insert hazards" ON public.hazards;
DROP POLICY IF EXISTS "Deny anon update hazards" ON public.hazards;
DROP POLICY IF EXISTS "Deny anon delete hazards" ON public.hazards;

DROP POLICY IF EXISTS "Deny anon insert maintenance updates" ON public.maintenance_updates;
DROP POLICY IF EXISTS "Deny anon update maintenance updates" ON public.maintenance_updates;
DROP POLICY IF EXISTS "Deny anon delete maintenance updates" ON public.maintenance_updates;

DROP POLICY IF EXISTS "Deny public student_ids access" ON public.student_ids;
DROP POLICY IF EXISTS "Deny public hazard_events access" ON public.hazard_events;
DROP POLICY IF EXISTS "Deny public hazard_id_counter access" ON public.hazard_id_counter;

-- -----------------------------------------------------------------------------
-- 3. hazards — public read-only
-- -----------------------------------------------------------------------------
CREATE POLICY "Public read hazards"
ON public.hazards
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Deny anon insert hazards"
ON public.hazards
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny anon update hazards"
ON public.hazards
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny anon delete hazards"
ON public.hazards
FOR DELETE
TO anon, authenticated
USING (false);

-- -----------------------------------------------------------------------------
-- 4. maintenance_updates — public read-only
-- -----------------------------------------------------------------------------
CREATE POLICY "Public read maintenance updates"
ON public.maintenance_updates
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Deny anon insert maintenance updates"
ON public.maintenance_updates
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny anon update maintenance updates"
ON public.maintenance_updates
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny anon delete maintenance updates"
ON public.maintenance_updates
FOR DELETE
TO anon, authenticated
USING (false);

-- -----------------------------------------------------------------------------
-- 5. student_ids — no public access
-- -----------------------------------------------------------------------------
CREATE POLICY "Deny public student_ids access"
ON public.student_ids
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- -----------------------------------------------------------------------------
-- 6. hazard_events — no public access
-- -----------------------------------------------------------------------------
CREATE POLICY "Deny public hazard_events access"
ON public.hazard_events
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- -----------------------------------------------------------------------------
-- 7. hazard_id_counter — no public access
-- -----------------------------------------------------------------------------
CREATE POLICY "Deny public hazard_id_counter access"
ON public.hazard_id_counter
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- -----------------------------------------------------------------------------
-- 8. Restrict database functions to server-side use only
-- -----------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.generate_hazard_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.next_progress_number(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.generate_hazard_id() TO service_role;
GRANT EXECUTE ON FUNCTION public.next_progress_number(uuid) TO service_role;

-- service_role bypasses RLS; table grants ensure explicit server access.
GRANT SELECT, INSERT, UPDATE ON public.student_ids TO service_role;
GRANT SELECT, UPDATE ON public.hazard_id_counter TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.hazards TO service_role;
GRANT SELECT, INSERT ON public.maintenance_updates TO service_role;
GRANT SELECT, INSERT ON public.hazard_events TO service_role;

GRANT SELECT ON public.hazards TO anon, authenticated;
GRANT SELECT ON public.maintenance_updates TO anon, authenticated;
