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
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-primary">
            {agent.pillar}
          </Badge>
          {!agent.available ? <Badge variant="outline">Beta</Badge> : null}
        </div>
        <div>
          <h1 className="font-heading text-xl font-semibold tracking-wide uppercase">
            {agent.name}
          </h1>
          <p className="text-sm text-muted-foreground">{agent.description}</p>
        </div>
      </div>

      {agent.available ? (
        <AgentChat agent={agent.slug} name={agent.name} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="normal-case">Coming soon</CardTitle>
            <CardDescription>
              {agent.name} is in private beta — we&apos;re still rolling it out to everyone. Check
              back soon.
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      )}
    </div>
  )
}
