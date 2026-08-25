import Link from "next/link";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/financials", label: "Overview" },
  { href: "/financials/pnl", label: "P&L" },
  { href: "/financials/forecast", label: "Forecast" },
  { href: "/financials/pipeline", label: "Pipeline" },
  { href: "/financials/revenue-by-customer", label: "By customer" },
] as const;

export function FinancialsNav({ current }: { current: (typeof LINKS)[number]["href"] }) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground",
            current === link.href && "border-primary/40 bg-primary/5 font-medium text-primary",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
