"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function OrganizationGeneralForm({
  organizationId,
  initialName,
  initialSlug,
  initialLogo,
  canUpdate,
  canDelete,
}: {
  organizationId: string
  initialName: string
  initialSlug: string
  initialLogo: string | null
  canUpdate: boolean
  canDelete: boolean
}) {
  const router = useRouter()
  const [name, setName] = React.useState(initialName)
  const [slug, setSlug] = React.useState(initialSlug)
  const [logo, setLogo] = React.useState(initialLogo ?? "")
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const dirty = name !== initialName || slug !== initialSlug || logo !== (initialLogo ?? "")

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await authClient.organization.update({
      organizationId,
      data: { name: name.trim(), slug: slug.trim(), logo: logo.trim() || null },
    })
    setSaving(false)
    if (error) {
      toast.error(error.message ?? "Failed to update organization")
      return
    }
    toast.success("Organization updated")
    router.refresh()
  }

  async function handleDelete() {
    setDeleting(true)
    const { error } = await authClient.organization.delete({ organizationId })
    setDeleting(false)
    if (error) {
      toast.error(error.message ?? "Failed to delete organization")
      return
    }
    toast.success("Organization deleted")
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <form onSubmit={handleSave}>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Basic information about your organization.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="org-name">Name</FieldLabel>
              <Input
                id="org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!canUpdate}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="org-slug">Slug</FieldLabel>
              <Input
                id="org-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={!canUpdate}
                required
              />
              <FieldDescription>Used in URLs to identify your organization.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="org-logo">Logo URL</FieldLabel>
              <Input
                id="org-logo"
                placeholder="https://example.com/logo.png"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                disabled={!canUpdate}
              />
            </Field>
          </CardContent>
          {canUpdate && (
            <CardFooter className="justify-end">
              <Button type="submit" disabled={!dirty || saving}>
                {saving && <Loader2Icon className="animate-spin" />}
                Save changes
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>

      {canDelete && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle>Danger zone</CardTitle>
            <CardDescription>
              Deleting your organization removes all members, invitations, and teams. This cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive" />}>
                Delete organization
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {initialName}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the organization and remove all members and invitations. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" disabled={deleting} onClick={handleDelete}>
                    {deleting && <Loader2Icon className="animate-spin" />}
                    Delete organization
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
