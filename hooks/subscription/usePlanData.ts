// hooks/subscription/usePlansData.ts
'use client'

import { PlanInfo, TokenPackInfo } from '@/contexts/subscription/types'
import { PlanType } from '@/lib/subscription/types'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

export const usePlansData = () => {
    const [plansInfo, setPlansInfo] = useState<Record<string, PlanInfo>>({})
    const [tokenPacks, setTokenPacks] = useState<Record<string, TokenPackInfo>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadPlansData = useCallback(async () => {
        console.log('Starting to load plans data...')
        setIsLoading(true)
        setError(null)
        try {
            console.log('Fetching plans and token packs...')
            const [scaleResponse, enterpriseResponse, starterResponse, proResponse, businessResponse, enterprisePackResponse] = await Promise.all([
                fetch(`/api/baas/payment/product_with_prices?product_id=${process.env.NEXT_PUBLIC_STRIPE_SCALE_PRODUCT_ID}`).then(r => r.json()),
                fetch(`/api/baas/payment/product_with_prices?product_id=${process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRODUCT_ID}`).then(r => r.json()),
                fetch(`/api/baas/payment/product_with_prices?product_id=${process.env.NEXT_PUBLIC_STRIPE_STARTER_PACK_PRODUCT_ID}`).then(r => r.json()),
                fetch(`/api/baas/payment/product_with_prices?product_id=${process.env.NEXT_PUBLIC_STRIPE_PRO_PACK_PRODUCT_ID}`).then(r => r.json()),
                fetch(`/api/baas/payment/product_with_prices?product_id=${process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PACK_PRODUCT_ID}`).then(r => r.json()),
                fetch(`/api/baas/payment/product_with_prices?product_id=${process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PACK_PRODUCT_ID}`).then(r => r.json())
            ])

            console.log('SCALE_PRODUCT_ID', process.env.NEXT_PUBLIC_STRIPE_SCALE_PRODUCT_ID)

            const plansData: Record<string, PlanInfo> = {
                ScaleAPI: {
                    concurrentBots: parseInt(scaleResponse.product.metadata.concurrentBots),
                    requestsPerSecond: parseInt(scaleResponse.product.metadata.requestsPerSecond),
                    tokenDiscount: parseInt(scaleResponse.product.metadata.tokenDiscount),
                    price: (scaleResponse.prices[0].unit_amount / 100).toString(),
                    billingScheme: scaleResponse.prices[0].billing_scheme,
                    currency: scaleResponse.prices[0].currency,
                    interval: scaleResponse.prices[0].recurring.interval,
                    active: scaleResponse.product.active,
                    livemode: scaleResponse.product.livemode,
                    title: scaleResponse.product.name,
                    type: 'ScaleAPI' as PlanType
                },
                EnterpriseAPI: {
                    concurrentBots: parseInt(enterpriseResponse.product.metadata.concurrentBots),
                    requestsPerSecond: parseInt(enterpriseResponse.product.metadata.requestsPerSecond),
                    tokenDiscount: parseInt(enterpriseResponse.product.metadata.tokenDiscount),
                    price: (enterpriseResponse.prices[0].unit_amount / 100).toString(),
                    billingScheme: enterpriseResponse.prices[0].billing_scheme,
                    currency: enterpriseResponse.prices[0].currency,
                    interval: enterpriseResponse.prices[0].recurring.interval,
                    active: enterpriseResponse.product.active,
                    livemode: enterpriseResponse.product.livemode,
                    title: enterpriseResponse.product.name,
                    type: 'EnterpriseAPI' as PlanType
                }
            }

            const packsData: Record<string, TokenPackInfo> = {
                'Starter Pack': {
                    title: 'Starter Pack',
                    price: starterResponse.prices[0].unit_amount / 100,
                    stripe_price_id: starterResponse.prices[0].id,
                    features: ['Basic support', 'Email support'],
                    tokens: parseInt(starterResponse.product.metadata.tokens),
                    isHighlighted: false
                },
                'Pro Pack': {
                    title: 'Pro Pack',
                    price: proResponse.prices[0].unit_amount / 100,
                    stripe_price_id: proResponse.prices[0].id,
                    features: ['Priority support', 'Email support', 'Phone support'],
                    tokens: parseInt(proResponse.product.metadata.tokens),
                    isHighlighted: false
                },
                'Business Pack': {
                    title: 'Business Pack',
                    price: businessResponse.prices[0].unit_amount / 100,
                    stripe_price_id: businessResponse.prices[0].id,
                    features: ['Priority support', 'Email support', 'Phone support', 'Dedicated support'],
                    tokens: parseInt(businessResponse.product.metadata.tokens),
                    isHighlighted: false
                },
                'Enterprise Pack': {
                    title: 'Enterprise Pack',
                    price: enterprisePackResponse.prices[0].unit_amount / 100,
                    stripe_price_id: enterprisePackResponse.prices[0].id,
                    features: ['Priority support', 'Email support', 'Phone support', 'Dedicated support', '24/7 support'],
                    tokens: parseInt(enterprisePackResponse.product.metadata.tokens),
                    isHighlighted: false
                }
            }

            setPlansInfo(plansData)
            setTokenPacks(packsData)
        } catch (error) {
            console.error('Error loading plans data:', error)
            setError('Failed to load plans data')
            toast.error('Failed to load plans data')
        } finally {
            setIsLoading(false)
            console.log('Finished loading plans data')
        }
    }, [])

    return {
        plansInfo,
        tokenPacks,
        isLoading,
        error,
        loadPlansData,
    }
}
