"use client";

import { useEffect, useState } from "react";

export default function PagesAnalyticsPage() {
  const [rows, setRows] = useState<Array<{ path: string; views: number }>>([]);
  useEffect(() => {
    void fetch("/api/admin/analytics/pages")
      .then((r) => r.json())
      .then((body) => setRows(body.pages ?? []));
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Pages</h1>
      <ul className="mt-6 container-box divide-y divide-border">
        {rows.length === 0 ? (
          <li className="p-6 text-sm text-muted-foreground">No page views.</li>
        ) : (
          rows.map((row) => (
            <li key={row.path} className="flex justify-between p-4 text-sm">
              <span>{row.path}</span>
              <span>{row.views}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
