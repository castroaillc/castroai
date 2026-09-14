"use client"

import Link from "next/link"
import { Building2Icon, CreditCardIcon, MailIcon, UsersIcon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { CreateOrganizationDialog } from "@/components/create-organization-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { data: session } = authClient.useSession()
  const { data: activeOrganization, isPending } = authClient.useActiveOrganization()
  const { data: organizations, isPending: organizationsPending } = authClient.useListOrganizations()

  const firstName = session?.user.name?.split(" ")[0]

  // A brand-new session has no active organization yet even if the user
  // belongs to one — it gets auto-selected by OrgSwitcher. Keep showing the
  // loading state instead of flashing the "create organization" empty state.
  const awaitingAutoSelect =
    !activeOrganization && !!organizations && organizations.length > 0

  if (isPending || organizationsPending || awaitingAutoSelect) {
    return (
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    )
  }

  if (!activeOrganization) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-none border border-dashed p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
          <Building2Icon className="size-6 text-muted-foreground" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-semibold tracking-wide uppercase">
            Welcome{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first organization to invite teammates and manage billing.
          </p>
        </div>
        <CreateOrganizationDialog trigger={<Button>Create organization</Button>} />
      </div>
    )
  }

  const pendingInvites = activeOrganization.invitations.filter(
    (invitation: { status: string }) => invitation.status === "pending"
  ).length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold tracking-wide uppercase">
          Welcome{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening at {activeOrganization.name}.
        </p>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Members</CardDescription>
            <CardTitle className="text-3xl normal-case">
              {activeOrganization.members.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pending invitations</CardDescription>
            <CardTitle className="text-3xl normal-case">{pendingInvites}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Plan</CardDescription>
            <CardTitle className="text-3xl normal-case">Free</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick links</CardTitle>
          <CardDescription>Common organization and billing tasks.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-3">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/dashboard/settings/organization?tab=members" />}
          >
            <UsersIcon />
            Manage members
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/dashboard/settings/organization?tab=invitations" />}
          >
            <MailIcon />
            Invite teammates
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/dashboard/settings/billing" />}>
            <CreditCardIcon />
            Manage subscription
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
