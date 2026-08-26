/**
 * In-memory IR analytics for the public sample deploy.
 *
 * Production Vercel without Supabase has no `document_views` table.
 * These rows are walkthrough traffic — well-known fund *names* so the
 * admin console looks like a live raise, fictional `*.example` emails
 * so nobody mistakes them for real partners.
 *
 * Do not put `@acme.example` on a demo viewer. That domain is staff
 * (`isInternalViewer`) and would leak `internal-notes`.
 */

import { DOCUMENTS } from "@/lib/documents";
import { FUND_STAGES, type AnalyticsSummary, type FundEngagement, type PipelineSummary } from "./types";

/** Same address as `PUBLIC_DEMO_VIEWER_EMAIL` — must not be `@acme.example`. */
export const DEMO_ADMIN_EMAIL = "demo@example.com";

export const WELL_KNOWN_DEMO_FUND_NAMES = [
  "Sequoia Capital",
  "Andreessen Horowitz",
  "Benchmark",
  "Accel",
  "Greylock Partners",
  "Founders Fund",
  "Lightspeed Venture Partners",
  "Kleiner Perkins",
  "Index Ventures",
  "Bessemer Venture Partners",
  "General Catalyst",
  "Insight Partners",
] as const;

export type DemoFund = FundEngagement & {
  domain: string;
  last_activity_at: string;
};

export type DemoViewer = {
  id: string;
  email: string;
  name: string;
  firm: string;
  fund_id: string;
  created_at: string;
  last_seen_at: string;
  total_views: number;
  total_duration_seconds: number;
  unique_documents: number;
  engagement_score: number;
};

export type DemoSession = {
  id: string;
  viewer_id: string;
  email: string;
  firm: string;
  path: string;
  started_at: string;
  ended_at: string | null;
};

export type DemoPage = {
  path: string;
  views: number;
  unique_viewers: number;
};

export type DemoDocumentPerf = {
  slug: string;
  title: string;
  views: number;
  unique_viewers: number;
  avg_seconds: number;
};

export type DemoEvent = {
  id: string;
  type: string;
  path: string;
  email: string;
  firm: string;
  created_at: string;
};

export type DemoAccessRequest = {
  id: string;
  email: string;
  firm: string;
  status: "pending" | "approved" | "rejected";
  requested_at: string;
  requested_path: string | null;
};

export type DemoTimeseriesPoint = {
  date: string;
  doc_views: number;
  site_views: number;
};

export type DemoViewerTimelineEvent = {
  id: string;
  type: string;
  at: string;
  path: string;
};

