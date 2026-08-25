"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { sanitizeNextPath } from "@/lib/next-path";

function PendingContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const nextPath = sanitizeNextPath(searchParams.get("next"));
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function requestAccess() {
    const response = await fetch("/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestedPath: nextPath }),
    });
    setStatus(response.ok ? "sent" : "error");
  }

  return (
    <div className="space-y-4">
      <p className="text-eyebrow">Waitlist</p>
      <h1 className="text-2xl font-semibold tracking-tight">Request access</h1>
      <p className="text-sm text-muted-foreground">
        {email || "Your signed-in address"} is not on the approved list yet.
        Submit a request and {siteConfig.companyName} IR will review it.
      </p>
      {status === "sent" ? (
        <p className="text-sm">Request sent. You will get an email when it is approved.</p>
      ) : (
        <Button onClick={() => void requestAccess()}>Request access</Button>
      )}
      {status === "error" ? (
        <p className="text-sm text-red-600">Could not submit the request. Try again.</p>
      ) : null}
    </div>
  );
}

export default function PendingApprovalPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="container-box p-8">
        <Suspense fallback={<p>Loading…</p>}>
          <PendingContent />
        </Suspense>
      </div>
    </div>
  );
}
