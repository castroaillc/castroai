import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-32 text-center">
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Run your work in one place
      </h1>
      <p className="max-w-md text-lg text-muted-foreground">
        castroai brings your team, projects, and data together in a single
        dashboard.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button size="lg" nativeButton={false} render={<Link href="/login" />}>
          Get Started
        </Button>
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          render={<Link href="/login" />}
        >
          Login
        </Button>
      </div>
    </section>
  )
}
