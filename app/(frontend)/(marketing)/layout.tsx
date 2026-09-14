import Link from "next/link"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { CookiePreferencesLink } from "@/components/analytics-consent"
import { Logo } from "@/components/logo"

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link href="/">
          <Logo className="text-lg" />
        </Link>
        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href="/book-a-call" />}
          >
            Book a call
          </Button>
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
      <footer className="border-t">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo className="text-lg" />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              castroai brings your team, projects, and data together in a single dashboard.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Product
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="hover:text-foreground">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-foreground">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/book-a-call" className="hover:text-foreground">
                  Book a call
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <CookiePreferencesLink className="hover:text-foreground" />
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
            <p>&copy; {new Date().getFullYear()} castroai. All rights reserved.</p>
            <a href="mailto:support@castroai.com" className="hover:text-foreground">
              support@castroai.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
