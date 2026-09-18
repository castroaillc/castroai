"use client"

import { useState } from "react"
import { useEveAgent } from "eve/react"
import type { EveMessage, EveMessagePart } from "eve/react"
import {
  BotIcon,
  BriefcaseIcon,
  CameraIcon,
  CheckCircle2Icon,
  CircleAlertIcon,
  ExternalLinkIcon,
  ImageIcon,
  Loader2Icon,
  LogInIcon,
  SendIcon,
  ShieldAlertIcon,
  SparklesIcon,
  XCircleIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const EXAMPLE_PROMPTS = [
  "Draft 3 LinkedIn posts announcing our new pricing page",
  "Turn this into social copy: [paste a blog post or announcement]",
  "Create an Instagram post celebrating our latest case study",
]

const TOOL_META: Record<string, { label: string; verb: string; icon: React.ElementType }> = {
  generate_image: { label: "Image", verb: "Generating image", icon: ImageIcon },
  post_to_linkedin: { label: "LinkedIn", verb: "Posting to LinkedIn", icon: BriefcaseIcon },
  post_to_instagram: { label: "Instagram", verb: "Posting to Instagram", icon: CameraIcon },
}

function ToolActivity({ part }: { part: Extract<EveMessagePart, { type: "dynamic-tool" }> }) {
  const meta = TOOL_META[part.toolName] ?? {
    label: part.toolName,
    verb: `Running ${part.toolName}`,
    icon: SparklesIcon,
  }
  const Icon = meta.icon

  if (part.state === "input-streaming" || part.state === "input-available") {
    return <ActivityRow icon={<Loader2Icon className="animate-spin" />} text={`${meta.verb}…`} />
  }

  // "approval-requested" is handled by the caller (ChatMessage), which has
  // access to onRespond — it never reaches this component.

  if (part.state === "approval-responded") {
    return <ActivityRow icon={<Loader2Icon className="animate-spin" />} text={`${meta.verb}…`} />
  }

  if (part.state === "output-denied") {
    return (
      <ActivityRow
        icon={<XCircleIcon className="text-muted-foreground" />}
        text={`${meta.label} declined — nothing was posted.`}
        muted
      />
    )
  }

  if (part.state === "output-error") {
    return (
      <div className="flex items-start gap-2 rounded-none border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
        <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
        <span>{part.errorText}</span>
      </div>
    )
  }

  if (part.state === "output-available") {
    return (
      <div className="flex flex-col gap-2 rounded-none border bg-muted/40 p-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon className="size-4 text-primary" />
          {meta.label} done
        </div>
        <ToolPreview toolName={part.toolName} input={part.input} output={part.output} />
      </div>
    )
  }

  return null
}

function ActivityRow({
  icon,
  text,
  muted,
}: {
  icon: React.ReactNode
  text: string
  muted?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-none border border-dashed p-3 text-sm",
        muted ? "text-muted-foreground" : "text-foreground"
      )}
    >
      <span className="[&_svg]:size-4">{icon}</span>
      {text}
    </div>
  )
}

// Renders the input/output that matters for a given tool, so an approval or
// result card shows the actual content (the post text, the image) instead of
// raw JSON.
function ToolPreview({
  toolName,
  input,
  output,
}: {
  toolName: string
  input?: unknown
  output?: unknown
}) {
  const record = (v: unknown) => (v && typeof v === "object" ? (v as Record<string, unknown>) : {})
  const inputObj = record(input)
  const outputObj = record(output)

  if (toolName === "generate_image") {
    const imageUrl = (outputObj.imageUrl as string | undefined) ?? undefined
    return (
      <div className="flex flex-col gap-2">
        {inputObj.prompt ? (
          <p className="text-sm text-muted-foreground italic">&ldquo;{inputObj.prompt as string}&rdquo;</p>
        ) : null}
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="Generated" className="max-h-64 w-fit rounded-none border" />
        ) : null}
      </div>
    )
  }

  if (toolName === "post_to_linkedin") {
    return (
      <p className="rounded-none border bg-background p-3 text-sm whitespace-pre-wrap">
        {(inputObj.text as string) ?? ""}
      </p>
    )
  }

  if (toolName === "post_to_instagram") {
    return (
      <div className="flex flex-col gap-2">
        {inputObj.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={inputObj.imageUrl as string}
            alt="To publish"
            className="max-h-64 w-fit rounded-none border"
          />
        ) : null}
        {inputObj.caption ? (
          <p className="rounded-none border bg-background p-3 text-sm whitespace-pre-wrap">
            {inputObj.caption as string}
          </p>
        ) : null}
      </div>
    )
  }

  return null
}

