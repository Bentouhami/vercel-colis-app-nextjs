// middleware.ts
// middleware pour vérifier si le token est valide avant d'accéder à une route
// path : /middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {

    const jwtToken = request.cookies.get("process.env.COOKIE_NAME");
    const token = jwtToken?.value as string;

    if (!token) {
        if (request.nextUrl.pathname.startsWith("/api/users/profile/")) {
            return NextResponse.json(
                { message: 'no token provided, access denied' },
                { status: 401 } // Unauthorized
            );
        }
    } else {
        if (
            request.nextUrl.pathname === "/login" ||
            request.nextUrl.pathname === "/register"
        ) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }
}

// Configurer les routes où le middleware doit être appliqué
export const config = {
    matcher: ["/api/users/profile/:path*", "/login", "/register"]
};
