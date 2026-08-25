"use client";

import { useEffect, useState } from "react";

export default function DocumentsAnalyticsPage() {
  const [rows, setRows] = useState<Array<{ slug: string; views: number }>>([]);
  useEffect(() => {
    void fetch("/api/admin/analytics/documents")
      .then((r) => r.json())
      .then((body) => setRows(body.documents ?? []));
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Document performance</h1>
      <ul className="mt-6 container-box divide-y divide-border">
        {rows.length === 0 ? (
          <li className="p-6 text-sm text-muted-foreground">No document views.</li>
        ) : (
          rows.map((row) => (
            <li key={row.slug} className="flex justify-between p-4 text-sm">
              <span>{row.slug}</span>
              <span>{row.views}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
