import Link from "next/link";
import { siteConfig } from "@/config/site";
import { FOUNDER } from "@/data/company";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <p className="text-eyebrow">Contact</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Investor relations</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Questions about this room go to the founder. There is no IR agency in the middle.
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="container-box p-8">
          <h2 className="text-xl font-semibold">{FOUNDER.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{FOUNDER.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{FOUNDER.location}</p>
          <div className="mt-6 space-y-3 text-sm">
            <a className="block text-primary hover:underline" href={`mailto:${FOUNDER.email}`}>
              {FOUNDER.email}
            </a>
            <a className="block text-primary hover:underline" href={`tel:${FOUNDER.phone.replace(/\s/g, "")}`}>
              {FOUNDER.phone}
            </a>
          </div>
        </div>
        <div className="container-box flex flex-col justify-center p-8">
          <h2 className="text-xl font-semibold">Schedule a call</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Thirty minutes. Technology, the live network, and {siteConfig.roundLabel} terms. Email{" "}
            {FOUNDER.email} with two windows that work.
          </p>
        </div>
        <div className="container-box p-8 md:col-span-2">
          <h2 className="text-xl font-semibold">Before the call</h2>
          <p className="mt-2 text-sm text-muted-foreground">The data room has the numbers. The deck has the story.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              Explore the data room
            </Link>
            <Link href="/docs/pitch-deck" className="inline-flex h-11 items-center rounded-md border border-border px-6 text-sm">
              View the deck
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
