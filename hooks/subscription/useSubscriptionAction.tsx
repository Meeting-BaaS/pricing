'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'

export const useSubscriptionActions = () => {
    const cancelSubscription = useCallback(async () => {
        try {
            const response = await fetch('/api/subscription/cancel', {
                method: 'POST',
            })

            if (!response.ok) {
                throw new Error('Failed to cancel subscription')
            }

            toast.success('Subscription cancelled successfully')
        } catch (error) {
            toast.error('Failed to cancel subscription')
        }
    }, [])

    const openBillingPortal = useCallback(async () => {
        try {
            const response = await fetch('/api/subscription/billing-portal', {
                method: 'POST',
            })

            if (!response.ok) {
                throw new Error('Failed to open billing portal')
            }

            const { url } = await response.json()
            window.location.href = url
        } catch (error) {
            toast.error('Failed to open billing portal')
        }
    }, [])

    return {
        cancelSubscription,
        openBillingPortal,
    }
}
