import Link from "next/link"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link href="/" className="font-semibold">
          castroai
        </Link>
        <nav className="flex items-center gap-4">
          {session ? (
            <Button nativeButton={false} render={<Link href="/dashboard" />}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                Login
              </Button>
              <Button nativeButton={false} render={<Link href="/login" />}>
                Get Started
              </Button>
            </>
          )}
        </nav>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
