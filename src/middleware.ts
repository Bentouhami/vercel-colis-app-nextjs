import { type NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth/auth.config";
import { setCorsHeaders } from "./utils/cors";
import { isPublicRoute } from "./utils/publicRoutesHelper";

// ✅ Lightweight Auth.js instance WITHOUT database adapter - for Edge Runtime
const { auth: middlewareAuth } = NextAuth(authConfig);

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = setCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    if (corsHeaders) {
      return new NextResponse(null, { headers: corsHeaders });
    }
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  }

  try {
    const pathname = req.nextUrl.pathname;

    // 🔍 ENHANCED DEBUG: Check cookies and token
    if (pathname.startsWith("/admin")) {
      console.log("🔍 ADMIN ACCESS DEBUG:");
      console.log("- Pathname:", pathname);
      console.log(
        "- All cookies:",
        req.cookies
          .getAll()
          .map((c) => `${c.name}=${c.value.substring(0, 20)}...`)
      );
      console.log("- AUTH_SECRET exists:", !!process.env.AUTH_SECRET);
      console.log("- AUTH_SECRET length:", process.env.AUTH_SECRET?.length);
    }

    // ✅ Use lightweight auth instance (no database dependencies)
    const session = await middlewareAuth();
    const token = session?.user;

    // MORE DEBUG for admin access
    if (pathname.startsWith("/admin")) {
      console.log("- Raw token:", token ? "EXISTS" : "NULL");
      console.log("- Token role:", token?.role);
      console.log("- Token email:", token?.email);
      console.log("- Token id:", token?.id);
    }

    const userRole = token?.role as string;
    const isAuthenticated = !!token;

    const adminRoles = ["SUPER_ADMIN", "AGENCY_ADMIN", "ACCOUNTANT"];
    const isAdmin = adminRoles.includes(userRole);
    const isClient = userRole === "CLIENT";

    // FINAL DEBUG before decision
    if (pathname.startsWith("/admin")) {
      console.log("- isAuthenticated:", isAuthenticated);
      console.log("- isAdmin:", isAdmin);
      console.log("- Will redirect to login:", !isAuthenticated);
    }

    // Handle public routes first
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

    // Handle auth pages
    if (pathname.startsWith("/client/auth/")) {
      if (isAuthenticated) {
        const redirectUrl = isAdmin ? "/admin" : "/client";
        console.log(
          "🚀 REDIRECTING authenticated user from auth page to:",
          redirectUrl
        );
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      } else {
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

    // 🔥 ADMIN ROUTES - This is where your issue was
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

    // Client-only routes
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
    }

    // Root path redirect
    if (pathname === "/" && isAuthenticated) {
      const redirectUrl = isAdmin ? "/admin" : "/client";
      console.log("🚀 Root path, redirecting to:", redirectUrl);
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

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
    "/client/auth/:path*",
    "/client/profile/:path*",
    "/client/payment/:path*",
    "/client/envois/:path*",
  ],
};
