import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { setCorsHeaders } from "./utils/cors";
import { isPublicRoute } from "./utils/publicRoutesHelper";

//  Use getToken() - the simplest and most reliable approach for Edge Runtime
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

    //  Use getToken() - lightweight and Edge Runtime compatible
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

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

        return NextResponse.redirect(new URL(redirectUrl, req.url));
      } else {
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

    // ADMIN ROUTES
    if (pathname.startsWith("/admin")) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/client/auth/login", req.url));
      }
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/client/unauthorized", req.url));
      }
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
        return NextResponse.redirect(new URL("/client/auth/login", req.url));
      }
      if (!isClient) {
        const redirectUrl = isAdmin ? "/admin" : "/client/unauthorized";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
    }

    // Root path redirect
    if (pathname === "/" && isAuthenticated) {
      const redirectUrl = isAdmin ? "/admin" : "/client";
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
    console.error(" Middleware error:", error);
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
