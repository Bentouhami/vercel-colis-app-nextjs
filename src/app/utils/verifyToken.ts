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

export function verifyTokenFromCookies(token: string): JWTPayload | null {
    try {
        // récupérer la clé secrète de l'environnement
        const privateKey = process.env.JWT_SECRET as string;

        // vérifier le token et extraire les informations de l'utilisateur
        const userPayload = jwt.verify(token, privateKey) as JWTPayload;

        // si l'utilisateur n'est pas authentifié, retournez null
        if(!userPayload) return null;

        // retournez le payload de l'utilisateur authentifié
        return userPayload;
    } catch (error) {
        return null;
    }
}
