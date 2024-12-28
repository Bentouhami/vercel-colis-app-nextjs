import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {isPublicRoute} from "@/utils/publicRoutesHelper";
import {setCorsHeaders} from "@/utils/cors";
import {Roles} from "@/services/dtos";

export async function middleware(req: NextRequest) {
    const origin = req.headers.get("origin") || "";
    const corsHeaders = setCorsHeaders(origin);

    console.log("--------------------------------");

    // Handle OPTIONS requests (CORS preflight)
    if (req.method === "OPTIONS") {
        if (corsHeaders) {
            return new NextResponse(null, {headers: corsHeaders});
        }
        return NextResponse.json({error: "Origin not allowed"}, {status: 403});
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
        const token = await getToken({req, secret: process.env.AUTH_SECRET});


        // Check if the user is authenticated
        const isAuthenticated = !!token;

        // Handle public routes
        if (isPublicRoute(req.nextUrl.pathname)) {
            return response;
        }

        // Role-based access control
        const userRoles = Array.isArray(token?.roles) ? token.roles : [];
        const isSuperAdmin = userRoles.includes(Roles.SUPER_ADMIN);
        const isAgencyAdmin = userRoles.includes(Roles.AGENCY_ADMIN);

        // Handle redirects for authenticated users
        if (isAuthenticated) {
            if(req.nextUrl.pathname === "/client/auth/login" || req.nextUrl.pathname === "/client/auth/register") {
                return NextResponse.redirect(new URL("/client", req.nextUrl.origin));
            }
            if (req.nextUrl.pathname === "/") {
                if (isSuperAdmin) {
                    return NextResponse.redirect(new URL("/admin/super-admin", req.nextUrl.origin));
                } else if (isAgencyAdmin) {
                    return NextResponse.redirect(new URL("/admin/agency-admin", req.nextUrl.origin));
                } else {
                    return NextResponse.redirect(new URL("/client", req.nextUrl.origin));
                }
            }
        }

        if (req.nextUrl.pathname.startsWith("/admin") && !isSuperAdmin && !isAgencyAdmin) {
            return NextResponse.redirect(new URL("/client/unauthorized", req.nextUrl.origin));
        }

        if (req.nextUrl.pathname.startsWith("/admin/super-admin") && !isSuperAdmin) {
            return NextResponse.redirect(new URL("/client/unauthorized", req.nextUrl.origin));
        }

        console.log("Access granted to protected route.");
        return response;
    } catch (error) {
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
