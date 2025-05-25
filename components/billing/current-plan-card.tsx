import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SubscriptionResponse } from "@/lib/subscription/types"
import type { PlanInfo } from "@/lib/plans/types"
import { AccordionTrigger } from "@/components/ui/accordion"
import { Loader2 } from "lucide-react"
import { subscriptionStatuses } from "@/lib/subscription/constants"

interface CurrentPlanCardProps {
  subscription: SubscriptionResponse
  allPlans: PlanInfo[]
  isSubscriptionRefetching: boolean
}

export function CurrentPlanCard({
  subscription,
  allPlans,
  isSubscriptionRefetching
}: CurrentPlanCardProps) {
  const currentPlan = allPlans.find((plan) => plan.type === subscription.subscription.product)
  // Highest plan is EnterpriseAPI
  const isEnterprise = subscription.subscription.product === "EnterpriseAPI"
  const subscriptionStatus = subscription.subscription.stripeSubscriptionStatus
  const subscriptionStatusText = subscriptionStatus
    ? subscriptionStatuses[subscriptionStatus]
    : "No active subscription"

  return (
    <Card className="gap-2 dark:bg-[linear-gradient(238deg,#161616,hsla(0,0%,9%,0))]">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            Current Plan
            {isSubscriptionRefetching && <Loader2 className="size-4 animate-spin stroke-primary" />}
          </CardTitle>
          {!isEnterprise && <Badge variant="default">Upgrade Available</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-2xl">{currentPlan?.title}</h3>
            <p className="text-muted-foreground">{subscriptionStatusText}</p>
          </div>

          {!isEnterprise ? (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                Unlock more power: Scale your concurrent bots and access premium features designed
                for growing businesses.
              </p>
              <AccordionTrigger className="w-full py-2 text-primary">
                View all plans
              </AccordionTrigger>
            </div>
          ) : (
            <AccordionTrigger className="w-full">View other plans</AccordionTrigger>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
