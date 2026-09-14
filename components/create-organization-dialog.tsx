"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2Icon } from "lucide-react"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function CreateOrganizationDialog({
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  onCreated,
}: {
  trigger?: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onCreated?: (organizationId: string) => void
}) {
  const router = useRouter()
  const [openState, setOpenState] = React.useState(false)
  const open = openProp ?? openState
  const setOpen = onOpenChangeProp ?? setOpenState
  const [name, setName] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [slugEdited, setSlugEdited] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  function handleNameChange(value: string) {
    setName(value)
    if (!slugEdited) setSlug(slugify(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) return
    setLoading(true)
    const { data, error } = await authClient.organization.create({
      name: name.trim(),
      slug: slug.trim(),
    })
    setLoading(false)
    if (error) {
      toast.error(error.message ?? "Failed to create organization")
      return
    }
    if (data) {
      await authClient.organization.setActive({ organizationId: data.id })
      toast.success(`${data.name} created`)
      setOpen(false)
      setName("")
      setSlug("")
      setSlugEdited(false)
      onCreated?.(data.id)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>
              Organizations let you group members, invites, and billing together.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Field>
              <FieldLabel htmlFor="org-name">Name</FieldLabel>
              <Input
                id="org-name"
                autoFocus
                placeholder="Acme Inc"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="org-slug">Slug</FieldLabel>
              <Input
                id="org-slug"
                placeholder="acme-inc"
                value={slug}
                onChange={(e) => {
                  setSlugEdited(true)
                  setSlug(slugify(e.target.value))
                }}
                required
              />
            </Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2Icon className="animate-spin" />}
              Create organization
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
