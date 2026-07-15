import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Fetch = typeof fetch;

function isOpaqueSupabaseKey(key: string): boolean {
  return key.startsWith("sb_secret_") || key.startsWith("sb_publishable_");
}

/**
 * New Supabase API keys (sb_secret_*) must be sent on the `apikey` header only.
 * supabase-js also sets `Authorization: Bearer <key>`, which PostgREST rejects
 * as an invalid JWT for non-JWT keys.
 */
function createOpaqueKeyFetch(): Fetch {
  return async (input, init) => {
    const headers = new Headers(init?.headers);
    const authorization = headers.get("Authorization");

    if (authorization?.startsWith("Bearer sb_secret_")) {
      headers.delete("Authorization");
    }

    return fetch(input, { ...init, headers });
  };
}

export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    ...(isOpaqueSupabaseKey(serviceRoleKey)
      ? { global: { fetch: createOpaqueKeyFetch() } }
      : {}),
  });
}
