import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCaseStudies, getCaseStudyGridClass } from "@/lib/case-studies"
import { getMediaUrl } from "@/lib/media"
import { defaultOgImage } from "@/lib/site"

export const revalidate = 60

const title = "Case Studies — castroai"
const description = "See how teams use castroai to run their work in one place."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "castroai",
    type: "website",
    images: [defaultOgImage],
  },
  twitter: { card: "summary_large_image", title, description, images: [defaultOgImage] },
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies()

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Case studies
        </h1>
        <p className="mt-2 text-muted-foreground">
          Real teams, real results with castroai.
        </p>
      </div>

      {caseStudies.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No case studies published yet.
        </p>
      ) : (
        <div className={`mt-12 ${getCaseStudyGridClass(caseStudies.length)}`}>
          {caseStudies.map((caseStudy) => {
            const imageUrl = getMediaUrl(caseStudy.heroImage)

            return (
              <Card key={caseStudy.id} className="h-full">
                {imageUrl && (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={imageUrl}
                      alt={
                        typeof caseStudy.heroImage === "object"
                          ? caseStudy.heroImage?.alt || ""
                          : ""
                      }
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  {caseStudy.client && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {caseStudy.client}
                    </p>
                  )}
                  <CardTitle className="normal-case">
                    <Link
                      href={`/case-studies/${caseStudy.slug}`}
                      className="hover:underline"
                    >
                      {caseStudy.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{caseStudy.excerpt}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link
                    href={`/case-studies/${caseStudy.slug}`}
                    className="text-sm font-medium hover:underline"
                  >
                    Read the case study &rarr;
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
