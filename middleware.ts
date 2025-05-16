import { type NextRequest, NextResponse } from "next/server"
import { getAuthAppUrl } from "@/lib/auth/auth-app-url"

if (!process.env.AUTH_COOKIE_NAME) {
  throw new Error("AUTH_COOKIE_NAME environment variable is not defined")
}

const protectedRoutes = ["/billing"]
const publicRoutes = ["/pricing"]
const authAppUrl = getAuthAppUrl()

export async function middleware(request: NextRequest) {
  // Check if auth cookie exists before processing request
  // Fetch session in RSC/APIs to further protect a route
  const authCookieName = process.env.AUTH_COOKIE_NAME
  const cookie = authCookieName ? request.cookies.get(authCookieName) : undefined
  const response = NextResponse.next()

  const signInUrl = `${authAppUrl}/sign-in`
  const appUrl = request.nextUrl.origin
  const redirectTo = `${appUrl}${request.nextUrl.pathname}${request.nextUrl.search}`

  const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname)
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  if (isProtectedRoute && !cookie) {
    const newUrl = new URL(`${signInUrl}${request.nextUrl.search}`)
    newUrl.searchParams.set("redirectTo", redirectTo)
    return NextResponse.redirect(newUrl)
  }

  if (isPublicRoute && cookie) {
    return NextResponse.redirect(new URL("/billing", request.url))
  }

  // Setting a custom header so that RSCs can handle redirection if session not found
  response.headers.set("x-redirect-to", redirectTo)

  return response
}

// skipping static and api routes
// Api routes are protected by fetch session request
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
}
