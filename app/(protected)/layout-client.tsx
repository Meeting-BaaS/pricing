"use client"

import type { Session } from "@/lib/auth/types"
import ProtectedHeader from "@/components/protected-header"
import Footer from "@/components/footer"
import { useSession } from "@/hooks/use-session"

interface ProtectedLayoutClientProps {
  session: Session
  children: React.ReactNode
}

export default function ProtectedLayoutClient({
  children,
  session: initialSession
}: ProtectedLayoutClientProps) {
  const session = useSession(initialSession)

  if (!session) {
    return null
  }

  return (
    <>
      <ProtectedHeader user={session.user} />
      <main className="grow">{children}</main>
      <Footer page="Billing" />
    </>
  )
}
