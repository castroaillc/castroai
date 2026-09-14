"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { OrgSwitcher } from "@/components/org-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, Building2Icon, CreditCardIcon } from "lucide-react"

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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: user.name, email: user.email, avatar: user.image ?? "" }} />
      </SidebarFooter>
    </Sidebar>
  )
}
