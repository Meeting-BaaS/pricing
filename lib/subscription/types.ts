export interface Subscription {
    email: string
    product: PlanType
    stripePlanId: string
    stripeProductId: string
    stripeSubscriptionStatus: SubscriptionStatus
    trialEnd: string | null
}

export type PlanType =
    | 'PayAsYouGo'
    | 'StarterPack'
    | 'ProPack'
    | 'BusinessPack'
    | 'EnterprisePack'
    | 'ScaleAPI'
    | 'EnterpriseAPI'

export interface CheckoutResponse {
    url?: string
}

export type CheckoutMode = 'payment' | 'subscription'

export interface ProductWithPricesResponse {
    product: {
        metadata: {
            concurrentBots: string
            requestsPerSecond: string
            tokenDiscount: string
            tokens: string
        }
        active: boolean
        livemode: boolean
    }
    prices: Array<{
        active: boolean
        unit_amount: number
        billing_scheme: string
        currency: string
        recurring: {
            interval: string
        }
        id: string
    }>
}

export interface SubscriptionInfoResponse {
    subscription: Subscription
}

type SubscriptionStatus =
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'paused'
    | 'trialing'
    | 'unpaid'

export interface BillingPortalResponse {
    url: string
}
