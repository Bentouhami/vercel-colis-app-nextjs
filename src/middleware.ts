import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { isPublicRoute } from "@/utils/publicRoutesHelper";
import { setCorsHeaders } from "@/utils/cors";

export async function middleware(req: NextRequest) {
    const origin = req.headers.get("origin") || "";
    const corsHeaders = setCorsHeaders(origin);

    try {
        console.log('--------------------------------');
        console.log('Middleware started Current Path:', req.nextUrl.pathname);

        // Gestion des requêtes OPTIONS (CORS)
        if (req.method === "OPTIONS") {
            console.log("OPTIONS request allowed");
            if (corsHeaders) {
                return new NextResponse(null, { headers: corsHeaders });
            }
            return NextResponse.json({ error: "Origine non autorisée" }, { status: 403 });
        }

        // Ajout des en-têtes CORS pour toutes les requêtes
        const response = NextResponse.next();
        if (corsHeaders) {
            Object.entries(corsHeaders).forEach(([key, value]) =>
                response.headers.set(key, value)
            );
        }

        // Vérifie si la route est publique
        if (isPublicRoute(req.nextUrl.pathname)) {
            console.log("Public route accessed:", req.nextUrl.pathname);
            return response;
        }

        // Gestion des routes protégées avec JWT
        const cookieName = process.env.COOKIE_NAME || "auth";
        const jwtToken = req.cookies.get(cookieName);
        const token = jwtToken?.value;

        if (!token) {
            console.log('No token found, redirecting to client home page');
            return NextResponse.redirect(new URL("/client", req.nextUrl.origin));
        }

        const userPayload = await verifyTokenWithJose(token);
        if (!userPayload) {
            console.log('Invalid or expired token, redirecting to login');
            return NextResponse.redirect(new URL("/client/login", req.nextUrl.origin));
        }

        console.log('User Payload:', userPayload);

        const userRoles = Array.isArray(userPayload.roles) ? userPayload.roles : [];
        const isAdmin = userRoles.includes('ADMIN');

        // Rediriger les utilisateurs authentifiés depuis login/register
        if (
            req.nextUrl.pathname.startsWith('/client/login') ||
            req.nextUrl.pathname.startsWith('/client/register')
        ) {
            if (userRoles.includes('CLIENT') || isAdmin) {
                return NextResponse.redirect(new URL('/client', req.nextUrl.origin));
            }
        }

        // Protection des routes admin
        if (req.nextUrl.pathname.startsWith('/admin')) {
            if (!isAdmin) {
                console.log('Unauthorized access to admin route');
                return NextResponse.redirect(new URL('/client/unauthorized', req.nextUrl.origin));
            }
            console.log('Admin access granted');
        }

        console.log('Access granted to protected route');
        return response;

    } catch (error) {
        console.error("Error in middleware:", error);
        return NextResponse.redirect(new URL("/client/login", req.nextUrl.origin));
    } finally {
        console.log('--------------------------------');
    }
}

// Fonction pour vérifier le token JWT avec jose
async function verifyTokenWithJose(token: string) {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (!payload.exp || Date.now() >= payload.exp * 1000) {
            console.log("Token has expired");
            return null;
        }

        return payload;
    } catch (error) {
        console.error("Error verifying token with jose:", error);
        return null;
    }
}

// Configuration pour appliquer le middleware uniquement aux routes correspondantes
export const config = {
    matcher: [
        "/admin/:path*",
        "/api/users/profile/:path*",
        "/client/ajouter-destinataire",
        "/client/payment/:path*", // Protège /client/payment et ses sous-routes
        "/client/login",
        "/client/register",
    ],
};
