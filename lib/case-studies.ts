import { getPayloadClient } from "./payload"

// overrideAccess: false delegates "is this published?" to the collection's
// own access control (collections/CaseStudies.ts) so there's one place that
// defines what's publicly visible.
export async function getCaseStudies({ limit }: { limit?: number } = {}) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: "case-studies",
    sort: "-publishedAt",
    depth: 1,
    overrideAccess: false,
    ...(limit && { limit }),
  })

  return docs
}

export async function getCaseStudyBySlug(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: "case-studies",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })

  return docs[0] ?? null
}

/**
 * Grid classes for the case-study cards. With fewer items than columns,
 * a full 3-col grid leaves the row visibly half-empty — so cap the grid's
 * width (and center it) to however many cards actually exist.
 */
export function getCaseStudyGridClass(count: number) {
  if (count <= 1) return "mx-auto grid max-w-sm gap-6"
  if (count === 2) return "mx-auto grid max-w-3xl gap-6 sm:grid-cols-2"
  return "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
}
