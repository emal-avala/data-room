"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function NDASignatureGate({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  const [signed, setSigned] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (signed) return <>{children}</>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-eyebrow mb-3">Access control</p>
      <h1 className="text-2xl font-semibold tracking-tight">Sign the NDA to continue</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This document is gated. The signed text is stored as an append-only
        snapshot so later edits do not rewrite history.
      </p>
      <pre className="container-box mt-6 max-h-80 overflow-auto whitespace-pre-wrap p-6 text-xs leading-relaxed">
        {text}
      </pre>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <Button
        className="mt-6"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError(null);
          try {
            const response = await fetch("/api/documents/nda", { method: "POST" });
            if (!response.ok) {
              throw new Error("Could not record the signature.");
            }
            setSigned(true);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
          } finally {
            setBusy(false);
          }
        }}
      >
        I agree and sign
      </Button>
    </div>
  );
}
