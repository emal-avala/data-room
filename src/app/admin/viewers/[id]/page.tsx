"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Viewer = {
  email?: string;
  name?: string;
  firm?: string;
  engagement_score?: number;
  total_views?: number;
};

type TimelineEvent = { id: string; type: string; at: string; path?: string };

export default function ViewerDetailPage() {
  const params = useParams<{ id: string }>();
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);

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
      <h1 className="text-2xl font-semibold tracking-tight">
        {viewer?.name ?? viewer?.email ?? "…"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {viewer?.email}
        {viewer?.firm ? ` · ${viewer.firm}` : ""}
        {viewer?.engagement_score != null ? ` · score ${viewer.engagement_score}` : ""}
        {viewer?.total_views != null ? ` · ${viewer.total_views} views` : ""}
      </p>
      <table className="mt-8 container-box">
        <thead>
          <tr>
            <th>Event</th>
            <th>Path</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-6 text-sm text-muted-foreground">
                No activity.
              </td>
            </tr>
          ) : (
            events.map((event) => (
              <tr key={event.id}>
                <td>{event.type}</td>
                <td className="text-muted-foreground">{event.path ?? "—"}</td>
                <td className="text-muted-foreground">{event.at}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
