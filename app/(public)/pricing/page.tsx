import type { Metadata } from "next"
import { PricingPage } from "../../../components/PricingPage"

export const metadata: Metadata = {
  title: "Pricing | Meeting BaaS",
  description: "Pricing for Meeting BaaS"
}

export default function Page() {
  return <PricingPage isConnected={false} />
}
