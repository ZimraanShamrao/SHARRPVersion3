-- Migration: 007_create_triggers

DROP TRIGGER IF EXISTS hazards_set_updated_at ON public.hazards;

CREATE TRIGGER hazards_set_updated_at
  BEFORE UPDATE ON public.hazards
  FOR EACH ROW
  EXECUTE FUNCTION public.set_hazards_updated_at();

COMMENT ON TRIGGER hazards_set_updated_at ON public.hazards IS
  'Automatically updates hazards.updated_at on every row update.';
