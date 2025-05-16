'use client'

import { PlanType } from '@/lib/subscription/types'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

export const useSubscriptionData = () => {
    const [currentPlan, setCurrentPlan] = useState<PlanType>('PayAsYouGo')
    const [subscription, setSubscription] = useState(null)

    const loadCurrentPlan = useCallback(async () => {
        try {
            const response = await fetch('/api/subscription/current')
            const data = await response.json()
            if (data.plan) {
                setCurrentPlan(data.plan)
            }
        } catch (error) {
            toast.error('Failed to load current plan')
        }
    }, [])

    return {
        subscription,
        currentPlan,
        setCurrentPlan,
        loadCurrentPlan,
    }
}
