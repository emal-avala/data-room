"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SessionRow = {
  id: string;
  email: string;
  firm?: string | null;
  path: string;
  started_at?: string;
  ended_at?: string | null;
  viewer_id?: string;
};

export default function SessionsPage() {
  const [rows, setRows] = useState<SessionRow[]>([]);
  useEffect(() => {
    void fetch("/api/admin/analytics/sessions")
      .then((r) => r.json())
      .then((body) => setRows(body.sessions ?? []));
  }, []);
  return (
    <div>
      <p className="text-eyebrow">Analytics</p>
      <h1 className="text-2xl font-semibold">Sessions</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Active and recent room visits. Live rows have no end time.
      </p>
      <table className="mt-6 container-box">
        <thead>
          <tr>
            <th>Viewer</th>
            <th>Firm</th>
            <th>Path</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-sm text-muted-foreground">
                No sessions.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td>
                  {row.viewer_id ? (
                    <Link href={`/admin/viewers/${row.viewer_id}`} className="hover:text-primary">
                      {row.email}
                    </Link>
                  ) : (
                    row.email
                  )}
                </td>
                <td className="text-muted-foreground">{row.firm ?? "—"}</td>
                <td>{row.path}</td>
                <td className="text-muted-foreground">{row.ended_at ? "Ended" : "Live"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
