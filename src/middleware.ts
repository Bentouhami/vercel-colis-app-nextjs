// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// Middleware pour vérifier si le token est présent avant d'accéder à une route protégée
export function middleware(request: NextRequest) {
    const cookieName = process.env.COOKIE_NAME || "auth";
    const jwtToken = request.cookies.get(cookieName);
    const token = jwtToken?.value;

    // Vérification basique : si aucun token n'est trouvé
    if (!token) {
        if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Laisser passer si un token est trouvé (sans vérifier la validité ici)
    return NextResponse.next();
}

// Configurer les routes où le middleware doit être appliqué
export const config = {
    matcher: [
        "/api/users/profile/:path*",  // Protection des routes profil utilisateur
        // "/simulation/results/:path*", // Protéger l'accès aux résultats de simulation
        "/payment/:path*",        // Protéger l'accès au paiement
    ],
};
