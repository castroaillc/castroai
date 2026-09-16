import { notFound } from "next/navigation"

import { AgentChat } from "@/components/agent-chat"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAgent } from "@/lib/agents"

export default async function AgentPage({
  params,
}: {
  params: Promise<{ agent: string }>
}) {
  const { agent: slug } = await params
  const agent = getAgent(slug)

  if (!agent) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <Badge variant="secondary" className="text-primary">
          {agent.pillar}
        </Badge>
        <h1 className="mt-2 font-heading text-xl font-semibold tracking-wide uppercase">
          {agent.name}
        </h1>
        <p className="text-sm text-muted-foreground">{agent.description}</p>
      </div>

      {agent.available ? (
        <AgentChat agent={agent.slug} name={agent.name} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="normal-case">Coming soon</CardTitle>
            <CardDescription>
              {agent.name} isn&apos;t wired up yet. Check back as we roll out more of the team.
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      )}
    </div>
  )
}