export function AgentChat({ agent, name }: { agent: string; name: string }) {
  const [draft, setDraft] = useState("")
  const chat = useEveAgent({ agent })

  const isBusy = chat.status === "submitted" || chat.status === "streaming"
  const isResuming = chat.status === "resuming"

  function send(message: string) {
    if (message.trim().length === 0 || isResuming) return
    setDraft("")
    void chat.send(message, isBusy ? { turnPolicy: "steer" } : undefined)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    send(draft)
  }

  function respond(requestId: string, optionId: string) {
    void chat.respond([{ requestId, optionId }])
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-none border p-4">
        {chat.data.messages.length === 0 ? (
          <EmptyState name={name} onPick={send} />
        ) : (
          chat.data.messages.map((message) => (
            <ChatMessage key={message.id} message={message} onRespond={respond} />
          ))
        )}

        {isBusy ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2Icon className="size-3.5 animate-spin" />
            {name} is working…
          </div>
        ) : null}

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
          placeholder={`Message ${name}... (Shift+Enter for a new line)`}
          className="min-h-16 flex-1 resize-none"
        />
        <Button type="submit" disabled={isResuming || draft.trim().length === 0}>
          <SendIcon />
          Send
        </Button>
      </form>
    </div>
  )
}

function EmptyState({ name, onPick }: { name: string; onPick: (text: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <SparklesIcon className="size-6" />
      </div>
      <div className="max-w-sm">
        <p className="font-medium">Tell {name} what you need</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Give a topic, the platform(s), and any tone or brand notes. {name} drafts the copy (and
          an image for Instagram), then asks before publishing anything.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPick(prompt)}
            className="rounded-none border px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}

function ChatMessage({
  message,
  onRespond,
}: {
  message: EveMessage
  onRespond: (requestId: string, optionId: string) => void
}) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      {!isUser ? (
        <Avatar size="sm" className="mt-0.5">
          <AvatarFallback>
            <BotIcon className="size-3.5" />
          </AvatarFallback>
        </Avatar>
      ) : null}

      <div className={cn("flex max-w-[85%] flex-col gap-2", isUser && "items-end")}>
        {message.parts.map((part, index) => {
          if (part.type === "text") {
            return part.text ? (
              <p
                key={index}
                className={cn(
                  "rounded-none border px-4 py-3 text-sm whitespace-pre-wrap",
                  isUser
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {part.text}
              </p>
            ) : null
          }

          if (part.type === "dynamic-tool") {
            if (part.state === "approval-requested") {
              const request = part.toolMetadata?.eve?.inputRequest
              const meta = TOOL_META[part.toolName] ?? {
                label: part.toolName,
                verb: `Run ${part.toolName}`,
                icon: SparklesIcon,
              }
              return (
                <div
                  key={index}
                  className="flex w-full flex-col gap-3 rounded-none border border-primary bg-primary/5 p-4"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldAlertIcon className="size-4 text-primary" />
                    Approve before this goes live — {meta.label}
                  </div>
                  <ToolPreview toolName={part.toolName} input={part.input} />
                  {request ? (
                    <div className="flex gap-2">
                      {request.options?.map((option) => (
                        <Button
                          key={option.id}
                          size="sm"
                          variant={option.id === "approve" ? "default" : "outline"}
                          onClick={() => onRespond(request.requestId, option.id)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            }

            return (
              <div key={index} className="w-full">
                <ToolActivity part={part} />
              </div>
            )
          }

          if (part.type === "authorization") {
            if (part.state === "completed") {
              const authorized = part.outcome === "authorized"
              return (
                <ActivityRow
                  key={index}
                  icon={
                    authorized ? (
                      <CheckCircle2Icon className="text-primary" />
                    ) : (
                      <XCircleIcon className="text-muted-foreground" />
                    )
                  }
                  text={
                    authorized
                      ? `${part.displayName} connected.`
                      : `${part.displayName} authorization ${part.outcome}${part.reason ? ` — ${part.reason}` : ""}.`
                  }
                  muted={!authorized}
                />
              )
            }

            return (
              <div
                key={index}
                className="flex w-full flex-col gap-3 rounded-none border border-primary bg-primary/5 p-4"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <LogInIcon className="size-4 text-primary" />
                  Connect {part.displayName}
                </div>
                <p className="text-sm text-muted-foreground">{part.description}</p>
                {part.authorization?.userCode ? (
                  <code className="w-fit rounded-none border bg-background px-2 py-1 text-sm">
                    {part.authorization.userCode}
                  </code>
                ) : null}
                {part.authorization?.url ? (
                  <Button size="sm" render={<a href={part.authorization.url} target="_blank" rel="noopener noreferrer" />}>
                    Sign in to {part.displayName}
                    <ExternalLinkIcon />
                  </Button>
                ) : null}
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
