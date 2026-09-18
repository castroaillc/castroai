"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { AgentDefinition } from "@/lib/agents"

export function NavAgents({
  agents,
  icons,
}: {
  agents: AgentDefinition[]
  icons: Record<string, React.ReactNode>
}) {
  const pathname = usePathname()

  const departments = new Map<string, AgentDefinition[]>()
  for (const agent of agents) {
    departments.set(agent.pillar, [...(departments.get(agent.pillar) ?? []), agent])
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center gap-2">
        Agents
        <Badge variant="secondary">Beta</Badge>
      </SidebarGroupLabel>
      <div className="flex flex-col gap-3">
        {Array.from(departments.entries()).map(([department, departmentAgents]) => (
          <div key={department}>
            <p className="px-3 text-[0.65rem] font-semibold tracking-wider text-sidebar-foreground/50 uppercase">
              {department}
            </p>
            <SidebarMenu>
              {departmentAgents.map((agent) => (
                <SidebarMenuItem key={agent.slug}>
                  <SidebarMenuButton
                    tooltip={agent.name}
                    isActive={pathname === `/dashboard/agents/${agent.slug}`}
                    render={<Link href={`/dashboard/agents/${agent.slug}`} />}
                  >
                    {icons[agent.slug]}
                    <span>{agent.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        ))}
      </div>
    </SidebarGroup>
  )
}
