export const PATH_PHASES = [
  {
    period: "2022 – 2024",
    title: "Prove one yard",
    detail:
      "Paid pilots at a 3PL and a grocery DC. Software on existing spotter trucks. No Acme-branded vehicle. The KPI was docks-per-hour on the night shift, not a demo video.",
  },
  {
    period: "2024 – 2026",
    title: "Repeat the playbook",
    detail:
      "Fourteen contracted customers, thirty-one live sites. A written safety package that a union committee can read. First net-income-positive month in May 2026.",
  },
  {
    period: "2026 – 2028",
    title: "Second delivery pod + ports",
    detail:
      "Stand up a second implementation team so a single delayed go-live cannot flatten a quarter. Take the Harborline playbook to two more ports. Optional electric tractor through a manufacturing partner — no inventory on our books.",
  },
  {
    period: "2028 – 2030",
    title: "The yard operating system",
    detail:
      "Dispatch, door assignment, and gate check-in as one product. Sites that never buy a tractor still pay for the OS. That is the company. The tractor is a wedge, not the business.",
  },
] as const;

export const NEXT_SHIP = [
  {
    title: "Multi-yard dispatch",
    detail: "One controller for a customer with three sites on the same metro loop. In QA at Northstar.",
  },
  {
    title: "Snow mode v2",
    detail: "Lane-keeping when painted lines are buried. Falls back to a human above a measured slip threshold.",
  },
  {
    title: "Door scheduler",
    detail: "WMS-aware dock assignment so a tractor is not sent to a door that will be blocked for twenty minutes.",
  },
  {
    title: "Partner tractor interface",
    detail: "CAN + safety PLC contract for the electric yard-tractor OEM. We do not assemble vehicles.",
  },
] as const;
