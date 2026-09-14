import { AcceptInvitation } from "@/components/accept-invitation"

export default async function AcceptInvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ email?: string }>
}) {
  const { id } = await params
  const { email } = await searchParams

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AcceptInvitation invitationId={id} invitedEmail={email} />
      </div>
    </div>
  )
}
