"use client"

import { useQuery } from "@tanstack/react-query"
import { getAuthSession } from "@/lib/auth/session"
import type { Session } from "@/lib/auth/types"
import { useEffect, useState } from "react"

export function useSession(initialSession?: Session) {
  const { data: session } = useQuery<Session | null>({
    queryKey: ["session"],
    queryFn: () => getAuthSession(),
    initialData: initialSession,
    staleTime: 0,
    // Refetch session on window focus, to ensure session is up to date
    refetchOnWindowFocus: true,
    // Don't refetch on mount since layout already has the initial session
    refetchOnMount: false,
    retry: false
  })

  // Force page reload if userId changes. This ensures that the jwt is updated
  const [prevUserId, setPrevUserId] = useState(session?.session?.userId)
  useEffect(() => {
    if (session?.session?.userId !== prevUserId) {
      setPrevUserId(session?.session?.userId)
      window.location.reload()
    }
  }, [session?.session?.userId, prevUserId])

  return session
}
