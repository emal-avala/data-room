type TimeseriesPoint = { date: string; doc_views: number; site_views: number };

function fillDays(points: TimeseriesPoint[], days = 30): TimeseriesPoint[] {
  const byDate = new Map(points.map((point) => [point.date, point]));
  const filled: TimeseriesPoint[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    filled.push(byDate.get(date) ?? { date, doc_views: 0, site_views: 0 });
  }
  return filled;
}

export function ViewsChart({ points }: { points: TimeseriesPoint[] }) {
  const series = fillDays(points);
  const max = Math.max(1, ...series.map((point) => point.doc_views + point.site_views));

  return (
    <div>
      <div className="flex h-36 items-end gap-px" role="img" aria-label="Views over the last 30 days">
        {series.map((point) => {
          const total = point.doc_views + point.site_views;
          return (
            <div
              key={point.date}
              className="flex h-full min-w-0 flex-1 flex-col justify-end"
              title={`${point.date}: ${point.doc_views} document, ${point.site_views} site`}
            >
              <div
                className="w-full rounded-t-[2px] bg-foreground/25"
                style={{ height: `${(point.site_views / max) * 100}%` }}
              />
              <div
                className="w-full bg-foreground/80"
                style={{ height: `${(point.doc_views / max) * 100}%` }}
              />
              <span className="sr-only">
                {point.date}: {total} views
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 bg-foreground/80" />
          Documents
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 bg-foreground/25" />
          Site
        </span>
      </div>
    </div>
  );
}
