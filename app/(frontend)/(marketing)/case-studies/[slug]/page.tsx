import type { Metadata } from "next"
import { RichText } from "@payloadcms/richtext-lexical/react"
import Image from "next/image"
import { notFound } from "next/navigation"

import { getCaseStudies, getCaseStudyBySlug } from "@/lib/case-studies"
import { getMediaUrl } from "@/lib/media"
import { defaultOgImage } from "@/lib/site"

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies()
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug)
  if (!caseStudy) return {}

  const title = caseStudy.meta?.title || `${caseStudy.title} | castroai Case Studies`
  const description = caseStudy.meta?.description || caseStudy.excerpt
  const imageUrl = getMediaUrl(caseStudy.meta?.image ?? caseStudy.heroImage)
  // A page that defines its own `openGraph` replaces the parent's entirely
  // (Next.js doesn't deep-merge it), so fall back to the default image here
  // explicitly rather than relying on inheritance.
  const image = imageUrl ? { url: imageUrl } : defaultOgImage

  return {
    title,
    description,
    alternates: {
      canonical: `/case-studies/${caseStudy.slug}`,
    },
    openGraph: {
      title,
      description,
      siteName: "castroai",
      type: "article",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug)
  if (!caseStudy) notFound()

  const imageUrl = getMediaUrl(caseStudy.heroImage)

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="text-center">
        {caseStudy.client && (
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {caseStudy.client}
            {caseStudy.industry ? ` · ${caseStudy.industry}` : ""}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {caseStudy.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{caseStudy.excerpt}</p>
      </div>

      {imageUrl && (
        <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={imageUrl}
            alt={
              typeof caseStudy.heroImage === "object" ? caseStudy.heroImage?.alt || "" : ""
            }
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {caseStudy.content && (
        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
          <RichText data={caseStudy.content} />
        </div>
      )}
    </article>
  )
}
