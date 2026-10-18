/**
 * The CV, from the owner's LinkedIn profile export (2026-10-18), which the owner supplied as the
 * starting content. Every fact here is the owner's own public statement; dated figures say when.
 *
 * Employer-owned work (ADR-0006 in hllmr-infra): roles at an employer are described only at the
 * level the owner's public profile already describes them. Nothing here is drawn from archived
 * employer material, and none of it is published. Curia is left out (owner decision 2026-10-18).
 */

export interface Role {
  title: string;
  org: string;
  /** e.g. "Feb 2025 – present" */
  dates: string;
  place: string;
  /** One or two sentences. */
  summary: string;
  /** Optional named pieces of work. */
  highlights?: { name: string; text: string }[];
}

export interface Era {
  /** Margin label. */
  k: string;
  /** Margin years. */
  years: string;
  title: string;
  lede: string;
  roles: Role[];
}

export const HEADLINE = "BAS & OT engineering leader. Applied AI and software for physical systems.";

export const SKILLS = [
  "Building automation systems (BAS)",
  "Operational technology (OT)",
  "Systems integration",
  "Commissioning and verification",
  "Engineering leadership and team development",
  "AI-assisted software development",
] as const;

export const ERAS: Era[] = [
  {
    k: "Now",
    years: "2025–",
    title: "Building systems, software and applied AI",
    lede: "Controls engineering by day, software that helps engineering teams work, and a company of my own.",
    roles: [
      {
        title: "Founder & Principal Engineer",
        org: "HLLMR Ventures",
        dates: "Apr 2025 – present",
        place: "Dallas–Fort Worth",
        summary:
          "An AI-focused business incubator and consultancy, grounded in hands-on software development, physical-systems engineering and experience running businesses. I take products from problem definition through implementation, release and maintenance with AI coding agents, and own the engineering decisions, integration, verification and delivery.",
        highlights: [
          {
            name: "Writwall",
            text: "A released governance method and toolkit for AI-assisted development, adapted from construction document control: bounded work orders, independent review and evidence-based acceptance. The public release includes the pilot evidence and its documented limits. Formerly Plumbline.",
          },
          {
            name: "stratum-dsp",
            text: "A pure-Rust audio-analysis library for BPM, key and beat-grid detection, evaluated against a commercial baseline on a 155-track ground-truth set. More than 25,000 package downloads as of September 2026.",
          },
          {
            name: "Silo",
            text: "A cross-platform Farming Simulator mod manager (Rust/Tauri, Svelte) with a separately hosted API that I operate. As of September 2026: 14 releases, 225 installer downloads and 17,844 API requests in the preceding 30 days.",
          },
        ],
      },
      {
        title: "Senior Applications Engineer, Building Automation Systems",
        org: "Enviromatic Systems",
        dates: "Feb 2025 – present",
        place: "Dallas–Fort Worth",
        summary:
          "Design-build and plan/spec BAS engineering for $50K–$2M education and municipal projects, combined with internal software delivery, engineering development and applied AI.",
        highlights: [
          {
            name: "Internal software",
            text: "Built an Excel–Visio integration tool and took it from a manager's request to department-wide adoption with automated updates; colleagues extended it into the successor the 12-engineer HQ team uses. Designed and built an internal operations platform with natural-language querying, and led its migration into the company's Azure environment.",
          },
          {
            name: "Engineering development",
            text: "Wrote the department's official Applications Engineer curriculum, 15 modules and more than 1,100 pages, and taught it in person to half the department.",
          },
          {
            name: "Business cases",
            text: "Developed and presented an Energy Performance Group business case to executive leadership, and a proposal for a formal QA/QC function.",
          },
        ],
      },
    ],
  },
  {
    k: "Businesses",
    years: "2007–2025",
    title: "Running businesses",
    lede: "Owning the P&L, the customers and the consequences, across very different trades.",
    roles: [
      {
        title: "Owner & Operator",
        org: "Liberon LLC",
        dates: "Aug 2024 – Feb 2025",
        place: "United States",
        summary:
          "Independent lease operator with a Class A CDL and all endorsements: freight scheduling, routing, equipment, broker relationships and P&L. The bridge back into engineering.",
      },
      {
        title: "Founder & President",
        org: "Frezerve, Inc. (formerly The Grand River Valley Holding Company)",
        dates: "Oct 2020 – Jul 2024",
        place: "Ashtabula, Ohio",
        summary:
          "Built a freeze-dried food manufacturer from nothing to national distribution in all 50 states, more than $1M in annual revenue and a team of 12. Owned product development, FDA and ODA compliance, manufacturing, supply chain and ERP; led the rebrand and Delaware reincorporation.",
      },
      {
        title: "Founder & Consultant",
        org: "Hellmer Group, LLC",
        dates: "Jan 2018 – Apr 2021",
        place: "United States",
        summary:
          "IT and building-systems consulting for small businesses, and cryptocurrency infrastructure and trading advisory. Wrote and self-published a nonfiction book.",
      },
      {
        title: "Owner & DJ",
        org: "Muziq Productions",
        dates: "Apr 2007 – Mar 2014",
        place: "Washington DC–Baltimore",
        summary:
          "Founded and ran a premium event-services company for weddings, corporate events and school functions; resident VJ at BlackFinn in Washington DC and Bethesda. Still DJing, thirty years on.",
      },
    ],
  },
  {
    k: "Buildings",
    years: "2004–2017",
    title: "Building automation and low-voltage systems",
    lede: "From pulling wire to leading a division, in buildings where failure is not an option.",
    roles: [
      {
        title: "Project Manager",
        org: "RoviSys Building Technologies",
        dates: "Feb 2017 – Dec 2017",
        place: "Aurora, Ohio",
        summary:
          "Directed building automation projects for Ford Motor Company, DuPont and Google, from project plans and on-site supervision through programming, commissioning and post-turnover optimization.",
      },
      {
        title: "Operations Manager",
        org: "Rays Electronics",
        dates: "May 2016 – Oct 2016",
        place: "Oak Harbor, Ohio",
        summary:
          "Reorganized inventory and warehouse operations, launched a new e-commerce site, reconciled accounts and expanded sales channels for a regional electronics retailer.",
      },
      {
        title: "Building Automation Department Head",
        org: "IntraWorks, Inc.",
        dates: "Mar 2014 – Apr 2016",
        place: "Albuquerque, New Mexico",
        summary:
          "Established and led a new building automation division: strategy, staffing, resources and delivery. Designed and implemented BAS for SCIFs, an FAA Air Route Traffic Control Center and Class A office, integrating HVAC, lighting and security.",
      },
      {
        title: "Senior Technician; Junior Project Manager; Systems Applications Engineer / Project Engineer",
        org: "Schneider Electric",
        dates: "Jun 2008 – Apr 2012",
        place: "Columbia, Maryland and Boston, Massachusetts",
        summary:
          "Designed and implemented integrated BAS and security for USAMRIID, NIAID and St. Elizabeths Hospital and was promoted to Project Engineer; ran automation projects at Boston Logan Airport and MIT facilities; led commissioning at United Therapeutics headquarters and INOVA Women's Hospital.",
      },
      {
        title: "Systems Engineer / Drafter",
        org: "COPT Environmental Systems",
        dates: "Oct 2006 – Apr 2008",
        place: "Owings Mills, Maryland",
        summary:
          "Designed, programmed and commissioned BAS for SCIFs, government and intelligence-community data centers in the Fort Meade corridor, Class A office and industrial facilities, with energy performance contracting support.",
      },
      {
        title: "Commercial/Industrial Technician",
        org: "ADT",
        dates: "Aug 2005 – Sep 2006",
        place: "Wilmington, Delaware",
        summary: "Installed, programmed and maintained commercial and industrial security systems, including retrofits into existing infrastructure.",
      },
      {
        title: "Installation/Service Technician",
        org: "Town Security Inc",
        dates: "Aug 2004 – Aug 2005",
        place: "Bel Air, Maryland",
        summary:
          "Intrusion, fire, video, access control and intercom installation and service for residential, commercial and industrial clients. Where the low-voltage foundation started.",
      },
    ],
  },
];

export interface Credential {
  name: string;
  detail: string;
}

export const EDUCATION: Credential[] = [
  { name: "U.S. Navy Nuclear Power Training Command", detail: "Certificate, Nuclear Mechanical Engineering, 1998–2000" },
  { name: "The Community College of Baltimore County", detail: "Business Administration and Management, 2005–2008" },
  { name: "Millis Training Institute", detail: "CDL-A, 2018" },
];

export const CERTIFICATIONS: Credential[] = [
  { name: "Certificate of Completion, Nuclear Power Training Course", detail: "U.S. Navy" },
  { name: "Pelco Endura 2.0 Certified Systems Designer (PCSD)", detail: "Pelco" },
  { name: "Pelco Endura 2.0 Certified Systems Technician (PCST)", detail: "Pelco" },
];

export const HONORS: Credential[] = [{ name: "Recognition and biography published", detail: "The National Dean's List" }];

/** Settings the work has been done in, from the profile summary. */
export const ENVIRONMENTS = [
  "High-containment laboratories",
  "Government and intelligence-community data centers",
  "SCIFs",
  "Hospitals",
  "Airports",
  "An FAA air route traffic control center",
  "Industrial facilities",
] as const;
