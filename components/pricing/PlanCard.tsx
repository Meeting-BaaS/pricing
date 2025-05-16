import { PlanInfo, useSubscription } from '@/contexts/subscription'
import { useCallback } from 'react'
import { toast } from 'sonner'

interface PlanCardProps {
    isConnected: boolean
    plan: PlanInfo | null
    isPopular: boolean
    features: string[]
}

const STRIPE_PRODUCTS = {
    scale: {
        price: process.env.NEXT_PUBLIC_STRIPE_SCALE_PRICE_ID || 'price_1QnNcCDcGmQpwyKKFEaBw7cB'
    },
    enterprise: {
        price: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || 'price_1QnNVSDcGmQpwyKKwy3a41jx'
    }
} as const

export const PlanCard = ({ features, isPopular, plan, isConnected = false }: PlanCardProps) => {
    const {
        currentPlan,
        setCurrentPlan,
        setHighlightedPlan,
        isHighlighted,
        handlePurchase,
        openBillingPortal,
    } = useSubscription()

    const handleMouseEnter = useCallback(() => {
        console.log('plan?.type', plan?.type)
        setHighlightedPlan(plan?.type || 'PayAsYouGo')
    }, [plan?.type, setHighlightedPlan])

    const handleMouseLeave = useCallback(() => {
        setHighlightedPlan(null)
    }, [setHighlightedPlan])

    const handleManageSubscription = async (e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await openBillingPortal()
        } catch (error) {
            toast.error('Failed to open subscription management')
        }
    }

    const handleSubscribe = async () => {
        if (plan?.title === 'Pay as you go') {
            setCurrentPlan('PayAsYouGo')
            return
        }

        const productId =
            plan?.title === 'Scale API'
                ? STRIPE_PRODUCTS.scale.price
                : STRIPE_PRODUCTS.enterprise.price

        await handlePurchase(productId, 'subscription')
        console.log('currentPlan', currentPlan)
    }

    const isSelected = currentPlan === plan?.type

    return (
        <div
            className={`relative w-full h-full p-6 overflow-hidden rounded-xl border transition-all duration-600 hover:-translate-y-1 hover:border-primary-700
                ${isSelected || isHighlighted(plan?.type || 'PayAsYouGo')
                    ? 'border-primary-700'
                    : 'border-neutral-700'
                }
                bg-neutral-900`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isPopular && (
                <span className="absolute top-4 right-4 px-3 py-1 text-sm font-medium rounded-full bg-primary-500 text-neutral-900">
                    Popular
                </span>
            )}

            <div className="flex flex-col justify-between h-full space-y-8">
                <div className="space-y-6">
                    <div>
                        <h3 className="mb-2 text-xl font-bold text-neutral-200">
                            {plan?.title}
                        </h3>
                        <div className="text-3xl font-bold text-primary-500">
                            ${plan?.price}
                            <span className="ml-1 text-sm text-neutral-400">
                                /{plan?.interval}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                                <svg
                                    className="w-4 h-4 mr-2 text-primary-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <span className="text-sm text-neutral-200">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                {isConnected && (
                <button
                    className={`w-full px-4 py-2 font-medium rounded-lg transition-colors
                        ${plan?.type !== 'PayAsYouGo' || currentPlan === 'EnterpriseAPI'
                            ? 'bg-primary-500 text-white hover:bg-primary-600'
                            : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                        }
                        ${!plan?.active ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={
                        currentPlan === plan?.type && currentPlan !== 'PayAsYouGo'
                            ? handleManageSubscription
                            : handleSubscribe
                    }
                    disabled={!plan?.active}
                >
                    {isSelected && currentPlan !== 'PayAsYouGo'
                        ? 'Manage Subscription'
                        : plan?.type === 'PayAsYouGo'
                            ? 'Activate'
                            : 'Subscribe'}
                    </button>
                )}
            </div>
        </div>
    )
}
