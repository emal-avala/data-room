/**
 * Admin identity.
 *
 * The owner account is an application invariant, not a mutable database
 * setting. Keeping this check outside `admin_users` means a missing row,
 * migration failure, or accidental database edit cannot lock out the owner.
 *
 * Set SUPERADMIN_EMAIL in the environment. The fallback is the documented
 * example address and is never a production identity.
 */

export function getSuperadminEmail(): string {
  const configured = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
  return configured || "jordan@acme.example";
}

export function normalizeAdminEmail(
  email: string | null | undefined,
): string | null {
  const normalized = email?.trim().toLowerCase();
  return normalized || null;
}

export function isSuperadmin(email: string | null | undefined): boolean {
  return normalizeAdminEmail(email) === getSuperadminEmail();
}

/** Check the immutable owner account, then the database-backed admin roster. */
export async function isApprovedAdmin(
  email: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
): Promise<boolean> {
  const normalizedEmail = normalizeAdminEmail(email);
  if (!normalizedEmail) return false;
  if (isSuperadmin(normalizedEmail)) return true;

  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error) {
      console.warn("admin_users table query failed:", error.message);
      return false;
    }

    return !!data;
  } catch {
    return false;
  }
}
