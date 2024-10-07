// middleware.ts
import {NextRequest, NextResponse} from "next/server";
import {jwtVerify} from "jose";

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
            "/client/contact-us"
        ];

        if (publicRoutes.includes(req.nextUrl.pathname)) {
            console.log('Public route accessed');
            return NextResponse.next();
        }

        if (!token) {
            console.log('No token found, redirecting to login');
            return NextResponse.redirect(new URL("/client/login", req.nextUrl.origin));
        }

        // Vérification du token JWT avec jose
        const userPayload = await verifyTokenWithJose(token);
        console.log('User Payload:', userPayload);

        if (!userPayload) {
            console.log('Invalid token, redirecting to login');
            return NextResponse.redirect(new URL("/client/login", req.nextUrl.origin));
        }

        if ((req.nextUrl.pathname.startsWith('/client/login' || req.nextUrl.pathname.startsWith('/client/register'))) && (userPayload.role === 'USER' || userPayload.role === 'ADMIN')) {
            return NextResponse.redirect(new URL('/client', req.nextUrl.origin));
        }

        const isAdmin = userPayload.role === 'ADMIN';
        console.log('Is Admin:', isAdmin);
        console.log('User Role:', userPayload.role);

        if (req.nextUrl.pathname.startsWith('/admin')) {
            console.log('Attempting to access admin route');
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

// Fonction pour vérifier le token avec jose
async function verifyTokenWithJose(token: string) {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Encoder la clé secrète
        const {payload} = await jwtVerify(token, secret); // Vérifier le token avec jose
        return payload; // Le payload contient les informations du token (comme role, userEmail, etc.)
    } catch (error) {
        console.error("Error verifying token with jose:", error);
        return null;
    }
}

export const config = {
    matcher: [
        "/client/:path*",
        "/admin/:path*",
        "/api/users/profile/:path*",
        "/payment/:path*",
    ],
};
