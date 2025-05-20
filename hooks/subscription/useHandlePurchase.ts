'use client'

import { CheckoutMode } from '@/lib/subscription/types'
import { useCallback } from 'react'
import { toast } from "sonner"

export function useHandlePurchase() {
    const handlePurchase = useCallback(
        async (
            productId: string,
            mode: CheckoutMode = 'payment',
            discount_percentage?: number,
        ) => {
            try {
                const response = await fetch('/api/baas/payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        plan_id: productId,
                        mode,
                        discount_percentage,
                    }),
                })

                if (!response.ok) {
                    throw new Error('Failed to initiate checkout')
                }

                const data = await response.json()
                if (data?.url) {
                    window.open(data.url, '_blank')
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'Failed to initiate checkout'
                toast.error(errorMessage)
            }
        },
        [],
    )

    return { handlePurchase }
}
