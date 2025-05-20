import { Badge } from "@/components/ui/badge"
import { type PlanInfo, useSubscription } from "@/contexts/subscription"
import { Check } from "lucide-react"
import { useCallback } from "react"
import { toast } from "sonner"

interface PlanCardProps {
  isConnected: boolean
  plan: PlanInfo | null
  isPopular: boolean
  features: string[]
}

const STRIPE_PRODUCTS = {
  scale: {
    price: process.env.NEXT_PUBLIC_STRIPE_SCALE_PRICE_ID || ""
  },
  enterprise: {
    price: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || ""
  }
} as const

export const PlanCard = ({ features, isPopular, plan, isConnected = false }: PlanCardProps) => {
  const {
    currentPlan,
    setCurrentPlan,
    setHighlightedPlan,
    isHighlighted,
    handlePurchase,
    openBillingPortal
  } = useSubscription()

  const handleMouseEnter = useCallback(() => {
    console.log("plan?.type", plan?.type)
    setHighlightedPlan(plan?.type || "PayAsYouGo")
  }, [plan?.type, setHighlightedPlan])

  const handleMouseLeave = useCallback(() => {
    setHighlightedPlan(null)
  }, [setHighlightedPlan])

  const handleManageSubscription = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await openBillingPortal()
    } catch (error) {
      toast.error("Failed to open subscription management")
    }
  }

  const handleSubscribe = async () => {
    if (plan?.title === "Pay as you go") {
      setCurrentPlan("PayAsYouGo")
      return
    }

    const productId =
      plan?.title === "Scale API" ? STRIPE_PRODUCTS.scale.price : STRIPE_PRODUCTS.enterprise.price

    await handlePurchase(productId, "subscription")
    console.log("currentPlan", currentPlan)
  }

  const isSelected = currentPlan === plan?.type

  return (
    <div
      className={`hover:-translate-y-1 relative h-full w-full overflow-hidden rounded-3xl border p-6 transition-all duration-600 hover:border-primary ${
        isSelected || isHighlighted(plan?.type || "PayAsYouGo") ? "border-primary" : "border-border"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isPopular && <Badge className="absolute top-4 right-4">Popular</Badge>}

      <div className="flex h-full flex-col justify-between space-y-8">
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-bold text-muted-foreground text-xl">{plan?.title}</h3>
            <div className="font-bold text-3xl text-primary">
              ${plan?.price}
              <span className="ml-1 text-muted-foreground text-sm">/{plan?.interval}</span>
            </div>
          </div>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="size-4 text-primary" />
                <span className="text-muted-foreground text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        {isConnected && (
          <button
            type="button"
            className={`w-full rounded-lg px-4 py-2 font-medium transition-colors cursor-pointer ${
              plan?.type !== "PayAsYouGo" || currentPlan === "EnterpriseAPI"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground hover:bg-muted/90"
            }
                        ${!plan?.active ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={
              currentPlan === plan?.type && currentPlan !== "PayAsYouGo"
                ? handleManageSubscription
                : handleSubscribe
            }
            disabled={!plan?.active}
          >
            {isSelected && currentPlan !== "PayAsYouGo"
              ? "Manage Subscription"
              : plan?.type === "PayAsYouGo"
                ? "Activate"
                : "Subscribe"}
          </button>
        )}
      </div>
    </div>
  )
}
