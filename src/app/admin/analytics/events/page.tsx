"use client";

import { useEffect, useState } from "react";

type EventRow = {
  id: string;
  type: string;
  path: string;
  email?: string | null;
  firm?: string | null;
  created_at?: string;
};

export default function EventsPage() {
  const [rows, setRows] = useState<EventRow[]>([]);
  useEffect(() => {
    void fetch("/api/admin/analytics/events")
      .then((r) => r.json())
      .then((body) => setRows(body.events ?? []));
  }, []);
  return (
    <div>
      <p className="text-eyebrow">Analytics</p>
      <h1 className="text-2xl font-semibold">Events</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Page views, document opens, NDA accepts, and downloads.
      </p>
      <table className="mt-6 container-box">
        <thead>
          <tr>
            <th>Event</th>
            <th>Path</th>
            <th>Viewer</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-6 text-sm text-muted-foreground">
                No events.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td>{row.type}</td>
                <td className="text-muted-foreground">{row.path}</td>
                <td>
                  {row.email ?? "—"}
                  {row.firm ? <span className="text-muted-foreground"> · {row.firm}</span> : null}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
