import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    try {
        console.log('--------------------------------');
        console.log('Middleware Started');
        console.log('Current Path:', req.nextUrl.pathname);

        const cookieName = process.env.COOKIE_NAME || "auth";
        const jwtToken = req.cookies.get(cookieName);
        const token = jwtToken?.value;

        console.log('Token exists:', !!token);

        const publicRoutes = [
            "/client/login",
            "/client/register",
            "/client/forgot-password",
            "/client/simulation",
            "/client/simulation/results",
            "/client/services",
            "/client/tarifs",
            "/client/contact-us",
            "/client/unauthorized",
            "/client/tracking/*",
            "/client/payment/payment-success", // Add success page as public
            "/client/payment/payment-cancel",  // Add cancel page as public
        ];

        // Allow access to public routes without authentication
        if (publicRoutes.includes(req.nextUrl.pathname)) {
            console.log('Public route accessed');
            return NextResponse.next();
        }

        // Check for token on protected routes
        if (!token) {
            console.log('No token found, redirecting to client home page');
            return NextResponse.redirect(new URL("/client", req.nextUrl.origin));
        }

        console.log('Cookie Name:', cookieName);
        console.log('Token:', token ? "Token Found" : "No Token");

        // Verify the JWT token
        const userPayload = await verifyTokenWithJose(token);
        console.log('User Payload:', userPayload);

        if (!userPayload) {
            console.log('Invalid or expired token, redirecting to login');
            return NextResponse.redirect(new URL("/client/login", req.nextUrl.origin));
        }

        const userRoles = Array.isArray(userPayload.roles) ? userPayload.roles : [];
        const isAdmin = userRoles.includes('ADMIN');

        // Redirect authenticated users away from login or register pages
        if (req.nextUrl.pathname.startsWith('/client/login') || req.nextUrl.pathname.startsWith('/client/register')) {
            if (userRoles.includes('CLIENT') || isAdmin) {
                return NextResponse.redirect(new URL('/client', req.nextUrl.origin));
            }
        }

        // Admin route protection
        if (req.nextUrl.pathname.startsWith('/admin')) {
            if (!isAdmin) {
                console.log('Unauthorized access to admin route');
                return NextResponse.redirect(new URL('/client/unauthorized', req.nextUrl.origin));
            }
            console.log('Admin access granted');
            return NextResponse.next();
        }

        console.log('Access granted to protected route');
        return NextResponse.next();

    } catch (error) {
        console.error("Error in middleware:", error);
        return NextResponse.redirect(new URL("/client/login", req.nextUrl.origin));
    } finally {
        console.log('--------------------------------');
    }
}

// Verify token with jose
async function verifyTokenWithJose(token: string) {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (!Array.isArray(payload.roles)) {
            payload.roles = [];
        }

        if (payload.exp && Date.now() >= payload.exp * 1000) {
            console.log("Token has expired");
            return null;
        }

        return payload;
    } catch (error) {
        console.error("Error verifying token with jose:", error);
        return null;
    }
}

// Middleware configuration for matching routes
export const config = {
    matcher: [
        "/admin/:path*",
        "/api/users/profile/:path*",
        "/client/ajouter-destinataire",
        "/client/payment/:path*", // Protects /client/payment and its subpaths
        "/client/login",
        "/client/register",
    ],
};
