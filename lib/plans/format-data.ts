import type {
  PlanInfo,
  PlanType,
  ProductFetchResponse,
  PlanMetadata,
  TokenPackInfo,
  TokenPackMetadata
} from "@/lib/plans/types"
import { defaultPlanInfo, packFeatures } from "@/lib/plans/constants"
import { getAuthAppUrl } from "@/lib/auth/auth-app-url"
import { BILLING_URL } from "@/lib/external-urls"

interface FormattedData {
  apiPlans: PlanInfo[]
  tokenPacks: TokenPackInfo[]
}

const getRedirectTo = (planType: PlanType) => {
  const signInUrl = getAuthAppUrl()
  const redirectTo = encodeURIComponent(`${BILLING_URL}?plan=${planType.toLowerCase()}`)

  return `${signInUrl}/sign-in?redirectTo=${redirectTo}`
}

export const formatData = (products: ProductFetchResponse): FormattedData => {
  const apiPlans: PlanInfo[] = [defaultPlanInfo]
  const tokenPacks: TokenPackInfo[] = []

  // Handle API plans
  for (const [key, value] of Object.entries(products.plans)) {
    const metadata = value.product.metadata as PlanMetadata
    apiPlans.push({
      concurrentBots: Number.parseInt(metadata.concurrentBots ?? "0"),
      requestsPerSecond: Number.parseInt(metadata.requestsPerSecond ?? "0"),
      tokenDiscount: Number.parseInt(metadata.tokenDiscount ?? "0"),
      price: (value.prices[0].unit_amount / 100).toString(),
      billingScheme: value.prices[0].billing_scheme,
      currency: value.prices[0].currency,
      interval: value.prices[0].recurring.interval,
      active: value.product.active,
      livemode: value.product.livemode,
      title: value.product.name.replace("Baas ", ""), // Remove the "Baas " prefix from the title
      type: key as PlanType,
      features: packFeatures[key as PlanType],
      redirectTo: getRedirectTo(key as PlanType)
    })
  }

  for (const [key, value] of Object.entries(products.tokenPacks)) {
    const metadata = value.product.metadata as TokenPackMetadata
    tokenPacks.push({
      title: value.product.name.replace("Baas ", ""), // Remove the "Baas " prefix from the title
      price: value.prices[0].unit_amount / 100,
      stripe_price_id: value.prices[0].id,
      features: packFeatures[key as PlanType],
      tokens: Number.parseInt(metadata.tokens),
      isHighlighted: false,
      type: key as PlanType,
      redirectTo: getRedirectTo(key as PlanType)
    })
  }

  return { apiPlans, tokenPacks }
}
