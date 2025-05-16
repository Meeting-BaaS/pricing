import { CheckoutMode } from '@/lib/subscription/types'

import { PlanType, Subscription } from '@/lib/subscription/types'

export interface TokenPackInfo {
    title: string
    price: number
    stripe_price_id: string
    features: string[]
    tokens: number
    isHighlighted?: boolean
}

export interface PlanInfo {
    concurrentBots: number
    requestsPerSecond: number
    tokenDiscount: number
    price: string
    billingScheme: string
    currency: string
    interval: string
    active: boolean
    livemode: boolean
    title: string
    type: PlanType
}

export interface SubscriptionContextType {
    subscription: Subscription | null
    currentPlan: PlanType
    setCurrentPlan: (plan: PlanType) => void
    highlightedPlan: PlanType | null
    setHighlightedPlan: (planType: PlanType | null) => void
    isHighlighted: (planType: PlanType) => boolean
    handlePurchase: (
        productId: string,
        mode: CheckoutMode,
        discount_percentage?: number,
    ) => Promise<void>
    getPlanInfo: (planTitle: string) => PlanInfo | null
    getTokenPacks: () => TokenPackInfo[]
    isLoading: boolean
    plansInfo: Record<string, PlanInfo>
    error: string | null
    cancelSubscription: () => Promise<void>
    openBillingPortal: () => Promise<void>
    loadPlansData: () => Promise<void>
}
