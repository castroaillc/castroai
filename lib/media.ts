import type { Media } from "@/payload-types"

// Payload returns a relative URL for local-disk uploads (e.g. dev, or prod
// without BLOB_READ_WRITE_TOKEN) and an absolute URL for Vercel Blob uploads.
// Both are valid as-is: next/image resolves relative paths same-origin, and
// the Metadata API resolves relative URLs against metadataBase (root layout).
export function getMediaUrl(media?: Media | number | null): string | undefined {
  if (!media || typeof media === "number") return undefined

  return media.url ?? undefined
}