function at(daysAgo: number, hour = 15, minute = 0): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  date.setUTCHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const DEMO_FUNDS: DemoFund[] = [
  {
    id: "fund-a16z",
    name: "Andreessen Horowitz",
    domain: "a16z.example",
    stage: "term_sheet",
    viewer_count: 2,
    engagement_score: 97,
    last_activity_at: at(0, 16, 12),
  },
  {
    id: "fund-sequoia",
    name: "Sequoia Capital",
    domain: "sequoia.example",
    stage: "diligence",
    viewer_count: 2,
    engagement_score: 92,
    last_activity_at: at(0, 15, 40),
  },
  {
    id: "fund-accel",
    name: "Accel",
    domain: "accel.example",
    stage: "diligence",
    viewer_count: 1,
    engagement_score: 81,
    last_activity_at: at(0, 14, 5),
  },
  {
    id: "fund-lightspeed",
    name: "Lightspeed Venture Partners",
    domain: "lsvp.example",
    stage: "diligence",
    viewer_count: 1,
    engagement_score: 74,
    last_activity_at: at(1, 18, 22),
  },
  {
    id: "fund-founders",
    name: "Founders Fund",
    domain: "foundersfund.example",
    stage: "intro",
    viewer_count: 1,
    engagement_score: 61,
    last_activity_at: at(1, 11, 8),
  },
  {
    id: "fund-insight",
    name: "Insight Partners",
    domain: "insightpartners.example",
    stage: "intro",
    viewer_count: 1,
    engagement_score: 58,
    last_activity_at: at(2, 13, 44),
  },
  {
    id: "fund-benchmark",
    name: "Benchmark",
    domain: "benchmark.example",
    stage: "intro",
    viewer_count: 1,
    engagement_score: 54,
    last_activity_at: at(2, 10, 16),
  },
  {
    id: "fund-index",
    name: "Index Ventures",
    domain: "indexventures.example",
    stage: "intro",
    viewer_count: 1,
    engagement_score: 47,
    last_activity_at: at(3, 17, 3),
  },
  {
    id: "fund-bessemer",
    name: "Bessemer Venture Partners",
    domain: "bvp.example",
    stage: "passed",
    viewer_count: 1,
    engagement_score: 33,
    last_activity_at: at(12, 9, 30),
  },
  {
    id: "fund-greylock",
    name: "Greylock Partners",
    domain: "greylock.example",
    stage: "lead",
    viewer_count: 1,
    engagement_score: 28,
    last_activity_at: at(4, 16, 50),
  },
  {
    id: "fund-gc",
    name: "General Catalyst",
    domain: "generalcatalyst.example",
    stage: "lead",
    viewer_count: 1,
    engagement_score: 22,
    last_activity_at: at(5, 12, 10),
  },
  {
    id: "fund-kp",
    name: "Kleiner Perkins",
    domain: "kleinerperkins.example",
    stage: "lead",
    viewer_count: 1,
    engagement_score: 19,
    last_activity_at: at(6, 19, 41),
  },
];

