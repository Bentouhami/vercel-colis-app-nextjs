import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isPublicRoute } from "@/utils/publicRoutesHelper";
import { setCorsHeaders } from "@/utils/cors";
import { Roles } from "@/utils/dtos";

export async function middleware(req: NextRequest) {
    const origin = req.headers.get("origin") || "";
    const corsHeaders = setCorsHeaders(origin);

    console.log("--------------------------------");
    console.log("Middleware started. Current Path:", req.nextUrl.pathname);
    console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

    // Handle OPTIONS requests (CORS preflight)
    if (req.method === "OPTIONS") {
        console.log("OPTIONS request allowed");
        if (corsHeaders) {
            return new NextResponse(null, { headers: corsHeaders });
        }
        return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
    }

    // Add CORS headers to all responses
    const response = NextResponse.next();
    if (corsHeaders) {
        Object.entries(corsHeaders).forEach(([key, value]) =>
            response.headers.set(key, value)
        );
    }

    try {
        // Retrieve JWT token
        const token = await getToken({ req, secret: process.env.AUTH_SECRET });

        console.log("JWT Token Retrieved:", token);

        // Check if the user is authenticated
        const isAuthenticated = !!token;

        // Handle public routes
        if (isPublicRoute(req.nextUrl.pathname)) {
            console.log("Public route accessed:", req.nextUrl.pathname);
            return response;
        }

        // Role-based access control
        const userRoles = Array.isArray(token?.roles) ? token.roles : [];
        const isSuperAdmin = userRoles.includes(Roles.SUPER_ADMIN);
        const isAgencyAdmin = userRoles.includes(Roles.AGENCY_ADMIN);

        // Handle redirects for authenticated users
        if (isAuthenticated) {
            if (req.nextUrl.pathname === "/") {
                if (isSuperAdmin) {
                    console.log("Redirecting Super Admin to /admin/super-admin.");
                    return NextResponse.redirect(new URL("/admin/super-admin", req.nextUrl.origin));
                } else if (isAgencyAdmin) {
                    console.log("Redirecting Agency Admin to /admin/agency-admin.");
                    return NextResponse.redirect(new URL("/admin/agency-admin", req.nextUrl.origin));
                } else {
                    console.log("Redirecting Client to /client.");
                    return NextResponse.redirect(new URL("/client", req.nextUrl.origin));
                }
            }
        }

        if (req.nextUrl.pathname.startsWith("/admin") && !isSuperAdmin && !isAgencyAdmin) {
            console.log("Unauthorized access to admin route.");
            return NextResponse.redirect(new URL("/client/unauthorized", req.nextUrl.origin));
        }

        if (req.nextUrl.pathname.startsWith("/admin/super-admin") && !isSuperAdmin) {
            console.log("Unauthorized access to admin route.");
            return NextResponse.redirect(new URL("/client/unauthorized", req.nextUrl.origin));
        }

        console.log("Access granted to protected route.");
        return response;
    } catch (error) {
        console.error("Error in middleware:", error);
        return NextResponse.redirect(new URL("/client/auth/login", req.nextUrl.origin));
    } finally {
        console.log("--------------------------------");
    }
}

// Configuration to apply middleware only to specific routes
export const config = {
    matcher: [
        "/",
        "/admin/:path*",
        "/api/users/profile/:path*",
        "/client/:path*",
    ],
};
