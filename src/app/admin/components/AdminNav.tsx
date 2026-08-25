"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const PRIMARY = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/access", label: "Access" },
  { href: "/admin/viewers", label: "Viewers" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/dataroom", label: "Rooms" },
  { href: "/admin/admins", label: "Admins" },
  { href: "/admin/settings", label: "Settings" },
];

const ANALYTICS = [
  { href: "/admin/analytics/sessions", label: "Sessions" },
  { href: "/admin/analytics/pages", label: "Pages" },
  { href: "/admin/analytics/documents", label: "Documents" },
  { href: "/admin/analytics/events", label: "Events" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="mx-auto max-w-6xl px-4 pb-3">
      <nav className="flex flex-wrap gap-4 text-sm">
        {PRIMARY.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-muted-foreground hover:text-foreground",
              pathname === item.href && "text-foreground font-medium",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <nav className="mt-2 flex flex-wrap gap-4 text-xs">
        {ANALYTICS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-muted-foreground hover:text-foreground",
              pathname.startsWith(item.href) && "text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
