import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Section } from "@/components/Section";
import { getDocumentCategories } from "@/lib/documents";

const SAMPLE_METRICS = [
  { label: "Replace this metric", value: "—" },
  { label: "Paying customers", value: "—" },
  { label: "Team", value: "—" },
  { label: "Round", value: siteConfig.roundLabel },
];

export default function HomePage() {
  const categories = getDocumentCategories(false);

  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
        <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center px-4 py-24">
          <p className="text-eyebrow">{siteConfig.roundLabel}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-light tracking-tight md:text-6xl">
            {siteConfig.companyName}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">{siteConfig.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              Open the data room
            </Link>
            <Link
              href="/docs/pitch-deck"
              className="inline-flex h-11 items-center rounded-md border border-border px-6 text-sm"
            >
              View the sample deck
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4">
        <Section eyebrow="Snapshot" title="Headline figures">
          <p className="mb-6 text-sm text-muted-foreground">
            These cards are empty on purpose. Put your real metrics in{" "}
            <code>src/app/page.tsx</code> — never commit production numbers to
            a public fork.
          </p>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SAMPLE_METRICS.map((metric) => (
              <div key={metric.label} className="container-box p-6">
                <dt className="text-sm text-muted-foreground">{metric.label}</dt>
                <dd className="mt-2 text-2xl font-semibold">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section eyebrow="Diligence" title="Start here">
          <div className="grid gap-4 md:grid-cols-2">
            {categories.flatMap((category) =>
              category.documents.map((doc) => (
                <Link key={doc.slug} href={`/docs/${doc.slug}`} className="container-box p-6">
                  <p className="text-eyebrow">{category.title}</p>
                  <h3 className="mt-2 font-semibold">{doc.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{doc.description}</p>
                </Link>
              )),
            )}
          </div>
        </Section>
      </div>
    </>
  );
}
