"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ViewerDetailPage() {
  const params = useParams<{ id: string }>();
  const [viewer, setViewer] = useState<{ email?: string; firm?: string } | null>(null);
  const [events, setEvents] = useState<Array<{ id: string; type: string; at: string }>>([]);

  useEffect(() => {
    void fetch(`/api/admin/viewers/${params.id}`)
      .then((r) => r.json())
      .then(setViewer);
    void fetch(`/api/admin/viewers/${params.id}/timeline`)
      .then((r) => r.json())
      .then((body) => setEvents(body.events ?? []));
  }, [params.id]);

  return (
    <div>
      <p className="text-eyebrow">Viewer</p>
      <h1 className="text-2xl font-semibold tracking-tight">{viewer?.email ?? "…"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{viewer?.firm ?? "No firm"}</p>
      <ul className="mt-8 divide-y divide-border container-box">
        {events.length === 0 ? (
          <li className="p-6 text-sm text-muted-foreground">No activity.</li>
        ) : (
          events.map((event) => (
            <li key={event.id} className="p-4 text-sm">
              {event.type} · {event.at}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
