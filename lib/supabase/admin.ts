import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses Row Level Security.
 * Use ONLY in admin server actions / admin route handlers.
 * Never import this in client components or (site) pages.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
