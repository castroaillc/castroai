"use client"

import Link from "next/link"
import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const links = [
  { href: "/case-studies", label: "Case Studies" },
  { href: "/book-a-call", label: "Book a call" },
]

/**
 * Marketing site nav. Renders the full link row on md+ screens; below that,
 * a menu button opens the same links (plus auth actions) in a Sheet so
 * Login/Get Started (or Dashboard) stay reachable on small screens instead
 * of overflowing the header.
 */
export function MarketingNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <>
      <nav className="hidden items-center gap-4 md:flex">
        {links.map((link) => (
          <Button
            key={link.href}
            variant="ghost"
            nativeButton={false}
            render={<Link href={link.href} />}
          >
            {link.label}
          </Button>
        ))}
        {isAuthenticated ? (
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

      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            />
          }
        >
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col px-8">
            {links.map((link) => (
              <SheetClose
                key={link.href}
                nativeButton={false}
                render={<Link href={link.href} />}
                className="border-b py-4 text-sm font-semibold tracking-wide text-foreground uppercase"
              >
                {link.label}
              </SheetClose>
            ))}
            {isAuthenticated ? (
              <SheetClose
                nativeButton={false}
                render={<Link href="/dashboard" />}
                className="py-4 text-sm font-semibold tracking-wide text-foreground uppercase"
              >
                Dashboard
              </SheetClose>
            ) : (
              <>
                <SheetClose
                  nativeButton={false}
                  render={<Link href="/login" />}
                  className="border-b py-4 text-sm font-semibold tracking-wide text-foreground uppercase"
                >
                  Login
                </SheetClose>
                <SheetClose
                  nativeButton={false}
                  render={<Link href="/login" />}
                  className="py-4 text-sm font-semibold tracking-wide text-primary uppercase"
                >
                  Get Started
                </SheetClose>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
