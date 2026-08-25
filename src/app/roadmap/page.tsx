import { NEXT_SHIP, PATH_PHASES } from "@/data/roadmap";
import { CompetitiveMatrix } from "@/components/CompetitiveMatrix";
import { Section } from "@/components/Section";

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <Section eyebrow="Roadmap" title="The path">
        <p className="max-w-2xl text-muted-foreground">
          Win the yard we already understand. Repeat the playbook. Do not become a vehicle company.
        </p>
        <ol className="mt-10 space-y-6">
          {PATH_PHASES.map((phase, index) => (
            <li key={phase.title} className="container-box grid gap-4 p-6 md:grid-cols-[8rem_1fr]">
              <div>
                <p className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-1 text-sm font-semibold">{phase.period}</p>
              </div>
              <div>
                <h3 className="font-semibold">{phase.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{phase.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Next" title="What is in QA">
        <div className="grid gap-4 md:grid-cols-2">
          {NEXT_SHIP.map((item) => (
            <div key={item.title} className="container-box p-6">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Market" title="Competitive matrix">
        <CompetitiveMatrix />
      </Section>
    </div>
  );
}
