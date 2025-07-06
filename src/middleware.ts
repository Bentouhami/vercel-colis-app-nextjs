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

    // 🔍 DEBUG: Log what middleware sees
    console.log("🔍 MIDDLEWARE DEBUG:");
    console.log("- Pathname:", pathname);
    console.log("- Token exists:", !!token);
    console.log("- User role:", token?.role);
    console.log("- Is public route:", isPublicRoute(pathname));

    const userRole = token?.role as string;
    const isAuthenticated = !!token;

    const adminRoles = ["SUPER_ADMIN", "AGENCY_ADMIN", "ACCOUNTANT"];
    const isAdmin = adminRoles.includes(userRole);
    const isClient = userRole === "CLIENT";

    // Handle public routes first (marketing pages, etc.)
    if (isPublicRoute(pathname)) {
      console.log("✅ Public route, allowing access");
      const response = NextResponse.next();
      if (corsHeaders) {
        const headers = corsHeaders as Record<string, string>;
        Object.entries(headers).forEach(([key, value]) =>
          response.headers.set(key, value)
        );
      }
      return response;
    }

    // 🔥 Handle auth pages (login, register, forgot-password)
    if (pathname.startsWith("/client/auth/")) {
      if (isAuthenticated) {
        // User is logged in, redirect them away from auth pages
        const redirectUrl = isAdmin ? "/admin" : "/client";
        console.log(
          "🚀 REDIRECTING authenticated user from auth page to:",
          redirectUrl
        );
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      } else {
        // User not logged in, allow access to auth pages
        console.log("✅ Auth page, not authenticated, allowing access");
        const response = NextResponse.next();
        if (corsHeaders) {
          const headers = corsHeaders as Record<string, string>;
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value)
          );
        }
        return response;
      }
    }

    // 2. Protect ADMIN routes - only admin roles
    if (pathname.startsWith("/admin")) {
      if (!isAuthenticated) {
        console.log("🚫 Admin route, not authenticated, redirecting to login");
        return NextResponse.redirect(new URL("/client/auth/login", req.url));
      }
      if (!isAdmin) {
        console.log(
          "🚫 Admin route, not admin role, redirecting to unauthorized"
        );
        return NextResponse.redirect(new URL("/client/unauthorized", req.url));
      }
      console.log("✅ Admin route, admin user, allowing access");
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
        console.log("🚫 Client route, not authenticated, redirecting to login");
        return NextResponse.redirect(new URL("/client/auth/login", req.url));
      }
      if (!isClient) {
        const redirectUrl = isAdmin ? "/admin" : "/client/unauthorized";
        console.log(
          "🚫 Client route, not client role, redirecting to:",
          redirectUrl
        );
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
      console.log("✅ Client route, client user, allowing access");
    }

    // 4. Handle root path redirect
    if (pathname === "/" && isAuthenticated) {
      const redirectUrl = isAdmin ? "/admin" : "/client";
      console.log("🚀 Root path, redirecting to:", redirectUrl);
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
    console.error("❌ Middleware error:", error);
    return NextResponse.redirect(new URL("/client/auth/login", req.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/client/auth/:path*", // ✅ This will now be handled by middleware
    "/client/profile/:path*",
    "/client/payment/:path*",
    "/client/envois/:path*",
  ],
};
