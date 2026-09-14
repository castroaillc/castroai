"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2Icon, MailIcon, XIcon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Invitation = {
  id: string
  email: string
  role: string | null
  status: string
  expiresAt: Date
}

export function InvitationsPanel({
  organizationId,
  invitations,
  canManage,
}: {
  organizationId: string
  invitations: Invitation[]
  canManage: boolean
}) {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState("member")
  const [loading, setLoading] = React.useState(false)
  const [cancelingId, setCancelingId] = React.useState<string | null>(null)

  const pending = invitations.filter((inv) => inv.status === "pending")

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    const { error } = await authClient.organization.inviteMember({
      email: email.trim(),
      role: role as "owner" | "admin" | "member",
      organizationId,
    })
    setLoading(false)
    if (error) {
      toast.error(error.message ?? "Failed to send invitation")
      return
    }
    toast.success(`Invitation sent to ${email.trim()}`)
    setEmail("")
    router.refresh()
  }

  async function handleCancel(invitationId: string) {
    setCancelingId(invitationId)
    const { error } = await authClient.organization.cancelInvitation({ invitationId })
    setCancelingId(null)
    if (error) {
      toast.error(error.message ?? "Failed to cancel invitation")
      return
    }
    toast.success("Invitation canceled")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      {canManage && (
        <form onSubmit={handleInvite} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Field className="flex-1">
            <FieldLabel htmlFor="invite-email">Email address</FieldLabel>
            <Input
              id="invite-email"
              type="email"
              placeholder="teammate@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field className="sm:w-40">
            <FieldLabel htmlFor="invite-role">Role</FieldLabel>
            <Select value={role} onValueChange={(value) => value && setRole(value)}>
              <SelectTrigger id="invite-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : <MailIcon />}
            Invite
          </Button>
        </form>
      )}

      {pending.length === 0 ? (
        <div className="rounded-none border border-dashed p-8 text-center text-sm text-muted-foreground">
          No pending invitations
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Expires</TableHead>
              {canManage && <TableHead className="w-10" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pending.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">{invitation.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {invitation.role ?? "member"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(invitation.expiresAt).toLocaleDateString()}
                </TableCell>
                {canManage && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={cancelingId === invitation.id}
                      onClick={() => handleCancel(invitation.id)}
                    >
                      <XIcon />
                      <span className="sr-only">Cancel invitation</span>
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
