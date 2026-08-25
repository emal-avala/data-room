/**
 * Acme Corporation — worked example for the data room.
 *
 * Every public IR surface should read from this module (or from metrics /
 * financials / customers) instead of restating facts. The company is fictional.
 */

export const COMPANY = {
  name: "Acme Corporation",
  legalName: "Acme Corporation",
  shortName: "Acme",
  domain: "acme.example",
  tagline: "Autonomous yard operations for the modern distribution center.",
  oneLiner:
    "Acme runs the yard: perception, dispatch, and electric tractors that move trailers between the gate and the dock without a human in the cab.",
  wedge:
    "We sell the operating system first. Vehicles are optional. A site that already owns spotter trucks can run Acme software on the existing fleet.",
  founded: 2022,
  headquarters: "Chicago, Illinois",
  roundLabel: "Series A",
  dataAsOf: "June 2026 (preliminary close)",
} as const;

export const FOUNDER = {
  name: "Jordan Hale",
  title: "Chief Executive Officer, co-founder",
  email: "jordan@acme.example",
  phone: "+1 (312) 555-0142",
  location: "Chicago",
  origin:
    "Jordan spent eight years on off-highway autonomy at Caterpillar, then four years at Amazon Robotics building the software that sequences work inside fulfillment centers. The bottleneck was never the robot arm. It was the yard outside the building — unmanaged, analog, and the reason outbound trailers sat for hours.",
  fit: [
    "Has shipped autonomy into unionized industrial sites, not only greenfield labs.",
    "Knows the buyer: VP of transportation and the DC general manager, not a chief digital officer shopping a pilot.",
    "Has run a P&L on hardware-adjacent software and will not fund a vehicle company by accident.",
  ],
  prior: [
    "Caterpillar Autonomous Haulage — perception lead for off-highway trucks, 2014–2022.",
    "Amazon Robotics — yard and trailer-yard software, 2018–2022 (overlapped as an advisor, then full-time).",
    "University of Illinois Urbana-Champaign, M.S. Mechanical Engineering.",
  ],
} as const;

export const CTO = {
  name: "Priya Raman",
  title: "Chief Technology Officer, co-founder",
  email: "priya@acme.example",
  origin:
    "Priya built perception stacks for agricultural machines at John Deere and taught robot learning at CMU. She joined Jordan in 2022 because the yard is a closed world — painted lines, repeated geometry, the same fifty trailers every night — and that is where learned autonomy actually sticks.",
} as const;

export const LEADERSHIP = [
  FOUNDER,
  CTO,
  {
    name: "Marcus Chen",
    title: "VP, Customer Delivery",
    email: "marcus@acme.example",
    origin: "Ran North American implementations for a warehouse WMS vendor. Owns go-live, not slides.",
  },
  {
    name: "Elena Voss",
    title: "VP, Finance",
    email: "elena@acme.example",
    origin: "Controller at a public industrial OEM. Closes the books; does not forecast hope.",
  },
] as const;

export const OFFICES = [
  { city: "Chicago", role: "Headquarters · product, finance, delivery", people: 22 },
  { city: "Pittsburgh", role: "Perception and onboard software", people: 11 },
  { city: "Dallas", role: "Field engineers embedded at customer yards", people: 8 },
] as const;

export const BACKERS = [
  { name: "Harbor Peak", round: "Seed lead", year: 2023 },
  { name: "Redwood Seed", round: "Seed", year: 2023 },
  { name: "Northline Capital", round: "Seed", year: 2024 },
  { name: "Operators (angels)", round: "Seed", year: "2023–2024" },
] as const;

export const RISKS = [
  {
    title: "Customer concentration",
    body: "The two largest accounts were 38% of H1 2026 recognized revenue. The plan funds a second delivery pod so a single delayed go-live cannot flatten a quarter.",
  },
  {
    title: "Union and safety sign-off",
    body: "Every live site required a joint safety review. We do not deploy a driver-out tractor until the local committee has ridden along. That is a feature. It is also a calendar risk.",
  },
  {
    title: "Hardware optionality",
    body: "Customers ask us to sell the tractor. We will, through a partner. We will not take inventory risk or a vehicle gross-margin story into the next board meeting.",
  },
  {
    title: "Weather and edge cases",
    body: "Snow, standing water, and unmarked construction zones still fall back to a human. The product is measured on docks-per-hour, not on a claim of full autonomy.",
  },
] as const;
