import { NextResponse } from "next/server"
import { setCorsHeaders } from "./utils/cors"
import { isPublicRoute } from "./utils/publicRoutesHelper"
import { auth } from "./auth/auth"
import { RoleDto } from "@/services/dtos"

// Define role-based route mappings using your RoleDto enum
const ROLE_REDIRECTS = {
  [RoleDto.CLIENT]: "/client",
  [RoleDto.SUPER_ADMIN]: "/admin",
  [RoleDto.AGENCY_ADMIN]: "/admin",
  [RoleDto.ACCOUNTANT]: "/admin",
  [RoleDto.DESTINATAIRE]: "/client",
} as const

export default auth((req) => {
  const origin = req.headers.get("origin") || ""
  const corsHeaders = setCorsHeaders(origin)

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    if (corsHeaders) {
      return new NextResponse(null, { headers: corsHeaders })
    }
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 })
  }

  try {
    const { nextUrl } = req
    const pathname = nextUrl.pathname

    // Get user info from the auth middleware
    const isLoggedIn = !!req.auth
    const userRole = req.auth?.user?.role as RoleDto

    console.log("🔍 Middleware Debug:", {
      pathname,
      isLoggedIn,
      userRole,
      userId: req.auth?.user?.id,
    })

    // Handle public routes first
    if (isPublicRoute(pathname)) {
      const response = NextResponse.next()
      if (corsHeaders) {
        const headers = corsHeaders as Record<string, string>
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value))
      }
      return response
    }

    // Handle auth pages - redirect authenticated users to their dashboard
    if (pathname.startsWith("/client/auth/")) {
      if (isLoggedIn && userRole) {
        const redirectUrl = ROLE_REDIRECTS[userRole]
        console.log("🚀 Redirecting authenticated user from auth page to:", redirectUrl)
        return NextResponse.redirect(new URL(redirectUrl, req.url))
      }

      const response = NextResponse.next()
      if (corsHeaders) {
        const headers = corsHeaders as Record<string, string>
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value))
      }
      return response
    }

    // Admin routes protection
    if (pathname.startsWith("/admin")) {
      if (!isLoggedIn) {
        console.log("🔒 Admin route, not authenticated, redirecting to login")
        const loginUrl = new URL("/client/auth/login", req.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }

      const adminRoles = [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]
      if (!userRole || !adminRoles.includes(userRole)) {
        console.log("🚫 Admin route, insufficient permissions, redirecting")
        return NextResponse.redirect(new URL("/client/unauthorized", req.url))
      }

      console.log("✅ Admin route, authorized access")
    }

    // Client-specific routes protection
    const clientRoutes = ["/client/profile", "/client/payment", "/client/envois"]
    const isClientRoute = clientRoutes.some((route) => pathname.startsWith(route))

    if (isClientRoute) {
      if (!isLoggedIn) {
        console.log("🔒 Client route, not authenticated, redirecting to login")
        const loginUrl = new URL("/client/auth/login", req.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }

      const clientRoles = [RoleDto.CLIENT, RoleDto.DESTINATAIRE]
      if (!userRole || !clientRoles.includes(userRole)) {
        console.log("🚫 Client route, redirecting admin to admin area")
        return NextResponse.redirect(new URL("/admin", req.url))
      }
    }

    // Root path redirect based on role
    if (pathname === "/" && isLoggedIn && userRole) {
      const redirectUrl = ROLE_REDIRECTS[userRole]
      console.log("🚀 Root path, redirecting to:", redirectUrl)
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }

    // Role-based access control for cross-area access
    if (isLoggedIn && userRole) {
      // Prevent clients from accessing admin routes
      if ([RoleDto.CLIENT, RoleDto.DESTINATAIRE].includes(userRole) && pathname.startsWith("/admin")) {
        console.log("🚫 Client trying to access admin, redirecting to client area")
        return NextResponse.redirect(new URL("/client", req.url))
      }

      // Prevent admins from accessing client-specific routes (except auth)
      if (
          [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT].includes(userRole) &&
          pathname.startsWith("/client") &&
          !pathname.startsWith("/client/auth/")
      ) {
        console.log("🚫 Admin trying to access client area, redirecting to admin")
        return NextResponse.redirect(new URL("/admin", req.url))
      }
    }

    const response = NextResponse.next()
    if (corsHeaders) {
      const headers = corsHeaders as Record<string, string>
      Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value))
    }
    return response
  } catch (error) {
    console.error("❌ Middleware error:", error)
    return NextResponse.redirect(new URL("/client/auth/login", req.url))
  }
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
