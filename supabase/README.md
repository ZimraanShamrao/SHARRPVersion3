# Campus Hazard — Supabase Backend

Infrastructure-as-code for the Campus Hazard ecosystem database, RLS policies, storage buckets, and seed data.

A brand-new Supabase project can be fully reconstructed from these migration files without manual Dashboard configuration.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed (`npm install -g supabase` or `npx supabase`)
- A Supabase account
- Node.js (for the application layer; not required to run migrations alone)

## Migration order

Migrations run in lexical order. Do not reorder files.

| # | File | Purpose |
|---|------|---------|
| 1 | `001_create_student_ids.sql` | Student ID validation table |
| 2 | `002_create_hazard_id_counter.sql` | Atomic HZ-0001 ID counter |
| 3 | `003_create_hazards.sql` | Primary hazard records |
| 4 | `004_create_maintenance_updates.sql` | Append-only maintenance history |
| 5 | `005_create_hazard_events.sql` | Audit/analytics event log |
| 6 | `006_create_functions.sql` | `generate_hazard_id`, `next_progress_number`, `set_hazards_updated_at` |
| 7 | `007_create_triggers.sql` | Auto-update `hazards.updated_at` |
| 8 | `008_rls_policies.sql` | RLS enablement, read/deny policies, function grants |
| 9 | `009_storage_buckets.sql` | Three image buckets + storage policies |
| 10 | `010_seed_data.sql` | Counter init + sample student IDs (optional) |

## Option A — New remote Supabase project (recommended)

### 1. Create a project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project and wait for provisioning to finish

### 2. Link the CLI to your project

From the repository root:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

Find `YOUR_PROJECT_REF` in Dashboard → Project Settings → General.

### 3. Apply all migrations

```bash
npx supabase db push
```

This applies every file in `supabase/migrations/` to the linked remote project.

### 4. Configure application environment variables

In the repo root `.env.local` (never commit this file):

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Copy keys from Dashboard → Project Settings → API.

Run `npm run sync-env` or `npm run dev` to propagate env vars to apps.

---

## Option B — Local Supabase (development)

### 1. Start local Supabase

From the repository root:

```bash
npx supabase start
```

Local migrations in `supabase/migrations/` are applied automatically on first start.

### 2. Apply migrations after changes

```bash
npx supabase db reset
```

`db reset` drops the local database, re-applies all migrations, and runs seed data.

### 3. Local API keys

After `supabase start`, the CLI prints local `anon` and `service_role` keys. Use:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<local-service-role-key>
```

---

## Seed data

Migration `010_seed_data.sql` provides:

- **Required:** `hazard_id_counter` row `(1, 0)` — needed for `generate_hazard_id()`
- **Optional:** three sample student IDs (`10000001`–`10000003`)

### Skip seed data

To deploy without sample student IDs, either:

- Delete the `INSERT INTO public.student_ids` block from `010_seed_data.sql` before pushing, or
- Create a new migration that removes test IDs after push

### Replace with CSV import

1. Apply migrations (including seed, or with student INSERT removed)
2. Dashboard → Table Editor → `student_ids` → **Import data from CSV**
3. CSV must include an `id` column (and optionally `is_active`)

---

## Verify the backend

Run these checks after migrations:

```sql
-- Counter initialized
SELECT * FROM public.hazard_id_counter;

-- Hazard ID generation
SELECT public.generate_hazard_id();

-- Buckets exist
SELECT id, public, file_size_limit FROM storage.buckets
WHERE id IN ('submission-images', 'progress-images', 'resolution-images');

-- RLS enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('student_ids', 'hazards', 'maintenance_updates', 'hazard_events', 'hazard_id_counter');
```

---

## Backend architecture summary

| Component | Configuration |
|-----------|---------------|
| Hazard IDs | `HZ-0001` format via `generate_hazard_id()` |
| Status values | `Unresolved`, `In Progress`, `Resolved` |
| Progress images | `next_progress_number(uuid)` → `HZ-0001_Progress1.jpg` |
| Public reads | `hazards`, `maintenance_updates`, storage images |
| Writes | Service role only (Server Actions) |
| Student IDs | Server-side validation only (no public SELECT) |
| Storage buckets | `submission-images`, `progress-images`, `resolution-images` |
| File limits | 10 MB, JPEG/PNG/WebP only |

---

## Creating new migrations

After changing the schema:

```bash
npx supabase migration new your_migration_name
```

Edit the generated file in `supabase/migrations/`, then:

```bash
# Local
npx supabase db reset

# Remote
npx supabase db push
```

---

## Important notes

- **Do not run migrations against the live production project** unless you intend to apply schema changes. These files document and reproduce the current schema; use a fresh project to validate full reconstruction.
- Migrations are **idempotent where possible** (`IF NOT EXISTS`, `ON CONFLICT`, `DROP IF EXISTS` + recreate for policies/triggers).
- **Secrets are not stored in this directory.** API keys belong only in `.env.local` (gitignored).
- The application reads/writes through `@campus-hazard/supabase` using the anon key (reads) and service role key (writes).

---

## Can the backend be recreated entirely from Git?

**Yes**, with one manual step: creating the Supabase project itself and setting `.env.local` API keys.

Everything else — tables, functions, triggers, RLS, storage buckets, policies, and seed data — is defined in `supabase/migrations/` and applied via `supabase db push` or `supabase start` / `supabase db reset`.
