import { SubscriptionSettings } from "@/components/settings/subscription-settings"

export default function BillingSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold tracking-wide uppercase">
          Subscription
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your plan, usage, and billing history.
        </p>
      </div>
      <SubscriptionSettings />
    </div>
  )
}
