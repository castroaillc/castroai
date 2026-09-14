"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2Icon, MoreHorizontalIcon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Member = {
  id: string
  role: string
  userId: string
  user: { id: string; name: string; email: string; image?: string | null }
}

const ROLES = ["owner", "admin", "member"] as const

export function MembersTable({
  members,
  currentUserId,
  currentUserRole,
  ownerCount,
}: {
  members: Member[]
  currentUserId: string
  currentUserRole: string
  ownerCount: number
}) {
  const router = useRouter()
  const canManage = currentUserRole === "owner" || currentUserRole === "admin"
  const [pendingId, setPendingId] = React.useState<string | null>(null)
  const [removeTarget, setRemoveTarget] = React.useState<Member | null>(null)

  async function handleRoleChange(member: Member, role: string) {
    setPendingId(member.id)
    const { error } = await authClient.organization.updateMemberRole({
      memberId: member.id,
      role: role as "owner" | "admin" | "member",
    })
    setPendingId(null)
    if (error) {
      toast.error(error.message ?? "Failed to update role")
      return
    }
    toast.success(`${member.user.name} is now ${role}`)
    router.refresh()
  }

  async function handleRemove(member: Member) {
    setPendingId(member.id)
    const { error } = await authClient.organization.removeMember({
      memberIdOrEmail: member.id,
    })
    setPendingId(null)
    setRemoveTarget(null)
    if (error) {
      toast.error(error.message ?? "Failed to remove member")
      return
    }
    toast.success(`${member.user.name} removed`)
    router.refresh()
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            {canManage && <TableHead className="w-10" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const isSelf = member.userId === currentUserId
            const isLastOwner = member.role === "owner" && ownerCount <= 1
            const initials = member.user.name
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
            return (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage src={member.user.image ?? undefined} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {member.user.name}
                        {isSelf && (
                          <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>
                        )}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {member.user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {canManage && !isLastOwner ? (
                    <Select
                      value={member.role}
                      onValueChange={(role) => role && handleRoleChange(member, role)}
                      disabled={pendingId === member.id}
                    >
                      <SelectTrigger size="sm" className="w-32 border-b-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role} value={role} className="capitalize">
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary" className="capitalize">
                      {member.role}
                    </Badge>
                  )}
                </TableCell>
                {canManage && (
                  <TableCell>
                    {!isLastOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="ghost" size="icon-sm" />}
                        >
                          <MoreHorizontalIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setRemoveTarget(member)}
                          >
                            {isSelf ? "Leave organization" : "Remove member"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {removeTarget?.userId === currentUserId
                ? "Leave organization?"
                : `Remove ${removeTarget?.user.name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget?.userId === currentUserId
                ? "You will lose access to this organization's resources."
                : "They will immediately lose access to this organization."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!pendingId}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={!!pendingId}
              onClick={() => removeTarget && handleRemove(removeTarget)}
            >
              {pendingId && <Loader2Icon className="animate-spin" />}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
