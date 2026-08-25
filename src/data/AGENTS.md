# src/data/

Acme Corporation is the worked example. Numbers are fictional and internally consistent as of June 2026 (preliminary close).

| File | Source of truth for |
|------|---------------------|
| `company.ts` | Name, people, offices, risks |
| `financials.ts` | Quarterly ledger |
| `pnl.ts` | Monthly P&L (must roll up to the ledger) |
| `forecast.ts` | Three scenarios; history is actuals |
| `metrics.ts` | Hero strip, derived run-rate |
| `customers.ts` | Contracted and pilot accounts + H1 recognized |
| `pipeline.ts` | Contingent deals — never add these into run-rate |
| `roadmap.ts` | Phases and next ship |
| `competition.ts` | Matrix |
| `announcements.ts` | Pre-auth banner (no figures) |

Do not type a dollar figure in a page. Import it. If two surfaces disagree, the ledger is right.
