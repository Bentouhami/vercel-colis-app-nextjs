import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isPublicRoute } from "@/utils/publicRoutesHelper";
import { setCorsHeaders } from "@/utils/cors";
import { RoleDto } from "@/services/dtos";
import { adminPath, clientPath } from "@/utils/constants";

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = setCorsHeaders(origin);

  // Handle OPTIONS requests (CORS preflight)
  if (req.method === "OPTIONS") {
    if (corsHeaders) {
      return new NextResponse(null, { headers: corsHeaders });
    }
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  }

  try {
    // Retrieve JWT token with explicit secret
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      // Add cookieName for better compatibility
      cookieName:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
    });

    const isAuthenticated = !!token;
    const userRole = token?.role;
    const pathname = req.nextUrl.pathname;

    // Handle public routes first
    if (isPublicRoute(pathname)) {
      const response = NextResponse.next();
      if (corsHeaders) {
        Object.entries(corsHeaders).forEach(([key, value]) =>
          response.headers.set(key, value)
        );
      }
      return response;
    }

    const allowedAdminRoles = [
      RoleDto.SUPER_ADMIN,
      RoleDto.AGENCY_ADMIN,
      RoleDto.ACCOUNTANT,
    ];

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(clientPath("/auth/login"), req.url));
    }

    // **KEY FIX**: Handle authenticated users trying to access auth pages
    if (
      isAuthenticated &&
      (pathname === "/client/auth/login" ||
        pathname === "/client/auth/register" ||
        pathname === "/")
    ) {
      // Add cache control headers to prevent caching issues
      const redirectUrl = allowedAdminRoles.includes(userRole!)
        ? new URL(adminPath(), req.nextUrl.origin)
        : new URL(clientPath(), req.nextUrl.origin);

      const response = NextResponse.redirect(redirectUrl);

      // Prevent caching of redirects
      response.headers.set(
        "Cache-Control",
        "no-cache, no-store, must-revalidate"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");

      if (corsHeaders) {
        Object.entries(corsHeaders).forEach(([key, value]) =>
          response.headers.set(key, value)
        );
      }

      return response;
    }

    // Admin route protection
    if (pathname.startsWith("/admin")) {
      if (!userRole || !allowedAdminRoles.includes(userRole)) {
        return NextResponse.redirect(
          new URL("/client/unauthorized", req.nextUrl.origin)
        );
      }
    }

    // Client route protection - redirect admin users away from client routes
    if (
      pathname.startsWith(clientPath()) &&
      !pathname.startsWith(clientPath("/auth"))
    ) {
      if (allowedAdminRoles.includes(userRole!)) {
        return NextResponse.redirect(new URL(adminPath(), req.nextUrl.origin));
      }
    }

    // Default response with CORS headers
    const response = NextResponse.next();
    if (corsHeaders) {
      Object.entries(corsHeaders).forEach(([key, value]) =>
        response.headers.set(key, value)
      );
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(
      new URL(clientPath("/auth/login"), req.nextUrl.origin)
    );
  }
}

// Configuration to apply middleware only to specific routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
