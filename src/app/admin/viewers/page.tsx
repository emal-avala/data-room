"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ViewerRow = {
  id: string;
  email: string;
  firm: string | null;
  last_seen_at: string;
};

export default function ViewersPage() {
  const [rows, setRows] = useState<ViewerRow[]>([]);

  useEffect(() => {
    void fetch("/api/admin/viewers")
      .then((r) => r.json())
      .then((body) => setRows(body.viewers ?? []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Viewers</h1>
      <div className="mt-8 divide-y divide-border container-box">
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No viewers yet.</p>
        ) : (
          rows.map((row) => (
            <Link
              key={row.id}
              href={`/admin/viewers/${row.id}`}
              className="flex justify-between p-4 text-sm hover:bg-muted"
            >
              <span>{row.email}</span>
              <span className="text-muted-foreground">{row.firm ?? "—"}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
