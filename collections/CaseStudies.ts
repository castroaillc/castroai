import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const generateSlug: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  const source = data?.slug || data?.title || originalDoc?.title
  if (!source) return data

  return { ...data, slug: formatSlug(source) }
}

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'publishedAt'],
  },
  // Anyone can read; anonymous requests only see case studies that have
  // been published (a publishedAt date in the past). Logged-in requests
  // (the admin panel) always see everything, including unpublished drafts.
  access: {
    read: ({ req }) => {
      if (req.user) return true

      return {
        publishedAt: {
          less_than_equal: new Date().toISOString(),
        },
      }
    },
  },
  hooks: {
    beforeValidate: [generateSlug],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from the title if left blank.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Leave blank to keep this case study unpublished.',
      },
    },
    {
      name: 'client',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'industry',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short summary shown on the case studies list and used as the fallback SEO description.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
}
