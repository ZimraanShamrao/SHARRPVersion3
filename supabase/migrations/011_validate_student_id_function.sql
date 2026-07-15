-- Migration: 011_validate_student_id_function
-- Server-side student ID validation via SECURITY DEFINER RPC.
-- Mirrors generate_hazard_id(): callable only by service_role, no direct table SELECT needed.

CREATE OR REPLACE FUNCTION public.validate_student_id(p_student_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_student_id IS NULL OR btrim(p_student_id) = '' THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.student_ids
    WHERE id = btrim(p_student_id)
      AND is_active = true
  );
END;
$$;

COMMENT ON FUNCTION public.validate_student_id(text) IS
  'Returns true when the student ID exists and is active. Server-side validation only.';

REVOKE ALL ON FUNCTION public.validate_student_id(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_student_id(text) TO service_role;
