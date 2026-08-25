"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalyticsSummary, FundEngagement } from "@/lib/analytics";

type TimeseriesPoint = { date: string; doc_views: number; site_views: number };

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [funds, setFunds] = useState<FundEngagement[]>([]);
  const [timeseries, setTimeseries] = useState<TimeseriesPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [analyticsRes, fundsRes, seriesRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/funds"),
        fetch("/api/admin/analytics/timeseries"),
      ]);
      if (analyticsRes.ok) setData(await analyticsRes.json());
      if (fundsRes.ok) {
        const body = await fundsRes.json();
        setFunds(body.funds ?? []);
      }
      if (seriesRes.ok) {
        const body = await seriesRes.json();
        setTimeseries(body.points ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-eyebrow">Admin</p>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Views" value={data?.total_views ?? 0} />
        <Stat label="Viewers" value={data?.unique_viewers ?? 0} />
        <Stat label="Active sessions" value={data?.active_sessions ?? 0} />
        <Stat label="Documents viewed" value={data?.documents_viewed ?? 0} />
      </div>
      <section className="container-box p-6">
        <h2 className="font-semibold">Views (30 days)</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {timeseries.length === 0
            ? "No events yet. Open a document as a viewer to populate this chart."
            : `${timeseries.length} days of sample traffic.`}
        </p>
      </section>
      <section className="container-box p-6">
        <h2 className="font-semibold">Funds</h2>
        {funds.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No funds yet. They appear when a viewer from a new domain signs in.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {funds.map((fund) => (
              <li key={fund.id} className="flex justify-between py-3 text-sm">
                <span>{fund.name}</span>
                <span className="text-muted-foreground">
                  {fund.stage} · score {fund.engagement_score}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="container-box p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
