'use client'

import { PlanType } from '@/lib/subscription/types'
import { ReactNode, useCallback, useEffect, useState } from 'react'

import { useHandlePurchase } from '@/hooks/subscription/useHandlePurchase'
import { usePlansData } from '@/hooks/subscription/usePlanData'
import { usePaymentStatus } from '@/hooks/subscription/useSubscription'
import { useSubscriptionActions } from '@/hooks/subscription/useSubscriptionAction'
import { useSubscriptionData } from '@/hooks/subscription/useSubscriptionData'
import { SubscriptionContext } from './SubscriptionContext'
import { PlanInfo, TokenPackInfo } from './types'

interface Props {
    children: ReactNode
}

export const SubscriptionProvider = ({ children }: Props) => {
    usePaymentStatus()
    const { subscription, currentPlan, setCurrentPlan, loadCurrentPlan } =
        useSubscriptionData()

    const { plansInfo, tokenPacks, isLoading, error, loadPlansData } =
        usePlansData()

    const { handlePurchase } = useHandlePurchase()

    const { cancelSubscription, openBillingPortal } = useSubscriptionActions()

    const [highlightedPlan, setHighlightedPlan] = useState<PlanType | null>(null)

    useEffect(() => {
        const initializeData = async () => {
            await Promise.all([loadPlansData(), loadCurrentPlan()])
        }

        initializeData()
    }, [loadPlansData, loadCurrentPlan])

    const getPlanInfo = useCallback(
        (planTitle: string): PlanInfo | null => {
            return plansInfo[planTitle] || null
        },
        [plansInfo],
    )

    const getTokenPacks = useCallback((): TokenPackInfo[] => {
        return Object.values(tokenPacks)
    }, [tokenPacks])

    const isHighlighted = useCallback(
        (planType: PlanType) => planType === highlightedPlan,
        [highlightedPlan],
    )

    return (
        <SubscriptionContext.Provider
            value={{
                subscription,
                currentPlan,
                setCurrentPlan,
                highlightedPlan,
                setHighlightedPlan,
                isHighlighted,
                handlePurchase,
                getPlanInfo,
                getTokenPacks,
                isLoading,
                error,
                plansInfo,
                cancelSubscription,
                openBillingPortal,
                loadPlansData,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    )
}
