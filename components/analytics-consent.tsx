"use client"

import * as React from "react"
import { GoogleAnalytics } from "@next/third-parties/google"

import { Button } from "@/components/ui/button"

const STORAGE_KEY = "cookie-consent"
const CONSENT_EVENT = "cookie-consent:change"
const REOPEN_EVENT = "cookie-consent:reopen"
type Consent = "granted" | "denied"

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

function readConsent(): Consent | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === "granted" || stored === "denied" ? stored : null
  } catch {
    return null
  }
}

function getServerConsent() {
  return null
}

function subscribeConsent(onChange: () => void) {
  window.addEventListener("storage", onChange)
  window.addEventListener(CONSENT_EVENT, onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(CONSENT_EVENT, onChange)
  }
}

function writeConsent(value: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Ignore — the choice still applies for this session.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT))
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(REOPEN_EVENT))
}

export function CookiePreferencesLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={openCookiePreferences}>
      Cookie Preferences
    </button>
  )
}

export function AnalyticsConsent() {
  const consent = React.useSyncExternalStore(subscribeConsent, readConsent, getServerConsent)
  const [forceOpen, setForceOpen] = React.useState(false)

  React.useEffect(() => {
    const reopen = () => setForceOpen(true)
    window.addEventListener(REOPEN_EVENT, reopen)
    return () => window.removeEventListener(REOPEN_EVENT, reopen)
  }, [])

  const bannerOpen = forceOpen || consent === null

  function choose(value: Consent) {
    writeConsent(value)
    setForceOpen(false)
  }

  return (
    <>
      {consent === "granted" && gaId && <GoogleAnalytics gaId={gaId} />}
      {bannerOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-4 shadow-lg">
          <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              We use cookies to keep you signed in and, with your permission, to understand how
              the app is used. See our{" "}
              <a href="/privacy" className="underline underline-offset-4 hover:text-foreground">
                Privacy Policy
              </a>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" onClick={() => choose("denied")}>
                Decline
              </Button>
              <Button size="sm" onClick={() => choose("granted")}>
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
