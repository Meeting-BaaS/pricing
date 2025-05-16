import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing | Meeting BaaS",
  description: "Pricing for Meeting BaaS"
}

export default async function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className="grow">{children}</main>
      <Footer page="Pricing" />
    </>
  )
}
