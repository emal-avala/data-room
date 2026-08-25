/**
 * Shared Supabase env checks. Placeholder values from `.env.example` must
 * not be treated as a live project — that hangs `getSession()` / `getUser()`.
 */

const PLACEHOLDER = /YOUR_PROJECT|YOUR_ANON|YOUR_SERVICE|changeme/i;

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  if (!url || !key) return false;
  if (PLACEHOLDER.test(url) || PLACEHOLDER.test(key)) return false;
  return (
    url.startsWith("https://") ||
    url.startsWith("http://127.0.0.1") ||
    url.startsWith("http://localhost")
  );
}
