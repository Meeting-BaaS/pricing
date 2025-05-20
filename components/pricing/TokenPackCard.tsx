import { useSubscription } from "@/contexts/subscription"
import { Check } from "lucide-react"

interface TokenPackCardProps {
  isConnected: boolean
  pack: {
    title: string
    price: number
    tokens: number
    subtitle?: string
  }
  features: string[]
}

export const TokenPackCard = ({ pack, features, isConnected = false }: TokenPackCardProps) => {
  const { currentPlan, highlightedPlan, handlePurchase, getPlanInfo } = useSubscription()
  const planInfo = getPlanInfo(highlightedPlan || currentPlan)

  const getDiscountedPrice = () => {
    if (!planInfo) return Number(pack.price)
    return Number(pack.price) * (1 - planInfo.tokenDiscount / 100)
  }

  const getDiscount = () => {
    if (!planInfo || planInfo.tokenDiscount === 0) return null
    return `-${planInfo.tokenDiscount}%`
  }

  const handlePackPurchase = async () => {
    let priceId: string
    switch (pack.title) {
      case "Starter Pack":
        priceId = process.env.NEXT_PUBLIC_STRIPE_STARTER_PACK_PRICE_ID || ""
        break
      case "Pro Pack":
        priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PACK_PRICE_ID || ""
        break
      case "Business Pack":
        priceId = process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PACK_PRICE_ID || ""
        break
      case "Enterprise Pack":
        priceId = process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PACK_PRICE_ID || ""
        break
      default:
        console.error("Unknown pack type")
        return
    }
    if (!priceId) {
      console.error("Price ID not found")
      return
    }
    console.log(priceId)
    const discount = getDiscount()
    await handlePurchase(priceId, "payment", planInfo?.tokenDiscount)
  }

  const discountedPrice = getDiscountedPrice()
  const showOriginalPrice = currentPlan !== "PayAsYouGo" || highlightedPlan
  const discount = getDiscount()

  return (
    <div className="hover:-translate-y-1 relative h-full w-full overflow-hidden rounded-3xl border border-border p-6 transition-all duration-600 hover:border-baas-primary-700">
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex w-full justify-between">
              <div>
                <span className="font-bold text-lg text-neutral-700 dark:text-neutral-200">
                  {pack.title}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-4xl text-primary leading-4">{pack.tokens}</span>
                <span className="text-baas-primary-700 text-sm">tokens</span>
              </div>
            </div>
            <div className="flex w-full justify-between">
              <div className="flex items-baseline gap-2">
                {discount && (
                  <span className="text-lg text-muted-foreground line-through">${pack.price}</span>
                )}
                <span className="font-bold text-3xl text-primary">
                  ${discountedPrice.toFixed(0)}
                </span>
              </div>
              <span className="text-base text-muted-foreground">
                ${(discountedPrice / pack.tokens).toFixed(2)} /Tk
              </span>
            </div>
            <div className="flex h-2.5 w-full items-end justify-between gap-2">
              <span className="text-primary text-sm">{discount ? discount : ""}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="mr-2 text-primary">
                  <Check className="size-4" />
                </div>
                <span className="text-neutral-700 text-sm dark:text-neutral-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        {isConnected && (
          <button
            type="button"
            className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={handlePackPurchase}
          >
            Purchase
          </button>
        )}
      </div>
    </div>
  )
}
