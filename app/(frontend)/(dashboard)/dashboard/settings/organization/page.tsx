import { OrganizationSettings } from "@/components/settings/organization-settings"

export default function OrganizationSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold tracking-wide uppercase">
          Organization
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your organization&apos;s profile, members, and invitations.
        </p>
      </div>
      <OrganizationSettings />
    </div>
  )
}
