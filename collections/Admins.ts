import type { CollectionConfig } from 'payload'

// CMS admins who can log in to /admin. Separate from the app's own
// better-auth "user" table (lib/auth-schema.ts) - these two user systems
// are intentionally independent.
export const Admins: CollectionConfig = {
  slug: 'admins',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
