import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'authorCompany', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'authorRole',
      type: 'text',
      admin: { description: 'e.g. Founder & CEO' },
    },
    {
      name: 'authorCompany',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers show first on the landing page.',
      },
    },
  ],
}
