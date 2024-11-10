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
            "/client/tracking/*"
        ];

        if (publicRoutes.includes(req.nextUrl.pathname)) {
            console.log('Public route accessed');
            return NextResponse.next();
        }

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
            console.log('Invalid token, redirecting to login');
            return NextResponse.redirect(new URL("/client/login", req.nextUrl.origin));
        }

        const userRoles = userPayload.roles || []; // Use the roles array
        const isAdmin = userRoles.includes('ADMIN'); // Check if the user has 'ADMIN' role

        if (req.nextUrl.pathname.startsWith('/client/login') || req.nextUrl.pathname.startsWith('/client/register')) {
            if (userRoles.includes('CLIENT') || isAdmin) {
                return NextResponse.redirect(new URL('/client', req.nextUrl.origin));
            }
        }

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
        return payload;
    } catch (error) {
        console.error("Error verifying token with jose:", error);
        return null;
    }
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/users/profile/:path*",
        "/client/payment/:path*",
        "/client/ajouter-destinataire",
    ],
};
