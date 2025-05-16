import { useSubscription } from '@/contexts/subscription'

interface TokenRateCardProps {

    title: string
    rate: string
    unit: string
    subtitle?: string
}

export const TokenRateCard = ({

    title,
    rate,
    unit,
    subtitle,
}: TokenRateCardProps) => {
    const { currentPlan, highlightedPlan } = useSubscription()
    const isEntreprisePlanHighlighted =
        (!title.includes('Calendar') && highlightedPlan !== 'EnterpriseAPI') ||
        highlightedPlan === 'EnterpriseAPI' ||
        (currentPlan === 'EnterpriseAPI' && highlightedPlan === null)

    return (
        <div
            className={`relative w-full h-full p-6 overflow-hidden rounded-3xl border
                ${isEntreprisePlanHighlighted 
                    ? 'border-primary-700' 
                    : 'border-neutral-700'
                }`}
        >
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-neutral-200">
                    {title}
                </span>
                <span className={`text-2xl font-bold
                    ${isEntreprisePlanHighlighted 
                        ? 'text-primary-500' 
                        : 'text-primary-700'
                    }`}
                >
                    {rate}
                </span>
                <span className="text-sm text-neutral-400">
                    {unit}
                </span>
                {subtitle && (
                    <span className="text-xs text-neutral-400">
                        {subtitle}
                    </span>
                )}
            </div>
        </div>
    )
}
