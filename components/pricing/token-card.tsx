import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Percent } from "lucide-react"
import type { TokenPackInfo, PlanInfo } from "@/lib/plans/types"
import { spotlightVariant } from "@/components/animations/background"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface TokenCardProps {
  pack: TokenPackInfo
  isHighlighted?: boolean
  apiPlans: PlanInfo[]
}

export function TokenCard({ pack, isHighlighted, apiPlans }: TokenCardProps) {
  const perTokenPrice = (pack.price / pack.tokens).toFixed(2)

  // Get plans that offer token discounts
  const plansWithDiscounts = apiPlans.filter((plan) => plan.tokenDiscount > 0)

  return (
    <Card className={`relative h-full ${isHighlighted ? "border-primary" : ""}`}>
      {isHighlighted && (
        <>
          <Badge variant="primary" className="-top-3 -translate-x-1/2 absolute left-1/2">
            Best Value
          </Badge>
          <motion.div
            className="-translate-x-1/2 absolute bottom-0 left-1/2 h-12 w-1/2 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(0, 219, 205, 0.9) 10%, rgba(0, 219, 205, 0.8) 80%, transparent 100%)"
            }}
            initial={{ opacity: 0 }}
            whileInView={spotlightVariant()}
            transition={{
              delay: 0.5
            }}
            viewport={{ once: true }}
            aria-hidden="true"
          />
        </>
      )}
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          {pack.title} <span className="text-muted-foreground text-sm">${perTokenPrice}/token</span>
        </CardTitle>
        <CardDescription className="mt-4 flex items-baseline">
          <span className="font-bold text-3xl text-foreground">${pack.price}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <div className="flex items-end gap-1">
          <span className="font-bold text-4xl text-primary">{pack.tokens}</span>
          <span className="pb-0.5 text-muted-foreground">tokens</span>
        </div>
        <ul className="my-6 space-y-4 text-sm">
          {pack.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              <span className="text-muted-foreground text-sm">{feature}</span>
            </li>
          ))}
          {plansWithDiscounts.map((plan) => (
            <li key={plan.type} className="flex items-center gap-2">
              <Percent className="size-4 text-primary" />
              <span className="text-muted-foreground text-sm">
                {plan.tokenDiscount}% Discount on {plan.title} plan
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="z-20 w-full" variant={isHighlighted ? "default" : "secondary"} asChild>
          <Link href={pack.redirectTo}>Purchase Pack</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
