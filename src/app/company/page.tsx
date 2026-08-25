import { siteConfig } from "@/config/site";
import { BACKERS, COMPANY, CTO, FOUNDER, LEADERSHIP, OFFICES, RISKS } from "@/data/company";
import { HEADCOUNT } from "@/data/metrics";
import { CompetitiveMatrix } from "@/components/CompetitiveMatrix";
import { Section } from "@/components/Section";

export default function CompanyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <Section eyebrow="Company" title={siteConfig.legalName}>
        <p className="max-w-2xl text-muted-foreground">{COMPANY.oneLiner}</p>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{COMPANY.wedge}</p>
      </Section>

      <Section eyebrow="Product" title="What we ship">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="container-box p-6">
            <h3 className="font-semibold">Yard OS</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Dispatch, door assignment, and a live yard graph. The night-shift lead sees the same picture the
              planner does.
            </p>
          </div>
          <div className="container-box p-6">
            <h3 className="font-semibold">On-vehicle autonomy</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Perception and motion on the tractor. Driver-out for gate-to-dock moves that stay inside the fence.
              Public-road hops stay human.
            </p>
          </div>
          <div className="container-box p-6">
            <h3 className="font-semibold">Optional tractor</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Electric yard tractor through a manufacturing partner. We do not take inventory and we do not quote a
              vehicle gross margin as if it were ours.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Position" title="Who we are not">
        <CompetitiveMatrix />
      </Section>

      <Section eyebrow="People" title={`${HEADCOUNT} on the payroll`}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="container-box p-6">
            <p className="text-eyebrow">Founder</p>
            <h3 className="mt-2 text-lg font-semibold">{FOUNDER.name}</h3>
            <p className="text-sm text-muted-foreground">{FOUNDER.title}</p>
            <p className="mt-4 text-sm text-muted-foreground">{FOUNDER.origin}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {FOUNDER.fit.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="container-box p-6">
            <p className="text-eyebrow">Co-founder</p>
            <h3 className="mt-2 text-lg font-semibold">{CTO.name}</h3>
            <p className="text-sm text-muted-foreground">{CTO.title}</p>
            <p className="mt-4 text-sm text-muted-foreground">{CTO.origin}</p>
            <h4 className="mt-6 text-sm font-semibold">Leadership</h4>
            <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
              {LEADERSHIP.slice(2).map((person) => (
                <li key={person.name}>
                  <span className="font-medium text-foreground">{person.name}</span> · {person.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {OFFICES.map((office) => (
            <div key={office.city} className="container-box p-6">
              <h3 className="font-semibold">{office.city}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{office.role}</p>
              <p className="mt-4 text-2xl font-semibold">{office.people}</p>
              <p className="text-xs text-muted-foreground">people</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Capital" title="Who is already on the cap table">
        <div className="grid gap-4 md:grid-cols-2">
          {BACKERS.map((backer) => (
            <div key={backer.name} className="container-box p-6">
              <h3 className="font-semibold">{backer.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {backer.round} · {backer.year}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Risks" title="What we would underwrite against">
        <div className="grid gap-4 md:grid-cols-2">
          {RISKS.map((risk) => (
            <div key={risk.title} className="container-box p-6">
              <h3 className="font-semibold">{risk.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{risk.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
