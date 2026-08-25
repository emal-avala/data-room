import { PILOTS } from "./customers";

export type PipelineDeal = {
  account: string;
  stage: "pilot" | "commercial" | "legal";
  unweighted: number;
  weight: number;
};

export const PIPELINE: readonly PipelineDeal[] = [
  { account: PILOTS[0].name, stage: "pilot", unweighted: 1_800_000, weight: 0.45 },
  { account: PILOTS[1].name, stage: "pilot", unweighted: 720_000, weight: 0.5 },
  { account: PILOTS[2].name, stage: "pilot", unweighted: 1_400_000, weight: 0.35 },
  { account: "Cedar & Pine Retail", stage: "commercial", unweighted: 3_200_000, weight: 0.3 },
  { account: "Midcontinent Fuels", stage: "commercial", unweighted: 2_400_000, weight: 0.25 },
  { account: "Southfork Cold Storage", stage: "commercial", unweighted: 1_900_000, weight: 0.3 },
  { account: "Highline Intermodal", stage: "legal", unweighted: 2_600_000, weight: 0.55 },
  { account: "Northern Range Co-op", stage: "legal", unweighted: 1_100_000, weight: 0.4 },
  { account: "Basin Chemical", stage: "commercial", unweighted: 2_200_000, weight: 0.2 },
  { account: "Eastport Authority", stage: "commercial", unweighted: 2_080_000, weight: 0.15 },
];

export const PIPELINE_UNWEIGHTED = PIPELINE.reduce((sum, deal) => sum + deal.unweighted, 0);
export const PIPELINE_WEIGHTED = PIPELINE.reduce((sum, deal) => sum + deal.unweighted * deal.weight, 0);

export const PIPELINE_NOTE =
  "Pipeline is management-qualified and contingent. It is not recognized revenue, not invoiced, and not part of the run-rate.";
