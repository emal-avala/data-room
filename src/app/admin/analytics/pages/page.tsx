"use client";

import { useEffect, useState } from "react";

type PageRow = { path: string; views: number; unique_viewers?: number };

export default function PagesAnalyticsPage() {
  const [rows, setRows] = useState<PageRow[]>([]);
  useEffect(() => {
    void fetch("/api/admin/analytics/pages")
      .then((r) => r.json())
      .then((body) => setRows(body.pages ?? []));
  }, []);
  return (
    <div>
      <p className="text-eyebrow">Analytics</p>
      <h1 className="text-2xl font-semibold">Pages</h1>
      <p className="mt-2 text-sm text-muted-foreground">Site paths ranked by views.</p>
      <table className="mt-6 container-box">
        <thead>
          <tr>
            <th>Path</th>
            <th>Views</th>
            <th>Viewers</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-6 text-sm text-muted-foreground">
                No page views.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.path}>
                <td>{row.path}</td>
                <td>{row.views}</td>
                <td className="text-muted-foreground">{row.unique_viewers ?? "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
