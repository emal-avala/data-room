"use client";

import { useEffect, useState } from "react";

export default function EventsPage() {
  const [rows, setRows] = useState<Array<{ id: string; type: string; path: string }>>([]);
  useEffect(() => {
    void fetch("/api/admin/analytics/events")
      .then((r) => r.json())
      .then((body) => setRows(body.events ?? []));
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Events</h1>
      <ul className="mt-6 container-box divide-y divide-border">
        {rows.length === 0 ? (
          <li className="p-6 text-sm text-muted-foreground">No events.</li>
        ) : (
          rows.map((row) => (
            <li key={row.id} className="p-4 text-sm">
              {row.type} · {row.path}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
