import { getPayloadClient } from "./payload"

// overrideAccess: false delegates "is this published?" to the collection's
// own access control (collections/CaseStudies.ts) so there's one place that
// defines what's publicly visible.
export async function getCaseStudies() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: "case-studies",
    sort: "-publishedAt",
    depth: 1,
    overrideAccess: false,
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
