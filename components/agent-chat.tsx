"use client"

import { useState } from "react"
import { useEveAgent } from "eve/react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export function AgentChat({ agent, name }: { agent: string; name: string }) {
  const [draft, setDraft] = useState("")
  const chat = useEveAgent({ agent })

  const isBusy = chat.status === "submitted" || chat.status === "streaming"
  const isResuming = chat.status === "resuming"

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const message = draft.trim()
    if (message.length === 0 || isResuming) return
    setDraft("")
    void chat.send(message, isBusy ? { turnPolicy: "steer" } : undefined)
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-none border p-4">
        {chat.data.messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Send {name} a brief to get started — a topic, the platform(s), and any tone or
            brand notes.
          </p>
        ) : (
          chat.data.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[85%] rounded-none border px-4 py-3 text-sm whitespace-pre-wrap",
                message.role === "user"
                  ? "ml-auto border-transparent bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {message.parts.map((part, index) =>
                part.type === "text" ? <span key={index}>{part.text}</span> : null
              )}
            </div>
          ))
        )}
        {chat.status === "error" && chat.error ? (
          <p className="text-sm text-destructive">{chat.error.message}</p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              handleSubmit(event)
            }
          }}
          disabled={isResuming}
          placeholder={`Message ${name}...`}
          className="min-h-16 flex-1 resize-none"
        />
        <Button type="submit" disabled={isResuming || draft.trim().length === 0}>
          Send
        </Button>
      </form>
    </div>
  )
}
