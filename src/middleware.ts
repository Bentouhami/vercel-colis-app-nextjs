// path: middleware.ts

import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {isPublicRoute} from "@/utils/publicRoutesHelper";
import {setCorsHeaders} from "@/utils/cors";
import {RoleDto} from "@/services/dtos";


export async function middleware(req: NextRequest) {
    const origin = req.headers.get("origin") || "";
    const corsHeaders = setCorsHeaders(origin);
    console.log("Middleware Debug -> Request cookies:", req.cookies);
    console.log("Middleware Debug -> Auth header:", req.headers.get("authorization"));

    const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET, // Ensure correct secret is used
        raw: true, // Forces retrieval of raw JWT
    });


    console.log("Middleware Debug -> Cookie token found:", !!token);


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
        const token = await getToken({ req, secret: process.env.AUTH_SECRET });

        console.log("Middleware Debug -> Retrieved Token:", token); // 🔍 Log the token in production

        // Check if the user is authenticated
        const isAuthenticated = !!token;

        if (!token) {
            console.warn("Middleware Debug -> No token found. Redirecting to login.");
            return NextResponse.redirect(new URL("/client/auth/login", req.url));
        }

        // Role-based access control
        const userRole = token?.role;
        console.log("Middleware Debug -> User Role:", userRole); // 🔍 Log role in production

        const allowedAdminRoles = [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT];

        if (req.nextUrl.pathname.startsWith("/admin")) {
            if (!userRole || !allowedAdminRoles.includes(userRole)) {
                console.warn("Middleware Debug -> Unauthorized access attempt to /admin, redirecting.");
                return NextResponse.redirect(new URL("/client/unauthorized", req.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware Debug -> ERROR:", error);
        return NextResponse.redirect(new URL("/client/auth/login", req.url));
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
