import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { setCorsHeaders } from "./utils/cors";
import { isPublicRoute } from "./utils/publicRoutesHelper";

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
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const pathname = req.nextUrl.pathname;
    const userRole = token?.role as string;
    const isAuthenticated = !!token;

    const adminRoles = ["SUPER_ADMIN", "AGENCY_ADMIN", "ACCOUNTANT"];
    const isAdmin = adminRoles.includes(userRole);
    const isClient = userRole === "CLIENT";

    // Handle public routes first (marketing pages, etc.)
    if (isPublicRoute(pathname)) {
      const response = NextResponse.next();
      if (corsHeaders) {
        const headers = corsHeaders as Record<string, string>;
        Object.entries(headers).forEach(([key, value]) =>
          response.headers.set(key, value)
        );
      }
      return response;
    }

    // 1. Prevent ANY authenticated user from accessing auth pages
    if (pathname.startsWith("/client/auth/") && isAuthenticated) {
      const redirectUrl = isAdmin ? "/admin" : "/client";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // 2. Protect ADMIN routes - only admin roles
    if (pathname.startsWith("/admin")) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/client/auth/login", req.url));
      }
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/client/unauthorized", req.url));
      }
    }

    // 3. Protect CLIENT-ONLY routes
    const clientOnlyRoutes = [
      "/client/profile",
      "/client/payment",
      "/client/envois",
    ];
    const isClientOnlyRoute = clientOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isClientOnlyRoute) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/client/auth/login", req.url));
      }
      if (!isClient) {
        // Admin trying to access client routes → redirect to admin dashboard
        const redirectUrl = isAdmin ? "/admin" : "/client/unauthorized";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
    }

    // 4. Handle root path redirect
    if (pathname === "/" && isAuthenticated) {
      const redirectUrl = isAdmin ? "/admin" : "/client";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // Create response with CORS headers
    const response = NextResponse.next();
    if (corsHeaders) {
      const headers = corsHeaders as Record<string, string>;
      Object.entries(headers).forEach(([key, value]) =>
        response.headers.set(key, value)
      );
    }
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, redirect to login
    return NextResponse.redirect(new URL("/client/auth/login", req.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/client/auth/:path*",
    "/client/profile/:path*",
    "/client/payment/:path*",
    "/client/envois/:path*",
  ],
};
