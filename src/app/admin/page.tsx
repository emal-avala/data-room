"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { AnalyticsSummary, FundEngagement, PipelineSummary } from "@/lib/analytics";
import { ViewsChart } from "./components/ViewsChart";

type TimeseriesPoint = { date: string; doc_views: number; site_views: number };
type LiveSession = { id: string; email: string; firm?: string | null; current_path: string };

const STAGE_LABEL: Record<string, string> = {
  lead: "Lead",
  intro: "Intro",
  diligence: "Diligence",
  term_sheet: "Term sheet",
  closed: "Closed",
  passed: "Passed",
};

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [funds, setFunds] = useState<FundEngagement[]>([]);
  const [pipeline, setPipeline] = useState<PipelineSummary["stages"]>([]);
  const [timeseries, setTimeseries] = useState<TimeseriesPoint[]>([]);
  const [live, setLive] = useState<LiveSession[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [analyticsRes, fundsRes, seriesRes, liveRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/funds"),
        fetch("/api/admin/analytics/timeseries"),
        fetch("/api/admin/analytics/currently-viewing"),
      ]);
      if (!analyticsRes.ok && analyticsRes.status >= 500) {
        setError("Analytics API unavailable");
        return;
      }
      if (analyticsRes.ok) setData(await analyticsRes.json());
      if (fundsRes.ok) {
        const body = await fundsRes.json();
        setFunds(body.funds ?? []);
        setPipeline(body.pipeline?.stages ?? []);
      }
      if (seriesRes.ok) {
        const body = await seriesRes.json();
        setTimeseries(body.points ?? []);
      }
      if (liveRes.ok) {
        const body = await liveRes.json();
        setLive(body.sessions ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stages =
    pipeline.length > 0
      ? pipeline
      : Object.keys(STAGE_LABEL).map((stage) => ({
          stage,
          count: funds.filter((fund) => fund.stage === stage).length,
        }));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-eyebrow">Admin</p>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Who is in the room, which documents they open, and how the fund pipeline is moving.
        </p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Document views" value={data?.total_views ?? 0} />
        <Stat label="Viewers" value={data?.unique_viewers ?? 0} />
        <Stat label="Active sessions" value={data?.active_sessions ?? 0} />
        <Stat label="Documents viewed" value={data?.documents_viewed ?? 0} />
      </div>
      <section className="container-box p-6">
        <h2 className="font-semibold">Views (30 days)</h2>
        {timeseries.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No events yet. Open a document as a viewer to populate this chart.
          </p>
        ) : (
          <div className="mt-4">
            <ViewsChart points={timeseries} />
          </div>
        )}
      </section>
      <section className="container-box p-6">
        <h2 className="font-semibold">Pipeline</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stages.map((row) => (
            <div key={row.stage}>
              <p className="text-xs text-muted-foreground">{STAGE_LABEL[row.stage] ?? row.stage}</p>
              <p className="mt-1 text-2xl font-semibold">{row.count}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container-box p-6" id="funds">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-semibold">Funds</h2>
          <p className="text-xs text-muted-foreground">{funds.length} firms</p>
        </div>
        {funds.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No funds yet. They appear when a viewer from a new domain signs in.
          </p>
        ) : (
          <table className="mt-4">
            <thead>
              <tr>
                <th>Firm</th>
                <th>Stage</th>
                <th>Viewers</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((fund) => (
                <tr key={fund.id}>
                  <td>{fund.name}</td>
                  <td className="text-muted-foreground">{STAGE_LABEL[fund.stage] ?? fund.stage}</td>
                  <td>{fund.viewer_count}</td>
                  <td>{fund.engagement_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <section className="container-box p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-semibold">Live now</h2>
          <Link href="/admin/analytics/sessions" className="text-xs text-muted-foreground hover:text-foreground">
            All sessions
          </Link>
        </div>
        {live.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No active sessions.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {live.map((session) => (
              <li key={session.id} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  {session.email}
                  {session.firm ? (
                    <span className="text-muted-foreground"> · {session.firm}</span>
                  ) : null}
                </span>
                <span className="text-muted-foreground">{session.current_path}</span>
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
