export type Competitor = {
  name: string;
  thesis: string;
  yardOs: "yes" | "partial" | "no";
  driverOut: "yes" | "partial" | "no";
  softwareFirst: "yes" | "partial" | "no";
  industrialLabor: "yes" | "partial" | "no";
};

export const COMPETITORS: readonly Competitor[] = [
  {
    name: "Acme",
    thesis: "Yard OS first. Autonomy where the geometry repeats. Vehicles optional.",
    yardOs: "yes",
    driverOut: "partial",
    softwareFirst: "yes",
    industrialLabor: "yes",
  },
  {
    name: "Vehicle OEMs",
    thesis: "Sell a driverless tractor. Software is a feature of the asset.",
    yardOs: "no",
    driverOut: "yes",
    softwareFirst: "no",
    industrialLabor: "partial",
  },
  {
    name: "WMS / YMS incumbents",
    thesis: "Door schedules and gate appointments. No perception, no motion.",
    yardOs: "partial",
    driverOut: "no",
    softwareFirst: "yes",
    industrialLabor: "yes",
  },
  {
    name: "Robotaxi stacks",
    thesis: "General driving. The yard is a down-market demo.",
    yardOs: "no",
    driverOut: "yes",
    softwareFirst: "partial",
    industrialLabor: "no",
  },
  {
    name: "In-house DC teams",
    thesis: "A spreadsheet, radios, and a lead spotter. Works until the night shift turns over.",
    yardOs: "no",
    driverOut: "no",
    softwareFirst: "no",
    industrialLabor: "yes",
  },
] as const;

export const AXIS = [
  { key: "yardOs", label: "Yard operating system" },
  { key: "driverOut", label: "Driver-out moves today" },
  { key: "softwareFirst", label: "Software sold without the vehicle" },
  { key: "industrialLabor", label: "Shipped into union / hourly labor" },
] as const;
