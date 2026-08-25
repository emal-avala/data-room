"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

type AnalyticsContextValue = {
  trackPage: (path: string) => void;
};

const AnalyticsContext = createContext<AnalyticsContextValue>({
  trackPage: () => {},
});

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const path = window.location.pathname;
    void fetch("/api/analytics/track/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        events: [{ type: "page_view", path, at: new Date().toISOString() }],
      }),
      keepalive: true,
    }).catch(() => {
      /* offline / unauthenticated — ignore */
    });
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{
        trackPage: (path) => {
          void fetch("/api/analytics/track/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              events: [{ type: "page_view", path, at: new Date().toISOString() }],
            }),
          }).catch(() => {});
        },
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsContextValue {
  return useContext(AnalyticsContext);
}
