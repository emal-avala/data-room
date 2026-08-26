import { isSupabaseConfigured } from "@/utils/supabase/config";

/**
 * True only when admin APIs can open a service-role client.
 *
 * Public URL + anon key is not enough: charts read through the service
 * role. Placeholder values from `.env.example` count as unconfigured.
 */
export function isAdminBackendConfigured(): boolean {
  if (!isSupabaseConfigured()) return false;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  if (!key) return false;
  return !/YOUR_SERVICE|changeme/i.test(key);
}
