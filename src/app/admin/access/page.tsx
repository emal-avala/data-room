"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type RequestRow = {
  id: string;
  email: string;
  firm?: string;
  status: string;
  requested_at: string;
  requested_path: string | null;
};

export default function AccessAdminPage() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [demo, setDemo] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/access");
    if (response.ok) {
      const body = await response.json();
      setRows(body.requests ?? []);
      setDemo(Boolean(body.demo));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function patch(id: string, status: "approved" | "rejected") {
    await fetch("/api/admin/access", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Access requests</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Approve a verified email to release the waitlist. The original deep
        link is preserved on the row.
        {demo ? " Sample queue — approvals are not persisted." : ""}
      </p>
      <div className="mt-8 divide-y divide-border container-box">
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No requests.</p>
        ) : (
          rows.map((row) => (
            <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-medium">{row.email}</p>
                <p className="text-xs text-muted-foreground">
                  {row.firm ? `${row.firm} · ` : ""}
                  {row.status}
                  {row.requested_path ? ` · ${row.requested_path}` : ""}
                </p>
              </div>
              {row.status === "pending" && !demo ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => void patch(row.id, "approved")}>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void patch(row.id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
