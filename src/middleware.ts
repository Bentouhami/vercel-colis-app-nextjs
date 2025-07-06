import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { setCorsHeaders } from "./utils/cors";
import { isPublicRoute } from "./utils/publicRoutesHelper";

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

    // Handle public routes first (with corrected paths)
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

    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    // Only handle authenticated users on login page
    if (pathname === "/client/auth/login" && token?.role) {
      const adminRoles = ["SUPER_ADMIN", "AGENCY_ADMIN", "ACCOUNTANT"];

      if (adminRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
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
    console.error("Middleware error:", error);
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

export const config = {
  matcher: ["/client/:path*"],
};
