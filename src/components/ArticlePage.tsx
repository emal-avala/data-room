import type { ReactNode } from "react";
import { formatDateOnly } from "@/lib/format-date";

export function ArticlePage({
  eyebrow,
  title,
  subtitle,
  date,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  date?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-eyebrow mb-3">{eyebrow}</p>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle ? <p className="mt-3 text-muted-foreground">{subtitle}</p> : null}
      {date ? (
        <p className="mt-2 text-sm text-muted-foreground">{formatDateOnly(date)}</p>
      ) : null}
      <div className="prose prose-neutral mt-10 max-w-none">{children}</div>
    </article>
  );
}
