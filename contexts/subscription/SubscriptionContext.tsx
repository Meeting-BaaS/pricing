'use client'

import { createContext, useContext } from 'react'
import { SubscriptionContextType } from './types'

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
    undefined,
)

export const useSubscription = () => {
    const context = useContext(SubscriptionContext)
    if (!context) {
        throw new Error(
            'useSubscription must be used within a SubscriptionProvider',
        )
    }
    return context
}
export { SubscriptionContext }
