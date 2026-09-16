// The platform's "AI team" roster. Mirrors the marketing copy in
// `globals/Landing.ts` so the dashboard and landing page agree on what each
// agent is. `available` agents are wired to a real eve agent (see
// `agents/<slug>/`); the rest render a "coming soon" state.
export type AgentDefinition = {
  slug: string
  pillar: string
  name: string
  description: string
  available: boolean
}

export const agents: AgentDefinition[] = [
  {
    slug: "gtm",
    pillar: "GTM",
    name: "GTM Strategist",
    description:
      "Plans launches, sharpens positioning, and turns customer signals into your next campaign.",
    available: false,
  },
  {
    slug: "social-media",
    pillar: "Social Media",
    name: "Social Media Manager",
    description:
      "Drafts, schedules, and repurposes content across every channel from a single brief.",
    available: true,
  },
  {
    slug: "sales",
    pillar: "Sales",
    name: "Sales Development Rep",
    description: "Qualifies inbound leads, drafts outreach, and keeps your pipeline moving.",
    available: false,
  },
  {
    slug: "support",
    pillar: "Customer Service",
    name: "Support Agent",
    description: "Resolves common tickets instantly and escalates the rest with full context.",
    available: false,
  },
  {
    slug: "talent",
    pillar: "Recruiting",
    name: "Talent Scout",
    description: "Screens candidates, schedules interviews, and keeps your hiring pipeline warm.",
    available: false,
  },
  {
    slug: "ops",
    pillar: "Ops",
    name: "Ops Analyst",
    description: "Tracks KPIs across your tools and flags what needs attention before it's a problem.",
    available: false,
  },
]

export function getAgent(slug: string): AgentDefinition | undefined {
  return agents.find((agent) => agent.slug === slug)
}
