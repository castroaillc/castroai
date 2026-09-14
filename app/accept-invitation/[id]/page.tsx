import { AcceptInvitation } from "@/components/accept-invitation"

export default async function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AcceptInvitation invitationId={id} />
      </div>
    </div>
  )
}
