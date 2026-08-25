import { siteConfig } from "@/config/site";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <dl className="mt-8 container-box divide-y divide-border">
        {[
          ["Company", siteConfig.companyName],
          ["Legal name", siteConfig.legalName],
          ["Internal domain", siteConfig.domain],
          ["Round", siteConfig.roundLabel],
          ["Site URL", siteConfig.siteUrl],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between p-4 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm text-muted-foreground">
        Edit <code>src/config/site.ts</code> or the matching environment
        variables. See docs/guides/branding.md.
      </p>
    </div>
  );
}