export const DEMO_VIEWERS: DemoViewer[] = [
  {
    id: "viewer-alex",
    email: "alex@a16z.example",
    name: "Alex Rivera",
    firm: "Andreessen Horowitz",
    fund_id: "fund-a16z",
    created_at: at(18, 9, 0),
    last_seen_at: at(0, 16, 12),
    total_views: 41,
    total_duration_seconds: 11840,
    unique_documents: 8,
    engagement_score: 96,
  },
  {
    id: "viewer-jordan",
    email: "jordan@a16z.example",
    name: "Jordan Blake",
    firm: "Andreessen Horowitz",
    fund_id: "fund-a16z",
    created_at: at(16, 14, 20),
    last_seen_at: at(0, 11, 4),
    total_views: 27,
    total_duration_seconds: 7320,
    unique_documents: 6,
    engagement_score: 88,
  },
  {
    id: "viewer-maya",
    email: "maya@sequoia.example",
    name: "Maya Chen",
    firm: "Sequoia Capital",
    fund_id: "fund-sequoia",
    created_at: at(21, 10, 0),
    last_seen_at: at(0, 15, 40),
    total_views: 36,
    total_duration_seconds: 9840,
    unique_documents: 7,
    engagement_score: 93,
  },
  {
    id: "viewer-priya",
    email: "priya.shah@sequoia.example",
    name: "Priya Shah",
    firm: "Sequoia Capital",
    fund_id: "fund-sequoia",
    created_at: at(14, 8, 30),
    last_seen_at: at(1, 9, 18),
    total_views: 19,
    total_duration_seconds: 4560,
    unique_documents: 5,
    engagement_score: 71,
  },
  {
    id: "viewer-elena",
    email: "elena@accel.example",
    name: "Elena Voss",
    firm: "Accel",
    fund_id: "fund-accel",
    created_at: at(11, 13, 0),
    last_seen_at: at(0, 14, 5),
    total_views: 24,
    total_duration_seconds: 6120,
    unique_documents: 6,
    engagement_score: 81,
  },
  {
    id: "viewer-noah",
    email: "noah@lsvp.example",
    name: "Noah Okonkwo",
    firm: "Lightspeed Venture Partners",
    fund_id: "fund-lightspeed",
    created_at: at(9, 16, 45),
    last_seen_at: at(1, 18, 22),
    total_views: 17,
    total_duration_seconds: 3900,
    unique_documents: 4,
    engagement_score: 74,
  },
  {
    id: "viewer-sam",
    email: "sam@foundersfund.example",
    name: "Sam Ibarra",
    firm: "Founders Fund",
    fund_id: "fund-founders",
    created_at: at(8, 11, 10),
    last_seen_at: at(1, 11, 8),
    total_views: 12,
    total_duration_seconds: 2460,
    unique_documents: 3,
    engagement_score: 61,
  },
  {
    id: "viewer-leila",
    email: "leila@insightpartners.example",
    name: "Leila Haddad",
    firm: "Insight Partners",
    fund_id: "fund-insight",
    created_at: at(7, 15, 0),
    last_seen_at: at(2, 13, 44),
    total_views: 11,
    total_duration_seconds: 2100,
    unique_documents: 3,
    engagement_score: 58,
  },
  {
    id: "viewer-theo",
    email: "theo@benchmark.example",
    name: "Theo Marsh",
    firm: "Benchmark",
    fund_id: "fund-benchmark",
    created_at: at(10, 12, 0),
    last_seen_at: at(2, 10, 16),
    total_views: 9,
    total_duration_seconds: 1680,
    unique_documents: 3,
    engagement_score: 54,
  },
  {
    id: "viewer-iris",
    email: "iris@indexventures.example",
    name: "Iris Moreau",
    firm: "Index Ventures",
    fund_id: "fund-index",
    created_at: at(6, 9, 20),
    last_seen_at: at(3, 17, 3),
    total_views: 8,
    total_duration_seconds: 1440,
    unique_documents: 2,
    engagement_score: 47,
  },
  {
    id: "viewer-owen",
    email: "owen@bvp.example",
    name: "Owen Hale",
    firm: "Bessemer Venture Partners",
    fund_id: "fund-bessemer",
    created_at: at(20, 10, 0),
    last_seen_at: at(12, 9, 30),
    total_views: 6,
    total_duration_seconds: 900,
    unique_documents: 2,
    engagement_score: 33,
  },
  {
    id: "viewer-rina",
    email: "rina@greylock.example",
    name: "Rina Patel",
    firm: "Greylock Partners",
    fund_id: "fund-greylock",
    created_at: at(5, 14, 0),
    last_seen_at: at(4, 16, 50),
    total_views: 5,
    total_duration_seconds: 780,
    unique_documents: 2,
    engagement_score: 28,
  },
  {
    id: "viewer-caleb",
    email: "caleb@generalcatalyst.example",
    name: "Caleb Ng",
    firm: "General Catalyst",
    fund_id: "fund-gc",
    created_at: at(4, 11, 30),
    last_seen_at: at(5, 12, 10),
    total_views: 4,
    total_duration_seconds: 540,
    unique_documents: 1,
    engagement_score: 22,
  },
  {
    id: "viewer-hana",
    email: "hana@kleinerperkins.example",
    name: "Hana Brooks",
    firm: "Kleiner Perkins",
    fund_id: "fund-kp",
    created_at: at(3, 17, 0),
    last_seen_at: at(6, 19, 41),
    total_views: 3,
    total_duration_seconds: 420,
    unique_documents: 1,
    engagement_score: 19,
  },
];

