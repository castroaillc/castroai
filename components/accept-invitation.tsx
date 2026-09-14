"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Building2Icon, Loader2Icon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Invitation = {
  id: string
  email: string
  role: string
  status: string
  organizationName: string
}

export function AcceptInvitation({
  invitationId,
  invitedEmail,
}: {
  invitationId: string
  invitedEmail?: string
}) {
  const router = useRouter()
  const { data: session, isPending: sessionPending } = authClient.useSession()

  const [invitation, setInvitation] = React.useState<Invitation | null>(null)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [actionLoading, setActionLoading] = React.useState<"accept" | "reject" | null>(null)
  const [declined, setDeclined] = React.useState(false)

  const userId = session?.user.id
  const fetchedRef = React.useRef(false)
  React.useEffect(() => {
    if (sessionPending || !userId || fetchedRef.current) return
    fetchedRef.current = true
    let cancelled = false
    authClient.organization
      .getInvitation({ query: { id: invitationId } })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error || !data) {
          setLoadError(error?.message ?? "This invitation is invalid or has expired.")
        } else {
          setInvitation(data as unknown as Invitation)
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [sessionPending, userId, invitationId])

  async function handleAccept() {
    setActionLoading("accept")
    const { error } = await authClient.organization.acceptInvitation({ invitationId })
    setActionLoading(null)
    if (error) {
      toast.error(error.message ?? "Failed to accept invitation")
      return
    }
    toast.success("Invitation accepted")
    router.push("/dashboard")
  }

  async function handleReject() {
    setActionLoading("reject")
    const { error } = await authClient.organization.rejectInvitation({ invitationId })
    setActionLoading(null)
    if (error) {
      toast.error(error.message ?? "Failed to decline invitation")
      return
    }
    setDeclined(true)
  }

  if (sessionPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!session) {
    const redirect = `/accept-invitation/${invitationId}${
      invitedEmail ? `?email=${encodeURIComponent(invitedEmail)}` : ""
    }`
    const loginHref = `/login?redirect=${encodeURIComponent(redirect)}`
    const signupHref = `/signup?redirect=${encodeURIComponent(redirect)}${
      invitedEmail ? `&email=${encodeURIComponent(invitedEmail)}` : ""
    }`
    return (
      <Card>
        <CardHeader>
          <CardTitle>Join the organization</CardTitle>
          <CardDescription>
            {invitedEmail ? (
              <>
                Sign in or create an account with <strong>{invitedEmail}</strong> to accept this
                invitation.
              </>
            ) : (
              "Sign in or create an account to accept this invitation."
            )}
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-2">
          <Button
            variant="outline"
            className="flex-1"
            nativeButton={false}
            render={<Link href={loginHref} />}
          >
            Sign in
          </Button>
          <Button className="flex-1" nativeButton={false} render={<Link href={signupHref} />}>
            Create account
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (declined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invitation declined</CardTitle>
          <CardDescription>You won&apos;t join this organization.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" variant="outline" nativeButton={false} render={<Link href="/dashboard" />}>
            Go to dashboard
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (loadError || !invitation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invitation unavailable</CardTitle>
          <CardDescription>{loadError ?? "This invitation could not be found."}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" variant="outline" nativeButton={false} render={<Link href="/dashboard" />}>
            Go to dashboard
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <Building2Icon className="size-5 text-muted-foreground" />
        </div>
        <CardTitle className="mt-2">Join {invitation.organizationName}</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{invitation.organizationName}</strong> as{" "}
          {invitation.role === "admin" ? "an" : "a"} {invitation.role}.
        </CardDescription>
      </CardHeader>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1" disabled={!!actionLoading} onClick={handleReject}>
          {actionLoading === "reject" && <Loader2Icon className="animate-spin" />}
          Decline
        </Button>
        <Button className="flex-1" disabled={!!actionLoading} onClick={handleAccept}>
          {actionLoading === "accept" && <Loader2Icon className="animate-spin" />}
          Accept
        </Button>
      </CardFooter>
    </Card>
  )
}
