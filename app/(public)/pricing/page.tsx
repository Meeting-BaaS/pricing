import type { Metadata } from "next"
import { fetchAllProducts } from "@/lib/plans/server-api"
import { cache } from "react"
import { formatData } from "@/lib/plans/format-data"
import Pricing from "@/components/pricing"

const fetchCachedProducts = cache(fetchAllProducts)

export const metadata: Metadata = {
  title: "Pricing | Meeting BaaS",
  description: "Pricing for Meeting BaaS"
}

export default async function Page() {
  const products = await fetchCachedProducts()
  const { apiPlans, tokenPacks } = formatData(products)

  return <Pricing apiPlans={apiPlans} tokenPacks={tokenPacks} />
}
