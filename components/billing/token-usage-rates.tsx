import { tokenRates } from "@/lib/subscription/constants"

export function TokenUsageRates() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tokenRates.map((rate, index) => {
        const Icon = rate.icon
        return (
          <div
            key={index}
            className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 dark:border-0 dark:bg-muted/50"
          >
            <Icon className="mt-0.5 size-5 text-muted-foreground" />
            <div className="flex-1">
              <h3 className="font-medium">{rate.title}</h3>
              <p className="mt-1 text-muted-foreground text-sm">{rate.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="font-medium">{rate.rate}</div>
              <div className="text-muted-foreground text-sm">{rate.unit}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
