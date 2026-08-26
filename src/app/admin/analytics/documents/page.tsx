"use client";

import { useEffect, useState } from "react";

type DocRow = {
  slug: string;
  title?: string;
  views: number;
  unique_viewers?: number;
  avg_seconds?: number;
};

export default function DocumentsAnalyticsPage() {
  const [rows, setRows] = useState<DocRow[]>([]);
  useEffect(() => {
    void fetch("/api/admin/analytics/documents")
      .then((r) => r.json())
      .then((body) => setRows(body.documents ?? []));
  }, []);
  return (
    <div>
      <p className="text-eyebrow">Analytics</p>
      <h1 className="text-2xl font-semibold">Document performance</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Which diligence files partners actually open.
      </p>
      <table className="mt-6 container-box">
        <thead>
          <tr>
            <th>Document</th>
            <th>Views</th>
            <th>Viewers</th>
            <th>Avg time</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-sm text-muted-foreground">
                No document views.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.slug}>
                <td>
                  <span className="font-medium">{row.title ?? row.slug}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{row.slug}</span>
                </td>
                <td>{row.views}</td>
                <td className="text-muted-foreground">{row.unique_viewers ?? "—"}</td>
                <td className="text-muted-foreground">
                  {row.avg_seconds != null ? `${Math.round(row.avg_seconds / 60)} min` : "—"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
