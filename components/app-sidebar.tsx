"use client"

import * as React from "react"

import { NavAgents } from "@/components/nav-agents"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { OrgSwitcher } from "@/components/org-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  Building2Icon,
  CreditCardIcon,
  TargetIcon,
  MegaphoneIcon,
  HandshakeIcon,
  HeadsetIcon,
  UserSearchIcon,
  GaugeIcon,
} from "lucide-react"
import { agents } from "@/lib/agents"

const agentIcons: Record<string, React.ReactNode> = {
  gtm: <TargetIcon />,
  "social-media": <MegaphoneIcon />,
  sales: <HandshakeIcon />,
  support: <HeadsetIcon />,
  talent: <UserSearchIcon />,
  ops: <GaugeIcon />,
}

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Organization",
      url: "/dashboard/settings/organization",
      icon: <Building2Icon />,
    },
    {
      title: "Billing",
      url: "/dashboard/settings/billing",
      icon: <CreditCardIcon />,
    },
  ],
}

export function AppSidebar({
  user,
  ...props
}: {
  user: {
    name: string
    email: string
    image?: string | null
  }
} & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavAgents agents={agents} icons={agentIcons} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: user.name, email: user.email, avatar: user.image ?? "" }} />
      </SidebarFooter>
    </Sidebar>
  )
}
