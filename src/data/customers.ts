export type AccountStatus = "contracted" | "pilot";

export type Account = {
  name: string;
  segment: string;
  sites: number;
  status: AccountStatus;
  since: string;
  note: string;
  /** H1 2026 recognized. Must sum to `H1_2026_RECOGNIZED` across contracted accounts. */
  h1Recognized: number;
};

/**
 * Fictional counterparties. None of these are real companies.
 * Do not replace them with a customer's legal name in this public repo.
 */
export const ACCOUNTS: readonly Account[] = [
  {
    name: "Northstar Logistics",
    segment: "3PL",
    sites: 6,
    status: "contracted",
    since: "2024",
    note: "Network rollout after a 90-day paid pilot in Joliet.",
    h1Recognized: 860_000,
  },
  {
    name: "Meridian Grocers",
    segment: "Grocery DC",
    sites: 4,
    status: "contracted",
    since: "2024",
    note: "Night shift first. Day shift still human-led.",
    h1Recognized: 682_000,
  },
  {
    name: "Harborline Terminals",
    segment: "Port yard",
    sites: 3,
    status: "contracted",
    since: "2025",
    note: "Gate-to-stack moves. Customs holds stay manual.",
    h1Recognized: 410_000,
  },
  {
    name: "Redwood Cold Chain",
    segment: "Cold storage",
    sites: 3,
    status: "contracted",
    since: "2025",
    note: "Reefer dwell was the KPI. Software-only on their existing fleet.",
    h1Recognized: 380_000,
  },
  {
    name: "Prairie Pack",
    segment: "CPG",
    sites: 2,
    status: "contracted",
    since: "2025",
    note: "Two Midwest plants, shared dispatch.",
    h1Recognized: 290_000,
  },
  {
    name: "Keystone Parcel",
    segment: "Parcel sort",
    sites: 2,
    status: "contracted",
    since: "2026",
    note: "Sort-center yards. Peak season is the proving window.",
    h1Recognized: 250_000,
  },
  {
    name: "Ironwood Building Materials",
    segment: "Building products",
    sites: 2,
    status: "contracted",
    since: "2026",
    note: "Long trailers, tight turning circles.",
    h1Recognized: 220_000,
  },
  {
    name: "Lakeside Beverage",
    segment: "Beverage DC",
    sites: 1,
    status: "contracted",
    since: "2026",
    note: "Single-site, high trailer turns.",
    h1Recognized: 145_000,
  },
  {
    name: "Summit Paper",
    segment: "Pulp & paper",
    sites: 1,
    status: "contracted",
    since: "2026",
    note: "First mill yard. Safety review took eleven weeks.",
    h1Recognized: 128_000,
  },
  {
    name: "Cinderland Steel",
    segment: "Metals",
    sites: 1,
    status: "contracted",
    since: "2026",
    note: "Coil trailers. Human remains in cab for public-road hops.",
    h1Recognized: 110_000,
  },
  {
    name: "Bluebarn Produce",
    segment: "Wholesale produce",
    sites: 1,
    status: "contracted",
    since: "2026",
    note: "Dawn arrivals. Software sequences the dock doors.",
    h1Recognized: 95_000,
  },
  {
    name: "Westfork Apparel",
    segment: "Retail DC",
    sites: 2,
    status: "contracted",
    since: "2025",
    note: "Two coastal DCs, one shared playbook.",
    h1Recognized: 210_000,
  },
  {
    name: "Oakridge Pharma Logistics",
    segment: "Pharma 3PL",
    sites: 2,
    status: "contracted",
    since: "2026",
    note: "Validated SOP. No model weights leave the site.",
    h1Recognized: 195_000,
  },
  {
    name: "Flatland Grain",
    segment: "Ag export",
    sites: 1,
    status: "contracted",
    since: "2026",
    note: "Seasonal pulse. Contracted minimum through harvest.",
    h1Recognized: 85_000,
  },
];

export const PILOTS: readonly Account[] = [
  {
    name: "Atlas Freightways",
    segment: "Truckload",
    sites: 2,
    status: "pilot",
    since: "2026",
    note: "Paid 60-day pilot. Conversion decision in September.",
    h1Recognized: 0,
  },
  {
    name: "Pinebelt Wholesale",
    segment: "Foodservice",
    sites: 1,
    status: "pilot",
    since: "2026",
    note: "Software on their spotters. No Acme vehicle on site.",
    h1Recognized: 0,
  },
  {
    name: "Silvercurrent Ports",
    segment: "Port",
    sites: 1,
    status: "pilot",
    since: "2026",
    note: "Second port after Harborline. Different ILWU local.",
    h1Recognized: 0,
  },
];

export const CONTRACTED = ACCOUNTS.filter((account) => account.status === "contracted");
