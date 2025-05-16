'use client'

import { PlanCard } from '@/components/pricing/PlanCard'
import { TokenRateCard } from '@/components/pricing/TockenRateCard'
import { TokenPackCard } from '@/components/pricing/TokenPackCard'
import { useSubscription } from '@/contexts/subscription'
import { PlanType } from '@/lib/subscription/types'
import { useEffect } from 'react'

const TOKEN_RATES = [
    {
        title: 'Raw Recording',
        rate: '1.00 token',
        unit: 'per hour',
        subtitle: 'Includes speaker diarization',
    },
    {
        title: 'Transcription',
        rate: '+0.25 token',
        unit: 'per hour',
        subtitle: 'Gladia transcription',
    },
    {
        title: 'BYOK Transcription',
        rate: 'Included',
        unit: 'with any plan',
        subtitle: '(Bring Your Own Key)',
    },
    {
        title: 'Streaming',
        rate: '+0.10 token',
        unit: 'per hour',
        subtitle: 'Per input or output',
    },
    {
        title: 'Calendar Sync',
        rate: 'Enterprise',
        unit: 'plan only',
    },
]

const LoadingState = () => (
    <div className="container mx-auto max-w-8xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-neutral-400">
                Loading plans...
            </p>
        </div>
    </div>
)

export const PricingPage = ({ isConnected = false }: { isConnected: boolean }) => {
    const { getTokenPacks, isLoading, getPlanInfo, loadPlansData } = useSubscription()

    useEffect(() => {
        console.log('PricingPage mounted, loading plans data...')
        loadPlansData()
    }, [loadPlansData])

    if (isLoading) {
        console.log('PricingPage is loading...')
        return <LoadingState />
    }

    const API_PLAN_TYPES: PlanType[] = [
        'PayAsYouGo',
        'ScaleAPI',
        'EnterpriseAPI',
    ]

    console.log('Rendering PricingPage with plan types:', API_PLAN_TYPES)

    const API_PLANS = API_PLAN_TYPES.map((planType) => {
        const plan = getPlanInfo(planType)
        console.log(`Plan info for ${planType}:`, plan)
        return {
            plan,
            isPopular: planType === 'ScaleAPI',
            features: getFeaturesByPlan(planType),
        }
    })

    console.log('API_PLANS:', API_PLANS)

    function getFeaturesByPlan(plan: PlanType) {
        const planInfo = getPlanInfo(plan)
        if (!planInfo) {
            console.log(`No plan info found for ${plan}`)
            return []
        }

        const features = [
            `${planInfo.requestsPerSecond} req/sec`,
            `${planInfo.concurrentBots} concurrent bots`,
        ]

        if (plan === 'PayAsYouGo') {
            features.push('Basic support')
        } else if (plan === 'ScaleAPI') {
            features.push('Priority support')
        } else if (plan === 'EnterpriseAPI') {
            features.push('Advanced support')
        }

        return features
    }

    return (
        <div className="container mx-auto flex flex-col max-w-8xl rounded-2xl p-2 overflow-y-scroll gap-4 md:gap-8 scrollbar-none bg-primary-500">
            <div className="flex flex-col w-full space-y-6">
                <div className="bg-neutral-900 bg-opacity-10 rounded-xl p-6 space-y-6">
                    <div className="w-full">
                        <div className="flex flex-wrap justify-center gap-6">
                            {TOKEN_RATES.map((rate) => (
                                <div
                                    key={rate.title}
                                    className="flex-1 min-w-full md:min-w-[200px] md:max-w-[250px] min-h-[150px]"
                                >
                                    <TokenRateCard {...rate} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <h2 className="text-lg text-neutral-400 w-full font-medium">
                        Token usage rates per service.
                    </h2>
                </div>

                <div className="bg-neutral-900 rounded-xl p-6 space-y-6">
                    <div className="grid w-full grid-cols-1 xl:grid-cols-3 gap-6">
                        {API_PLANS.map((x) =>
                            x.plan ? (
                                <PlanCard key={x.plan.title} {...x} isConnected={isConnected} />
                            ) : null,
                        )}
                    </div>
                    <h2 className="text-xl text-primary-500 w-full text-left opacity-80">
                        1. Choose your API plan
                    </h2>
                </div>

                {/* Token Packs */}
                <div className="bg-neutral-900 rounded-xl p-6 space-y-6">
                    <div className="grid w-full grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {getTokenPacks().map((pack) => (
                            <TokenPackCard
                                key={pack.title}
                                pack={pack}
                                features={pack.features}
                                isConnected={isConnected}
                            />
                        ))}
                    </div>
                    <h2 className="text-xl text-primary-500 w-full text-left opacity-80">
                        2. Purchase token packs
                    </h2>
                </div>
            </div>
        </div>
    )
} 