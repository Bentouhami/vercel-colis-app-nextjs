import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isPublicRoute } from "@/utils/publicRoutesHelper";
import { setCorsHeaders } from "@/utils/cors";
import {Roles} from "@/utils/dtos";

export async function middleware(req: NextRequest) {
    const origin = req.headers.get("origin") || "";
    const corsHeaders = setCorsHeaders(origin);

    console.log("--------------------------------");
    console.log("Middleware started. Current Path:", req.nextUrl.pathname);
    console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

    // Fetch CSRF Token
    try {
        const csrfTokenCookie = req.cookies?.get("authjs.csrf-token")?.value;
        if (csrfTokenCookie) {
            const csrfToken = csrfTokenCookie.split("|")[0]; // Extract the actual token
            console.log("Extracted CSRF Token:", csrfToken);
        } else {
            console.warn("CSRF Token Cookie is missing or undefined.");
        }
    } catch (error) {
        console.error("Error extracting CSRF Token:", error);
    }

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

        // Handle login and register routes
        if (
            req.nextUrl.pathname.startsWith("/client/auth/login") ||
            req.nextUrl.pathname.startsWith("/client/auth/register")
        ) {
            if (isAuthenticated) {
                console.log("User already authenticated. Redirecting to /client/simulation.");
                return NextResponse.redirect(new URL("/client/simulation", req.nextUrl.origin));
            }
            return response;
        }

        // Allow access to public routes
        if (isPublicRoute(req.nextUrl.pathname)) {
            console.log("Public route accessed:", req.nextUrl.pathname);
            return response;
        }

        // Redirect unauthenticated users on protected routes
        if (!isAuthenticated) {
            console.log("No valid token found. Redirecting to login.");
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = "/client/auth/login";
            redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }

        // Role-based access control
        const userRoles = Array.isArray(token?.roles) ? token.roles : [];
        const isSuperAdmin = userRoles.includes(Roles.SUPER_ADMIN);
        const isAgencyAdmin = userRoles.includes(Roles.AGENCY_ADMIN);

        if (req.nextUrl.pathname.startsWith("/admin") && !isSuperAdmin && !isAgencyAdmin) {
            console.log("Unauthorized access to admin route.");
            return NextResponse.redirect(new URL("/client/unauthorized", req.nextUrl.origin));
        }

        if (req.nextUrl.pathname.startsWith("/admin/super-admin") && !isSuperAdmin) {
            console.log("Unauthorized access to admin route.");
            return NextResponse.redirect(new URL("/client/unauthorized", req.nextUrl.origin));
        }

        // if (req.nextUrl.pathname.startsWith("/admin/agency-admin") && !isAgencyAdmin) {
        //     console.log("Unauthorized access to admin route.");
        //     return NextResponse.redirect(new URL("/client/unauthorized", req.nextUrl.origin));
        // }

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
        "/admin/:path*",
        "/api/users/profile/:path*",
        "/client/ajouter-destinataire",
        "/client/payment/:path*",
        "/client/auth/:path*",
        "/client/simulation/:path*",
        "/client/services/:path*",
        "/client/tarifs/:path*",
        "/client/contact-us/:path*",
    ],
};
