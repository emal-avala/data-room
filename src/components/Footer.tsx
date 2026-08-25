import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          Confidential. Prepared for approved investors of {siteConfig.legalName}.
        </p>
        <p className="font-mono uppercase tracking-wider">
          {siteConfig.roundLabel} data room
        </p>
      </div>
    </footer>
  );
}
