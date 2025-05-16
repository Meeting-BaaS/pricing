'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const usePaymentStatus = () => {
    const router = useRouter()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const status = urlParams.get('status')
        const message = urlParams.get('message')

        if (status === 'success') {
            toast.success(message || 'Payment successful')
            router.push('/pricing')
        } else if (status === 'error') {
            toast.error(message || 'Payment failed')
            router.push('/pricing')
        }
    }, [router])
}
