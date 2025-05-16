import { CheckedIcon } from '@/components/icons/CheckedIcon'
import { useSubscription } from '@/contexts/subscription'


interface TokenPackCardProps {
    isConnected: boolean
    pack: {
        title: string
        price: number
        tokens: number
        subtitle?: string
    }
    features: string[]
}

export const TokenPackCard = ({
    pack,
    features,
    isConnected = false,
}: TokenPackCardProps) => {
    const { currentPlan, highlightedPlan, handlePurchase, getPlanInfo } = useSubscription()
    const planInfo = getPlanInfo(highlightedPlan || currentPlan)

    const getDiscountedPrice = () => {
        if (!planInfo) return Number(pack.price)
        return Number(pack.price) * (1 - planInfo.tokenDiscount / 100)
    }

    const getDiscount = () => {
        if (!planInfo || planInfo.tokenDiscount === 0) return null
        return `-${planInfo.tokenDiscount}%`
    }

    const handlePackPurchase = async () => {
        let priceId: string
        switch (pack.title) {
            case 'Starter Pack':
                priceId = process.env.NEXT_PUBLIC_STRIPE_STARTER_PACK_PRICE_ID || ''
                break
            case 'Pro Pack':
                priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PACK_PRICE_ID || ''
                break
            case 'Business Pack':
                priceId = process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PACK_PRICE_ID || ''
                break
            case 'Enterprise Pack':
                priceId = process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PACK_PRICE_ID || ''
                break
            default:
                console.error('Unknown pack type')
                return
        }
        if (!priceId) {
            console.error('Price ID not found')
            return
        }
        console.log(priceId)
        const discount = getDiscount()
        await handlePurchase(priceId, 'payment', planInfo?.tokenDiscount)
    }

    const discountedPrice = getDiscountedPrice()
    const showOriginalPrice = currentPlan !== 'PayAsYouGo' || highlightedPlan
    const discount = getDiscount()

    return (
        <div className="relative w-full h-full p-6 overflow-hidden rounded-3xl border border-neutral-700 hover:border-primary-700 hover:-translate-y-1 transition-all duration-600">
            <div className="flex flex-col gap-4 h-full justify-between">
                <div className="flex flex-col gap-6">
                    <div>
                        <div className="flex w-full justify-between">
                            <div>
                                <span className="text-neutral-200 text-lg font-bold">
                                    {pack.title}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-primary-500 text-4xl font-bold leading-3">
                                    {pack.tokens}
                                </span>
                                <span className="text-primary-700 text-sm">
                                    tokens
                                </span>
                            </div>
                        </div>
                        <div className="flex w-full justify-between">
                            <div className="flex items-baseline gap-2">
                                {discount && (
                                    <span className="text-neutral-400 text-lg line-through">
                                        ${pack.price}
                                    </span>
                                )}
                                <span className="text-primary-500 text-3xl font-bold">
                                    ${discountedPrice.toFixed(0)}
                                </span>
                            </div>
                            <span className="text-neutral-400 text-base">
                                ${(discountedPrice / pack.tokens).toFixed(2)} /Tk
                            </span>
                        </div>
                        <div className="h-2.5 w-full flex gap-2 justify-between items-end">
                            <span className="text-primary-500 text-sm">
                                {discount ? discount : ''}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                                <div className="text-primary-500 mr-2">
                                    <CheckedIcon className="w-4 h-4" />
                                </div>
                                <span className="text-neutral-200 text-sm">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                {isConnected && (
                    <button
                        className="w-full px-4 py-2 font-medium text-white rounded-lg bg-primary-500 hover:bg-primary-600 transition-colors"
                        onClick={handlePackPurchase}
                    >
                        Purchase
                    </button>
                )}
            </div>
        </div>
    )
} 