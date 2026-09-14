"use client"

import * as React from "react"
import Link from "next/link"
import {
  Building2Icon,
  ChevronsUpDownIcon,
  PlusIcon,
  SettingsIcon,
  UsersIcon,
  MailPlusIcon,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { CreateOrganizationDialog } from "@/components/create-organization-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function OrgSwitcher() {
  const { data: organizations } = authClient.useListOrganizations()
  const { data: activeOrganization, isPending } = authClient.useActiveOrganization()
  const [createOpen, setCreateOpen] = React.useState(false)

  // A user only ever has one organization. A brand-new session has no
  // active organization set yet even if they already belong to one, so
  // re-activate it automatically instead of asking them to pick it.
  const autoSelected = React.useRef(false)
  React.useEffect(() => {
    if (
      !autoSelected.current &&
      !isPending &&
      !activeOrganization &&
      organizations &&
      organizations.length > 0
    ) {
      autoSelected.current = true
      authClient.organization.setActive({ organizationId: organizations[0].id })
    }
  }, [isPending, activeOrganization, organizations])

  const hasOrganization = !!activeOrganization || (organizations?.length ?? 0) > 0

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Building2Icon className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {isPending
                  ? "Loading…"
                  : (activeOrganization?.name ?? "No organization")}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {activeOrganization
                  ? `${activeOrganization.members.length} member${activeOrganization.members.length === 1 ? "" : "s"}`
                  : "Create one to get started"}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start" sideOffset={4}>
            {activeOrganization ? (
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={<Link href="/dashboard/settings/organization?tab=general" />}
                >
                  <SettingsIcon className="text-muted-foreground" />
                  General settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={<Link href="/dashboard/settings/organization?tab=members" />}
                >
                  <UsersIcon className="text-muted-foreground" />
                  Members
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={<Link href="/dashboard/settings/organization?tab=invitations" />}
                >
                  <MailPlusIcon className="text-muted-foreground" />
                  Invitations
                </DropdownMenuItem>
              </DropdownMenuGroup>
            ) : (
              !hasOrganization && (
                <DropdownMenuItem onClick={() => setCreateOpen(true)}>
                  <PlusIcon className="text-muted-foreground" />
                  Create organization
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <CreateOrganizationDialog open={createOpen} onOpenChange={setCreateOpen} />
    </SidebarMenu>
  )
}
