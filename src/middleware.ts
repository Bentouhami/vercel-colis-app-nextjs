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

        // Vérification du token JWT
        const cookieName = process.env.COOKIE_NAME || "auth";
        const jwtToken = req.cookies.get(cookieName);
        const token = jwtToken?.value;

        // Vérifier si l'utilisateur est authentifié
        const userPayload = token ? await verifyTokenWithJose(token) : null;
        const isAuthenticated = !!userPayload;

        // Gestion des routes d'authentification (login/register)
        if (req.nextUrl.pathname.startsWith('/client/login') ||
            req.nextUrl.pathname.startsWith('/client/register')) {
            if (isAuthenticated) {
                console.log('User already authenticated, redirecting to client home');
                return NextResponse.redirect(new URL('/client', req.nextUrl.origin));
            }
            return response;
        }

        // Gestion des routes publiques (après la vérification d'authentification)
        if (isPublicRoute(req.nextUrl.pathname)) {
            console.log("Public route accessed:", req.nextUrl.pathname);
            return response;
        }

        // À ce stade, la route n'est ni login/register ni publique
        // Vérification de l'authentification pour les routes protégées
        if (!isAuthenticated) {
            console.log('No valid token found, redirecting to login');
            return NextResponse.redirect(new URL("/client/login", req.nextUrl.origin));
        }

        if (!userPayload) {
            console.log('Invalid token found, redirecting to login');
            return NextResponse.redirect(new URL("/client/login", req.nextUrl.origin));
        }
        // Vérification des rôles pour les routes admin
        const userRoles = Array.isArray(userPayload.roles) ? userPayload.roles : [];
        const isAdmin = userRoles.includes('ADMIN');

        if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
            console.log('Unauthorized access to admin route');
            return NextResponse.redirect(new URL('/client/unauthorized', req.nextUrl.origin));
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