export const DEMO_SESSIONS: DemoSession[] = [
  {
    id: "session-alex-live",
    viewer_id: "viewer-alex",
    email: "alex@a16z.example",
    firm: "Andreessen Horowitz",
    path: "/docs/cap-table",
    started_at: at(0, 16, 2),
    ended_at: null,
  },
  {
    id: "session-maya-live",
    viewer_id: "viewer-maya",
    email: "maya@sequoia.example",
    firm: "Sequoia Capital",
    path: "/docs/financial-overview",
    started_at: at(0, 15, 28),
    ended_at: null,
  },
  {
    id: "session-elena-live",
    viewer_id: "viewer-elena",
    email: "elena@accel.example",
    firm: "Accel",
    path: "/docs/pitch-deck",
    started_at: at(0, 13, 50),
    ended_at: null,
  },
  {
    id: "session-jordan-live",
    viewer_id: "viewer-jordan",
    email: "jordan@a16z.example",
    firm: "Andreessen Horowitz",
    path: "/docs/use-of-funds",
    started_at: at(0, 10, 48),
    ended_at: null,
  },
  {
    id: "session-noah-done",
    viewer_id: "viewer-noah",
    email: "noah@lsvp.example",
    firm: "Lightspeed Venture Partners",
    path: "/docs/investment-memo",
    started_at: at(1, 17, 40),
    ended_at: at(1, 18, 22),
  },
  {
    id: "session-sam-done",
    viewer_id: "viewer-sam",
    email: "sam@foundersfund.example",
    firm: "Founders Fund",
    path: "/docs",
    started_at: at(1, 10, 30),
    ended_at: at(1, 11, 8),
  },
  {
    id: "session-theo-done",
    viewer_id: "viewer-theo",
    email: "theo@benchmark.example",
    firm: "Benchmark",
    path: "/docs/go-to-market",
    started_at: at(2, 9, 40),
    ended_at: at(2, 10, 16),
  },
  {
    id: "session-leila-done",
    viewer_id: "viewer-leila",
    email: "leila@insightpartners.example",
    firm: "Insight Partners",
    path: "/docs/case-studies",
    started_at: at(2, 13, 5),
    ended_at: at(2, 13, 44),
  },
];

export const DEMO_PAGES: DemoPage[] = [
  { path: "/docs", views: 388, unique_viewers: 14 },
  { path: "/docs/pitch-deck", views: 276, unique_viewers: 14 },
  { path: "/docs/financial-overview", views: 231, unique_viewers: 11 },
  { path: "/docs/investment-memo", views: 194, unique_viewers: 10 },
  { path: "/docs/use-of-funds", views: 167, unique_viewers: 9 },
  { path: "/", views: 154, unique_viewers: 14 },
  { path: "/docs/go-to-market", views: 121, unique_viewers: 8 },
  { path: "/docs/cap-table", views: 98, unique_viewers: 5 },
  { path: "/docs/case-studies", views: 74, unique_viewers: 6 },
  { path: "/docs/competitive-landscape", views: 61, unique_viewers: 5 },
  { path: "/docs/technical-architecture", views: 52, unique_viewers: 4 },
  { path: "/login", views: 41, unique_viewers: 12 },
];

export const DEMO_DOCUMENTS: DemoDocumentPerf[] = [
  { slug: "pitch-deck", title: "Series A deck", views: 142, unique_viewers: 14, avg_seconds: 412 },
  { slug: "financial-overview", title: "Financial overview", views: 121, unique_viewers: 11, avg_seconds: 540 },
  { slug: "investment-memo", title: "Investment memo", views: 98, unique_viewers: 10, avg_seconds: 488 },
  { slug: "use-of-funds", title: "Use of funds", views: 87, unique_viewers: 9, avg_seconds: 305 },
  { slug: "go-to-market", title: "Go-to-market", views: 63, unique_viewers: 8, avg_seconds: 260 },
  { slug: "cap-table", title: "Cap table", views: 54, unique_viewers: 5, avg_seconds: 214 },
  { slug: "case-studies", title: "Site notes", views: 44, unique_viewers: 6, avg_seconds: 198 },
  { slug: "competitive-landscape", title: "Competitive landscape", views: 41, unique_viewers: 5, avg_seconds: 176 },
  { slug: "technical-architecture", title: "Technical architecture", views: 38, unique_viewers: 4, avg_seconds: 233 },
];

