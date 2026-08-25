import { siteConfig } from "@/config/site";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-eyebrow">Contact</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Investor relations</h1>
      <p className="mt-4 text-muted-foreground">
        Questions about this room go to{" "}
        <a className="text-primary hover:underline" href={`mailto:${siteConfig.adminInbox}`}>
          {siteConfig.adminInbox}
        </a>
        .
      </p>
    </div>
  );
}
