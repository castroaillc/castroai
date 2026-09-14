import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPayloadClient } from "@/lib/payload"

export default async function Home() {
  const payload = await getPayloadClient()
  const landing = await payload.findGlobal({ slug: "landing" })

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
    </>
  )
}
