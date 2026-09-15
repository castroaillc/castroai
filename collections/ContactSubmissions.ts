import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'company', 'createdAt'],
  },
  // No `access` override: Payload's default (admin-only) applies to every
  // operation. The landing page's contact form still works because it
  // submits through a server action using the Local API, which bypasses
  // access control — there's no public REST/GraphQL create endpoint here.
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
  ],
}
