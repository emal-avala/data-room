"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/financials", label: "Financials" },
  { href: "/docs", label: "Documents" },
  { href: "/company", label: "Company" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          {siteConfig.companyName}
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {siteConfig.roundLabel}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm text-muted-foreground transition-colors hover:text-foreground",
                  active && "font-medium text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
            Admin
          </Link>
          <Link href="/login" className="text-sm font-medium text-primary">
            Sign in
          </Link>
        </nav>
        <button
          type="button"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open ? (
        <nav className="border-t border-border px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-sm"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="block py-2 text-sm font-medium text-primary" onClick={() => setOpen(false)}>
            Sign in
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
