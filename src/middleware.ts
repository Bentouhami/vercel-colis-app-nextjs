// path: middleware.ts

import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {isPublicRoute} from "@/utils/publicRoutesHelper";
import {setCorsHeaders} from "@/utils/cors";
import {RoleDto} from "@/services/dtos";
import {adminPath, clientPath} from "@/utils/constants";


export async function middleware(req: NextRequest) {
    const origin = req.headers.get("origin") || "";
    const corsHeaders = setCorsHeaders(origin);


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
        console.log("--------------Start Middleware-------------");
        // Retrieve JWT token
        const token = await getToken({req, secret: process.env.AUTH_SECRET});


        // Check if the user is authenticated
        const isAuthenticated = !!token;

        // Handle public routes
        if (isPublicRoute(req.nextUrl.pathname)) {
            return response;
        }

        // Role-based access control
        const userRole = token?.role;

        const allowedAdminRoles = [
            RoleDto.SUPER_ADMIN,
            RoleDto.AGENCY_ADMIN,
            RoleDto.ACCOUNTANT
        ];

        // Redirection des rôles "admin" s'ils tentent d'accéder à l'espace client
        if (req.nextUrl.pathname.startsWith(clientPath())) {
            if (allowedAdminRoles.includes(userRole!)) {
                return NextResponse.redirect(new URL(adminPath(), req.nextUrl.origin));
            }
        }


        if (req.nextUrl.pathname.startsWith("/admin")) {
            if (!userRole || !allowedAdminRoles.includes(userRole)) {
                return NextResponse.redirect(
                    new URL(clientPath("/auth/login"), req.url)
                );
            }
        }

        // Handle redirects for authenticated users
        if (isAuthenticated) {

            if (req.nextUrl.pathname === "/client/auth/login" ||
                req.nextUrl.pathname === "/client/auth/register" ||
                req.nextUrl.pathname === "/" ||
                req.nextUrl.pathname.startsWith("/client")
            ) {
                if (allowedAdminRoles.includes(userRole!)) {
                    return NextResponse.redirect(new URL(adminPath(), req.nextUrl.origin));
                } else {
                    return NextResponse.redirect(new URL(clientPath(), req.nextUrl.origin));
                }
            }

        }

        // if (req.nextUrl.pathname.startsWith("/admin")) {
        //     // Allow access only if user is a SUPER_ADMIN, AGENCY_ADMIN, or ACCOUNTANT
        //     if (!allowedAdminRoles.includes(userRole!)) {
        //         return NextResponse.redirect(new URL("/client/unauthorized", req.nextUrl.origin));
        //     }
        // }


        return response;
    } catch (error) {
        return NextResponse.redirect(new URL("/client/auth/login", req.nextUrl.origin));
    } finally {
        console.log("---------------End Middleware-------------");
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