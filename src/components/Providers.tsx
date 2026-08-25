"use client";

import type { ReactNode } from "react";
import { AnalyticsProvider } from "@/lib/analytics/provider";

export function Providers({ children }: { children: ReactNode }) {
  return <AnalyticsProvider>{children}</AnalyticsProvider>;
}