export const DEMO_EVENTS: DemoEvent[] = [
  {
    id: "evt-1",
    type: "document_open",
    path: "/docs/cap-table",
    email: "alex@a16z.example",
    firm: "Andreessen Horowitz",
    created_at: at(0, 16, 12),
  },
  {
    id: "evt-2",
    type: "nda_accepted",
    path: "/docs/cap-table",
    email: "alex@a16z.example",
    firm: "Andreessen Horowitz",
    created_at: at(0, 16, 8),
  },
  {
    id: "evt-3",
    type: "document_open",
    path: "/docs/financial-overview",
    email: "maya@sequoia.example",
    firm: "Sequoia Capital",
    created_at: at(0, 15, 40),
  },
  {
    id: "evt-4",
    type: "page_view",
    path: "/docs",
    email: "elena@accel.example",
    firm: "Accel",
    created_at: at(0, 13, 52),
  },
  {
    id: "evt-5",
    type: "document_open",
    path: "/docs/pitch-deck",
    email: "elena@accel.example",
    firm: "Accel",
    created_at: at(0, 14, 5),
  },
  {
    id: "evt-6",
    type: "document_open",
    path: "/docs/use-of-funds",
    email: "jordan@a16z.example",
    firm: "Andreessen Horowitz",
    created_at: at(0, 11, 4),
  },
  {
    id: "evt-7",
    type: "download",
    path: "/docs/investment-memo",
    email: "noah@lsvp.example",
    firm: "Lightspeed Venture Partners",
    created_at: at(1, 18, 10),
  },
  {
    id: "evt-8",
    type: "document_open",
    path: "/docs/investment-memo",
    email: "noah@lsvp.example",
    firm: "Lightspeed Venture Partners",
    created_at: at(1, 17, 48),
  },
  {
    id: "evt-9",
    type: "page_view",
    path: "/docs",
    email: "sam@foundersfund.example",
    firm: "Founders Fund",
    created_at: at(1, 10, 36),
  },
  {
    id: "evt-10",
    type: "document_open",
    path: "/docs/go-to-market",
    email: "theo@benchmark.example",
    firm: "Benchmark",
    created_at: at(2, 10, 2),
  },
  {
    id: "evt-11",
    type: "document_open",
    path: "/docs/case-studies",
    email: "leila@insightpartners.example",
    firm: "Insight Partners",
    created_at: at(2, 13, 20),
  },
  {
    id: "evt-12",
    type: "page_view",
    path: "/",
    email: "iris@indexventures.example",
    firm: "Index Ventures",
    created_at: at(3, 16, 50),
  },
];

export const DEMO_ACCESS_REQUESTS: DemoAccessRequest[] = [
  {
    id: "access-thrive",
    email: "nina@thrive.example",
    firm: "Thrive Capital",
    status: "pending",
    requested_at: at(0, 9, 20),
    requested_path: "/docs/pitch-deck",
  },
  {
    id: "access-tiger",
    email: "owen.reed@tiger.example",
    firm: "Tiger Global",
    status: "pending",
    requested_at: at(1, 15, 4),
    requested_path: "/docs/financial-overview",
  },
  {
    id: "access-softbank",
    email: "ravi@softbank.example",
    firm: "SoftBank",
    status: "pending",
    requested_at: at(2, 8, 45),
    requested_path: "/docs",
  },
  {
    id: "access-a16z",
    email: "alex@a16z.example",
    firm: "Andreessen Horowitz",
    status: "approved",
    requested_at: at(18, 8, 10),
    requested_path: "/docs",
  },
  {
    id: "access-sequoia",
    email: "maya@sequoia.example",
    firm: "Sequoia Capital",
    status: "approved",
    requested_at: at(21, 9, 0),
    requested_path: "/docs/pitch-deck",
  },
  {
    id: "access-bessemer",
    email: "owen@bvp.example",
    firm: "Bessemer Venture Partners",
    status: "rejected",
    requested_at: at(20, 9, 30),
    requested_path: "/docs/cap-table",
  },
];

