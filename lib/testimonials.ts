import { getPayloadClient } from "./payload"

export async function getTestimonials() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: "testimonials",
    sort: "order",
    depth: 1,
    overrideAccess: false,
  })

  return docs
}
