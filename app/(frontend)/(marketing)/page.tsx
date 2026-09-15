import Image from "next/image"
import Link from "next/link"

import { ContactForm } from "@/components/contact-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCaseStudies, getCaseStudyGridClass } from "@/lib/case-studies"
import { getMediaUrl } from "@/lib/media"
import { getPayloadClient } from "@/lib/payload"
import { getTestimonials } from "@/lib/testimonials"

export default async function Home() {
  const payload = await getPayloadClient()
  const [landing, caseStudies, testimonials] = await Promise.all([
    payload.findGlobal({ slug: "landing" }),
    getCaseStudies({ limit: 3 }),
    getTestimonials(),
  ])

  return (
    <>
      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-32 text-center">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {landing.heading}
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          {landing.subheading}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href={landing.primaryCta.href} />}
          >
            {landing.primaryCta.label}
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href={landing.secondaryCta.href} />}
          >
            {landing.secondaryCta.label}
          </Button>
        </div>
      </section>

      {landing.agents && landing.agents.length > 0 && (
        <section className="border-t bg-muted/30 px-6 py-24">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {landing.pillarsHeading}
              </h2>
              <p className="mt-3 text-muted-foreground">{landing.pillarsSubheading}</p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {landing.agents.map((agent) => (
                <Card key={agent.id} className="h-full">
                  <CardHeader>
                    <Badge variant="secondary" className="text-primary">
                      {agent.pillar}
                    </Badge>
                    <CardTitle className="normal-case">{agent.name}</CardTitle>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {caseStudies.length > 0 && (
        <section className="border-t px-6 py-24">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {landing.caseStudiesHeading}
              </h2>
              <p className="mt-3 text-muted-foreground">{landing.caseStudiesSubheading}</p>
            </div>

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

            <div className="mt-10 text-center">
              <Button variant="outline" nativeButton={false} render={<Link href="/case-studies" />}>
                View all case studies
              </Button>
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="border-t bg-muted/30 px-6 py-24">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {landing.testimonialsHeading}
              </h2>
              <p className="mt-3 text-muted-foreground">{landing.testimonialsSubheading}</p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => {
                const avatarUrl = getMediaUrl(testimonial.avatar)

                return (
                  <Card key={testimonial.id} className="h-full">
                    <CardHeader>
                      <CardDescription className="text-base text-foreground">
                        &ldquo;{testimonial.quote}&rdquo;
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="gap-3">
                      {avatarUrl && (
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={avatarUrl}
                            alt={testimonial.authorName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold">{testimonial.authorName}</p>
                        {(testimonial.authorRole || testimonial.authorCompany) && (
                          <p className="text-xs text-muted-foreground">
                            {[testimonial.authorRole, testimonial.authorCompany]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="border-t px-6 py-24">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {landing.contactHeading}
            </h2>
            <p className="mt-3 text-muted-foreground">{landing.contactSubheading}</p>
          </div>

          <div className="mx-auto mt-10 max-w-xl">
            <ContactForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Prefer to talk live?{" "}
              <Link href="/book-a-call" className="font-medium text-foreground hover:underline">
                Book a call &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
