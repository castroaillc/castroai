"use client"

import * as React from "react"
import { CheckIcon, CreditCardIcon, ReceiptIcon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals trying things out.",
    features: ["Up to 3 members", "1 organization", "Community support"],
    current: true,
  },
  {
    name: "Pro",
    price: "$20",
    description: "For growing teams that need more.",
    features: ["Unlimited members", "Unlimited organizations", "Priority support", "Advanced roles"],
    current: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with advanced needs.",
    features: ["SSO & SCIM", "Audit logs", "Dedicated support", "Custom contracts"],
    current: false,
  },
]

const FREE_MEMBER_LIMIT = 3

function notifyComingSoon() {
  toast.info("Billing isn't connected yet", {
    description: "Upgrading plans will be available once a payment provider is added.",
  })
}

export function SubscriptionSettings() {
  const { data: activeOrganization, isPending } = authClient.useActiveOrganization()

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const memberCount = activeOrganization?.members.length ?? 0
  const usagePct = Math.min(100, Math.round((memberCount / FREE_MEMBER_LIMIT) * 100))

  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="plans">Plans</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current plan</CardTitle>
                <CardDescription>
                  {activeOrganization ? activeOrganization.name : "Your organization"} is on the Free plan.
                </CardDescription>
              </div>
              <Badge>Free</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Members</span>
                <span className="font-medium">
                  {memberCount} / {FREE_MEMBER_LIMIT}
                </span>
              </div>
              <Progress value={usagePct} />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="outline" onClick={notifyComingSoon}>
              <CreditCardIcon />
              Payment method
            </Button>
            <Button onClick={notifyComingSoon}>
              <SparklesIcon />
              Upgrade to Pro
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="plans" className="mt-4">
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card key={plan.name} className={plan.current ? "ring-2 ring-primary/40" : undefined}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.current && <Badge variant="secondary">Current</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="text-2xl font-semibold">
                  {plan.price}
                  {plan.price !== "Custom" && (
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  )}
                </div>
                <Separator />
                <ul className="flex flex-col gap-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckIcon className="size-3.5 text-muted-foreground" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current}
                  onClick={notifyComingSoon}
                >
                  {plan.current ? "Current plan" : `Switch to ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="invoices" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Your billing history will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3 rounded-none border border-dashed p-10 text-center">
              <ReceiptIcon className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No invoices yet</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
