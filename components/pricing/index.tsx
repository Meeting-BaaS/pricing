"use client"

import { sectionVariant } from "@/components/animations/section"
import { TokenUsageRates } from "@/components/billing/token-usage-rates"
import { Heading } from "@/components/layout/heading"
import { ComparePlans } from "@/components/pricing/compare-plans"
import { FAQSection } from "@/components/pricing/faq-section"
import { PlanCard } from "@/components/pricing/plan-card"
import { TokenCard } from "@/components/pricing/token-card"
import type { PlanInfo, TokenPackInfo } from "@/lib/plans/types"
import { motion } from "motion/react"

interface PricingProps {
  apiPlans: PlanInfo[]
  tokenPacks: TokenPackInfo[]
}

export default function Pricing({ apiPlans, tokenPacks }: PricingProps) {
  return (
    <div className="container mx-auto mt-10 mb-20 flex flex-col gap-12 px-6 lg:px-0">
      <Heading
        text="Simple, Transparent Pricing"
        description="With a multi-tier API and token pack system, there's a plan for everyone"
      />
      <motion.section {...sectionVariant(0.2)}>
        <TokenUsageRates />
      </motion.section>
      <motion.section id="token-packs" {...sectionVariant()}>
        <Heading
          text="Token Packs"
          description="Purchase tokens to power your meeting bots. Use them anytime, they never expire."
        />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {tokenPacks.map((pack) => (
            <TokenCard
              key={pack.type}
              pack={pack}
              isHighlighted={pack.type === "EnterprisePack"}
              apiPlans={apiPlans}
            />
          ))}
        </div>
      </motion.section>
      <motion.section
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        {...sectionVariant(0.25)}
      >
        {apiPlans.map((plan) => (
          <PlanCard
            key={plan.type}
            plan={plan}
            isHighlighted={plan.type === "ScaleAPI"}
            onboardingFeature={plan.type === "PayAsYouGo"}
          />
        ))}
      </motion.section>
      <motion.section {...sectionVariant()}>
        <Heading text="Compare Plans" className="mb-2 md:mb-4" />
        <ComparePlans plans={apiPlans} />
      </motion.section>

      <FAQSection />
    </div>
  )
}
