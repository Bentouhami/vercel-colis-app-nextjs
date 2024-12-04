import { auth } from "@/auth/auth"; // Import the `auth` wrapper
import { NextResponse } from "next/server";
import { Roles } from "@/utils/dtos";
import { isPublicRoute } from "@/utils/publicRoutesHelper";
import { setCorsHeaders } from "@/utils/cors";

// List of protected routes
const protectedRoutes = [
    "/admin",
    "/client/ajouter-destinataire",
    "/client/payment",
    "/client/simulation",
];

// Middleware wrapped with `auth()`
export default auth(async (req) => {
    console.log("--------------------------------");
    console.log("Middleware started. Current Path:", req.nextUrl.pathname);

    // Manage CORS
    const origin = req.headers.get("origin") || "";
    const corsHeaders = setCorsHeaders(origin);
    const response = NextResponse.next();

    if (corsHeaders) {
        Object.entries(corsHeaders).forEach(([key, value]) =>
            response.headers.set(key, value)
        );
        console.log("CORS headers added for origin:", origin);
    }

    // Handle OPTIONS request (CORS preflight)
    if (req.method === "OPTIONS") {
        console.log("OPTIONS request detected. Allowing preflight.");
        return new NextResponse(null, { headers: corsHeaders });
    }

    // Extract session from `auth()`
    const { auth: session } = req;
    console.log("Session data retrieved:", session);

    const isAuthenticated = !!session?.user;

    // CSRF Token extraction
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

    // Public route handling
    if (isPublicRoute(req.nextUrl.pathname)) {
        console.log("Public route accessed:", req.nextUrl.pathname);
        return response;
    }

    // Protected route handling
    const isProtectedRoute = protectedRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute && !isAuthenticated) {
        console.log("Unauthenticated access attempt. Redirecting to login.");
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = "/client/auth/login";
        redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
        console.log("Redirecting to:", redirectUrl.toString());
        return NextResponse.redirect(redirectUrl);
    }

    // Role-based access control for admin routes
    const userRoles = session?.user?.roles || [];
    const isSuperAdmin = userRoles.includes(Roles.SUPER_ADMIN);
    const isAgencyAdmin = userRoles.includes(Roles.AGENCY_ADMIN);

    if (req.nextUrl.pathname.startsWith("/admin") && !isSuperAdmin && !isAgencyAdmin) {
        console.log("Unauthorized access to admin route. Redirecting to unauthorized page.");
        return NextResponse.redirect(new URL("/client/unauthorized", req.nextUrl.origin));
    }

    console.log("Access granted to protected route:", req.nextUrl.pathname);
    return response;
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}