const VIEWER_TIMELINES: Record<string, DemoViewerTimelineEvent[]> = {
  "viewer-alex": [
    { id: "tl-alex-1", type: "document_open", at: at(0, 16, 12), path: "/docs/cap-table" },
    { id: "tl-alex-2", type: "nda_accepted", at: at(0, 16, 8), path: "/docs/cap-table" },
    { id: "tl-alex-3", type: "document_open", at: at(0, 15, 20), path: "/docs/use-of-funds" },
    { id: "tl-alex-4", type: "document_open", at: at(1, 19, 4), path: "/docs/financial-overview" },
    { id: "tl-alex-5", type: "document_open", at: at(3, 11, 30), path: "/docs/investment-memo" },
    { id: "tl-alex-6", type: "document_open", at: at(5, 14, 12), path: "/docs/pitch-deck" },
  ],
  "viewer-maya": [
    { id: "tl-maya-1", type: "document_open", at: at(0, 15, 40), path: "/docs/financial-overview" },
    { id: "tl-maya-2", type: "page_view", at: at(0, 15, 28), path: "/docs" },
    { id: "tl-maya-3", type: "document_open", at: at(2, 10, 15), path: "/docs/use-of-funds" },
    { id: "tl-maya-4", type: "document_open", at: at(4, 16, 2), path: "/docs/pitch-deck" },
  ],
  "viewer-elena": [
    { id: "tl-elena-1", type: "document_open", at: at(0, 14, 5), path: "/docs/pitch-deck" },
    { id: "tl-elena-2", type: "page_view", at: at(0, 13, 52), path: "/docs" },
    { id: "tl-elena-3", type: "document_open", at: at(3, 9, 40), path: "/docs/investment-memo" },
  ],
};

export function getDemoAnalyticsSummary(): AnalyticsSummary {
  return {
    total_views: DEMO_DOCUMENTS.reduce((sum, row) => sum + row.views, 0),
    unique_viewers: DEMO_VIEWERS.length,
    total_duration_seconds: DEMO_VIEWERS.reduce((sum, row) => sum + row.total_duration_seconds, 0),
    active_sessions: DEMO_SESSIONS.filter((row) => row.ended_at === null).length,
    documents_viewed: DEMO_DOCUMENTS.length,
  };
}

export function getDemoFunds(): DemoFund[] {
  return [...DEMO_FUNDS].sort((a, b) => b.engagement_score - a.engagement_score);
}

export function getDemoPipeline(): PipelineSummary {
  const counts = new Map<string, number>(FUND_STAGES.map((stage) => [stage, 0]));
  for (const fund of DEMO_FUNDS) {
    counts.set(fund.stage, (counts.get(fund.stage) ?? 0) + 1);
  }
  return {
    stages: FUND_STAGES.map((stage) => ({ stage, count: counts.get(stage) ?? 0 })),
  };
}

export function getDemoTimeseries(now = Date.now()): DemoTimeseriesPoint[] {
  const points: DemoTimeseriesPoint[] = [];
  for (let i = 29; i >= 0; i -= 1) {
    const day = new Date(now - i * 24 * 60 * 60 * 1000);
    const date = day.toISOString().slice(0, 10);
    const weekend = day.getUTCDay() === 0 || day.getUTCDay() === 6;
    const wave = 1 + 0.28 * Math.sin(i / 5);
    const spike = i === 8 ? 1.7 : 1;
    points.push({
      date,
      site_views: Math.round((weekend ? 9 : 24) * wave * spike + (i % 4)),
      doc_views: Math.round((weekend ? 5 : 16) * wave * spike + (i % 3)),
    });
  }
  return points;
}

export function getDemoViewer(id: string): DemoViewer | undefined {
  return DEMO_VIEWERS.find((row) => row.id === id);
}

export function getDemoViewerTimeline(id: string): DemoViewerTimelineEvent[] {
  if (VIEWER_TIMELINES[id]) return VIEWER_TIMELINES[id];
  const viewer = getDemoViewer(id);
  if (!viewer) return [];
  return [
    {
      id: `${id}-seen`,
      type: "page_view",
      at: viewer.last_seen_at,
      path: "/docs",
    },
  ];
}

export function getDemoTrackedDocuments() {
  return DOCUMENTS.filter((doc) => doc.audience !== "internal").map((doc) => ({
    slug: doc.slug,
    title: doc.name,
    type: doc.type,
    file_url: doc.fileUrl,
    require_nda: doc.requireNda,
  }));
}

export function getDemoAdmins(): string[] {
  return [DEMO_ADMIN_EMAIL];
}

export function isDemoAnalyticsEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized.endsWith(".example")) return false;
  if (normalized.endsWith("@acme.example")) return false;
  return true;
}
