"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ViewerRow = {
  id: string;
  email: string;
  name?: string | null;
  firm: string | null;
  last_seen_at: string;
  engagement_score?: number;
  total_views?: number;
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
      <p className="mt-2 text-sm text-muted-foreground">
        Partners who have opened the room, ranked by last activity.
      </p>
      <table className="mt-8 container-box">
        <thead>
          <tr>
            <th>Viewer</th>
            <th>Firm</th>
            <th>Views</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-sm text-muted-foreground">
                No viewers yet.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <Link href={`/admin/viewers/${row.id}`} className="hover:text-primary">
                    {row.name ?? row.email}
                  </Link>
                  {row.name ? (
                    <span className="ml-2 text-xs text-muted-foreground">{row.email}</span>
                  ) : null}
                </td>
                <td className="text-muted-foreground">{row.firm ?? "—"}</td>
                <td>{row.total_views ?? "—"}</td>
                <td>{row.engagement_score ?? "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
