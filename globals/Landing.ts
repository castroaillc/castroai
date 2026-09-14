import type { GlobalConfig } from 'payload'

export const Landing: GlobalConfig = {
  slug: 'landing',
  admin: {
    group: 'Marketing',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: "Your startup's AI team, on one subscription.",
    },
    {
      name: 'subheading',
      type: 'textarea',
      required: true,
      defaultValue:
        'castroai is an AI team built for startups — GTM, social media, sales, customer service, and more. Activate the agents you need and grow the team as you go.',
    },
    {
      name: 'primaryCta',
      type: 'group',
      label: 'Primary button',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          defaultValue: 'Get Started',
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          defaultValue: '/login',
        },
      ],
    },
    {
      name: 'secondaryCta',
      type: 'group',
      label: 'Secondary button',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          defaultValue: 'Book a call',
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          defaultValue: '/book-a-call',
        },
      ],
    },
    {
      // Field name kept as `pillarsHeading` to match the existing DB column
      // (renaming would require a destructive column rename/migration);
      // the admin label is what editors actually see.
      name: 'pillarsHeading',
      type: 'text',
      label: 'AI team heading',
      required: true,
      defaultValue: 'Meet your AI team',
    },
    {
      name: 'pillarsSubheading',
      type: 'textarea',
      label: 'AI team subheading',
      required: true,
      defaultValue:
        'One subscription staffs every department. Activate the agents each one needs, from GTM to customer service, and add more as you grow.',
    },
    {
      name: 'agents',
      type: 'array',
      labels: { singular: 'Agent', plural: 'Agents' },
      admin: {
        description: 'The agents shown in the "AI team" grid on the landing page.',
      },
      fields: [
        {
          // Field name kept as `pillar` to match the existing DB column;
          // admin label reflects the "AI team" framing.
          name: 'pillar',
          type: 'text',
          label: 'Department',
          required: true,
          admin: { description: 'e.g. GTM, Social Media, Sales, Customer Service' },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
      defaultValue: [
        {
          pillar: 'GTM',
          name: 'GTM Strategist',
          description:
            'Plans launches, sharpens positioning, and turns customer signals into your next campaign.',
        },
        {
          pillar: 'Social Media',
          name: 'Social Media Manager',
          description:
            'Drafts, schedules, and repurposes content across every channel from a single brief.',
        },
        {
          pillar: 'Sales',
          name: 'Sales Development Rep',
          description: 'Qualifies inbound leads, drafts outreach, and keeps your pipeline moving.',
        },
        {
          pillar: 'Customer Service',
          name: 'Support Agent',
          description: 'Resolves common tickets instantly and escalates the rest with full context.',
        },
        {
          pillar: 'Recruiting',
          name: 'Talent Scout',
          description: 'Screens candidates, schedules interviews, and keeps your hiring pipeline warm.',
        },
        {
          pillar: 'Ops',
          name: 'Ops Analyst',
          description: "Tracks KPIs across your tools and flags what needs attention before it's a problem.",
        },
      ],
    },
  ],
}
