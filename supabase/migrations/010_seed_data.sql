-- Migration: 010_seed_data
-- Optional development seed data.
--
-- This migration is safe to skip or replace in production.
-- Replace sample student IDs with a CSV import via Supabase Dashboard:
--   Table Editor → student_ids → Import CSV

-- Initialize hazard ID counter (required for generate_hazard_id()).
INSERT INTO public.hazard_id_counter (id, last_value)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Sample student IDs for local development and testing.
-- Remove or replace these before production deployment.
INSERT INTO public.student_ids (id)
VALUES
  ('10000001'),
  ('10000002'),
  ('10000003')
ON CONFLICT (id) DO NOTHING;
