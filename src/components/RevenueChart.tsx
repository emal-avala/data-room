import { QUARTERS } from "@/data/financials";
import { usdCompact } from "@/lib/format-money";

export function RevenueChart() {
  const max = Math.max(...QUARTERS.map((row) => row.recognized));

  return (
    <div className="container-box p-6">
      <p className="text-sm text-muted-foreground">Recognized revenue by quarter · GAAP</p>
      <div className="mt-6 flex h-48 items-end gap-3">
        {QUARTERS.map((row) => {
          const height = Math.max(8, Math.round((row.recognized / max) * 100));
          return (
            <div key={row.quarter} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-semibold text-foreground">{usdCompact(row.recognized)}</span>
              <div className="flex h-36 w-full items-end justify-center">
                <div
                  className="w-full max-w-12 rounded-t bg-foreground/80"
                  style={{ height: `${height}%` }}
                  aria-hidden
                />
              </div>
              <span className="text-[11px] text-muted-foreground">{row.label.replace(" 20", " ’")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
