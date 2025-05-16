import { getAuthSession } from "@/lib/auth/session"
import type { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import ProtectedLayoutClient from "@/app/(protected)/layout-client"
import Providers from "@/components/providers"
import { getAuthAppUrl } from "@/lib/auth/auth-app-url"

export const metadata: Metadata = {
  title: "Billing | Meeting BaaS",
  description: "Access your billing information from Meeting BaaS"
}

const authAppUrl = getAuthAppUrl()

export default async function ProtectedLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const [requestHeaders, requestCookies] = await Promise.all([headers(), cookies()])
  // RSCs need to pass cookies to getAuthSession
  const session = await getAuthSession(requestCookies.toString())
  const jwt = requestCookies.get("jwt")?.value || ""

  if (!session) {
    const redirectTo = requestHeaders.get("x-redirect-to")
    const redirectionUrl = redirectTo
      ? `${authAppUrl}/sign-in?redirectTo=${redirectTo}`
      : `${authAppUrl}/sign-in`
    redirect(redirectionUrl)
  }

  return (
    <Providers jwt={jwt}>
      <ProtectedLayoutClient session={session}>{children}</ProtectedLayoutClient>
    </Providers>
  )
}
