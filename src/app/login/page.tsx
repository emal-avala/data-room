"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import { appendNextPath, sanitizeNextPath, withInheritedHash } from "@/lib/next-path";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

type AuthState = "checking" | "unauthenticated" | "authenticated" | "pending-review";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isConfigured = isSupabaseConfigured();
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [inheritedHash] = useState(() =>
    typeof window === "undefined" ? "" : window.location.hash,
  );
  const [error, setError] = useState<string | null>(null);

  const nextPath = withInheritedHash(
    sanitizeNextPath(searchParams.get("next")),
    inheritedHash,
  );

  const checkAccess = useCallback(async () => {
    if (!isConfigured) {
      setAuthState("unauthenticated");
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setAuthState("unauthenticated");
      return;
    }
    const timeout = window.setTimeout(() => setAuthState("unauthenticated"), 4000);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) {
        setAuthState("unauthenticated");
        return;
      }
      setUserEmail(user.email);
      const response = await fetch("/api/access");
      if (!response.ok) {
        setAuthState("pending-review");
        return;
      }
      const body = (await response.json()) as { status?: string };
      if (body.status === "approved") {
        setAuthState("authenticated");
      } else {
        setAuthState("pending-review");
      }
    } catch {
      setAuthState("unauthenticated");
    } finally {
      window.clearTimeout(timeout);
    }
  }, [isConfigured]);

  useEffect(() => {
    void checkAccess();
  }, [checkAccess]);

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError === "auth_expired") {
      setError("That sign-in link expired. Try again.");
    } else if (oauthError === "access_denied") {
      setError("Sign-in was cancelled.");
    } else if (oauthError === "auth_failed") {
      setError("Sign-in failed. Try again.");
    }
  }, [searchParams]);

  async function signIn(provider: "google" | "azure") {
    const supabase = createClient();
    if (!supabase) return;
    const redirectTo = `${window.location.origin}${appendNextPath("/auth/callback", nextPath)}`;
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
  }

  if (authState === "checking") {
    return <p className="text-sm text-muted-foreground">Checking session…</p>;
  }

  if (authState === "authenticated") {
    return (
      <div className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Identity verified
        </p>
        <p className="text-sm">{userEmail}</p>
        <Button onClick={() => router.push(nextPath ?? "/")}>Enter the data room</Button>
      </div>
    );
  }

  if (authState === "pending-review") {
    return (
      <div className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Access pending
        </p>
        <p className="text-sm">
          {userEmail} is signed in. An admin still needs to approve this address.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push(appendNextPath("/pending-approval", nextPath))}
        >
          Request access
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Secure channel
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="text-sm text-muted-foreground">
        Approved investors only. Use the account you were invited with.
      </p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!isConfigured ? (
        <p className="text-sm text-muted-foreground">
          Supabase is not configured. Set the keys in <code>.env.local</code> — localhost
          already bypasses the gate so you can explore the UI.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <Button onClick={() => void signIn("google")}>Continue with Google</Button>
          <Button variant="outline" onClick={() => void signIn("azure")}>
            Continue with Microsoft
          </Button>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="mb-8 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {siteConfig.companyName} · {siteConfig.roundLabel}
      </p>
      <div className="container-box p-8">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
