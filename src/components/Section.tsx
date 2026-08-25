import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      {eyebrow ? <p className="text-eyebrow mb-3">{eyebrow}</p> : null}
      {title ? <h2 className="mb-8 text-2xl font-semibold tracking-tight">{title}</h2> : null}
      {children}
    </section>
  );
}
