"use client";

import { useEffect, useState } from "react";

export default function SessionsPage() {
  const [rows, setRows] = useState<Array<{ id: string; email: string; path: string }>>([]);
  useEffect(() => {
    void fetch("/api/admin/analytics/sessions")
      .then((r) => r.json())
      .then((body) => setRows(body.sessions ?? []));
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Sessions</h1>
      <ul className="mt-6 container-box divide-y divide-border">
        {rows.length === 0 ? (
          <li className="p-6 text-sm text-muted-foreground">No sessions.</li>
        ) : (
          rows.map((row) => (
            <li key={row.id} className="p-4 text-sm">
              {row.email} · {row.path}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
