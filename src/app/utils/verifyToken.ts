// verifyToken.ts
// vérification du token JWT
// src/app/utils/verifyToken.ts

import {NextRequest} from 'next/server';
import {JWTPayload} from './types';
import jwt from "jsonwebtoken";

export function verifyToken(request: NextRequest): JWTPayload | null {
    try {
        // récupérer le token JWT
        const jwtToken = request.cookies.get(process.env.COOKIE_NAME as string);
        // récupérer la valeur du token JWT
        const token = jwtToken?.value as string;
        if (!token) return null;

        const privetKey = process.env.JWT_SECRET as string;
        const userPayload = jwt.verify(token, privetKey) as JWTPayload;

        return userPayload;
    } catch (error) {
        return null;
    }
}

export function verifyTokenFromCookies(): string | null {
    // Accéder au cookie auth via le document.cookie (ou utiliser une librairie comme js-cookie)
    const cookieString = document.cookie;

    // Recherche du cookie d'authentification (auth)
    const authCookie = cookieString.split('; ').find(row => row.startsWith('auth='));

    // Si le cookie existe, extraire le token
    if (authCookie) {
        const token = authCookie.split('=')[1];
        return token || null;
    }

    // Retourner null si pas de cookie trouvé
    return null;
}
