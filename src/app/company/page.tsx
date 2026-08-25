import { siteConfig } from "@/config/site";
import { Section } from "@/components/Section";

export default function CompanyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <Section eyebrow="Company" title={siteConfig.legalName}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="container-box p-6">
            <h3 className="font-semibold">What we do</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Replace this paragraph with a concrete product description. Name
              the buyer, the job, and the output they take home.
            </p>
          </div>
          <div className="container-box p-6">
            <h3 className="font-semibold">Why now</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              One structural change in the market. Not a list of trends.
            </p>
          </div>
          <div className="container-box p-6">
            <h3 className="font-semibold">Risks</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Be specific. Investors already have a list; show them you share
              it.
            </p>
          </div>
          <div className="container-box p-6">
            <h3 className="font-semibold">People</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Founder-market fit in four sentences. Link out to public profiles
              rather than pasting biographies here.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
