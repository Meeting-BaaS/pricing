import { useSubscription } from "@/contexts/subscription"

interface TokenRateCardProps {
  title: string
  rate: string
  unit: string
  subtitle?: string
}

export const TokenRateCard = ({ title, rate, unit, subtitle }: TokenRateCardProps) => {
  const { currentPlan, highlightedPlan } = useSubscription()
  const isEntreprisePlanHighlighted =
    (!title.includes("Calendar") && highlightedPlan !== "EnterpriseAPI") ||
    highlightedPlan === "EnterpriseAPI" ||
    (currentPlan === "EnterpriseAPI" && highlightedPlan === null)

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-3xl border p-6 ${
        isEntreprisePlanHighlighted ? "border-primary" : "border-border"
      }`}
    >
      <div className="flex flex-col gap-2">
        <span className="font-medium text-sm">{title}</span>
        <span
          className={`font-bold text-2xl ${isEntreprisePlanHighlighted ? "text-primary" : "text-baas-primary-700"}`}
        >
          {rate}
        </span>
        <span className="text-muted-foreground text-sm">{unit}</span>
        {subtitle && <span className="text-muted-foreground text-xs">{subtitle}</span>}
      </div>
    </div>
  )
}
