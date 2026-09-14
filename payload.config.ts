import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Admins } from './collections/Admins'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // The Payload admin UI lives at /admin (see app/(payload)) and is
  // deliberately kept separate from the app's own better-auth users -
  // "admins" here are CMS/content editors, not castroai product users.
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname, 'app', '(payload)'),
    },
  },
  collections: [Admins, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // castroai shares this Postgres database with better-auth (lib/auth-schema.ts).
    // Keeping Payload's tables in their own schema stops drizzle-kit's dev push
    // from seeing better-auth's tables as candidates when it diffs the database -
    // without this, it can prompt to "rename" an existing better-auth table (e.g.
    // session/account/user) into one of Payload's tables, which would be destructive.
    schemaName: 'payload',
  }),
  sharp,
  plugins: [
    // Only enabled when BLOB_READ_WRITE_TOKEN is set (e.g. in Vercel).
    // Falls back to local disk storage for local development.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
