export interface Viewer {
  id: string;
  email: string;
  name?: string;
  firm?: string;
  created_at: string;
  last_seen_at: string;
  metadata?: Record<string, unknown>;
}

export interface TrackedDocument {
  id: string;
  title: string;
  slug: string;
  type: "pdf" | "excel" | "deck" | "article" | "other";
  page_count?: number;
  file_url?: string;
  created_at: string;
}

export interface DeviceInfo {
  user_agent: string;
  platform: string;
  browser: string;
  is_mobile: boolean;
}

export interface ViewerEngagement {
  viewer_id: string;
  email: string;
  name?: string;
  firm?: string;
  fund_id?: string;
  fund_name?: string;
  total_views: number;
  total_duration_seconds: number;
  unique_documents: number;
  last_activity_at: string;
  engagement_score: number;
}

export interface AnalyticsSummary {
  total_views: number;
  unique_viewers: number;
  total_duration_seconds: number;
  active_sessions: number;
  documents_viewed: number;
}

export interface FundEngagement {
  id: string;
  name: string;
  stage: string;
  viewer_count: number;
  engagement_score: number;
}

export interface PipelineSummary {
  stages: Array<{ stage: string; count: number }>;
}

export const FUND_STAGES = [
  "lead",
  "intro",
  "diligence",
  "term_sheet",
  "closed",
  "passed",
] as const;

export type FundStage = (typeof FUND_STAGES)[number];
