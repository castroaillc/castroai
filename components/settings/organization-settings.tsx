"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Building2Icon, PlusIcon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { CreateOrganizationDialog } from "@/components/create-organization-dialog"
import { OrganizationGeneralForm } from "@/components/settings/organization-general-form"
import { MembersTable } from "@/components/settings/members-table"
import { InvitationsPanel } from "@/components/settings/invitations-panel"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TABS = ["general", "members", "invitations"] as const
type Tab = (typeof TABS)[number]

export function OrganizationSettings() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedTab = searchParams.get("tab")
  const [tab, setTab] = React.useState<Tab>(
    TABS.includes(requestedTab as Tab) ? (requestedTab as Tab) : "general"
  )

  const { data: session } = authClient.useSession()
  const { data: activeOrganization, isPending } = authClient.useActiveOrganization()
  const { data: activeMember } = authClient.useActiveMember()
  const { data: organizations, isPending: organizationsPending } = authClient.useListOrganizations()

  function handleTabChange(value: string) {
    setTab(value as Tab)
    router.replace(`/dashboard/settings/organization?tab=${value}`, { scroll: false })
  }

  // A brand-new session has no active organization yet even if the user
  // belongs to one — it gets auto-selected by OrgSwitcher. Keep showing the
  // loading state instead of flashing the "create organization" empty state.
  const awaitingAutoSelect =
    !activeOrganization && !!organizations && organizations.length > 0

  if (isPending || organizationsPending || awaitingAutoSelect) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!activeOrganization || !session) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-none border border-dashed p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
          <Building2Icon className="size-6 text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-wide uppercase">
            No organization yet
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create an organization to manage members, invitations, and billing.
          </p>
        </div>
        <CreateOrganizationDialog
          trigger={
            <Button>
              <PlusIcon />
              Create organization
            </Button>
          }
        />
      </div>
    )
  }

  const role = activeMember?.role ?? "member"
  const canManage = role === "owner" || role === "admin"
  const ownerCount = activeOrganization.members.filter(
    (m: { role: string }) => m.role === "owner"
  ).length

  return (
    <Tabs value={tab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="members">
          Members
          <span className="ml-1 text-muted-foreground">{activeOrganization.members.length}</span>
        </TabsTrigger>
        <TabsTrigger value="invitations">
          Invitations
          <span className="ml-1 text-muted-foreground">
            {
              activeOrganization.invitations.filter(
                (i: { status: string }) => i.status === "pending"
              ).length
            }
          </span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="mt-4">
        <OrganizationGeneralForm
          organizationId={activeOrganization.id}
          initialName={activeOrganization.name}
          initialSlug={activeOrganization.slug}
          initialLogo={activeOrganization.logo ?? null}
          canUpdate={canManage}
          canDelete={role === "owner"}
        />
      </TabsContent>
      <TabsContent value="members" className="mt-4">
        <MembersTable
          members={activeOrganization.members}
          currentUserId={session.user.id}
          currentUserRole={role}
          ownerCount={ownerCount}
        />
      </TabsContent>
      <TabsContent value="invitations" className="mt-4">
        <InvitationsPanel
          organizationId={activeOrganization.id}
          invitations={activeOrganization.invitations}
          canManage={canManage}
        />
      </TabsContent>
    </Tabs>
  )
}
