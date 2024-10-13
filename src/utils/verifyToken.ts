// verifyToken.ts
// vérification du token JWT
// src/app/utils/verifyToken.ts


import {NextRequest} from 'next/server';
import {JWTPayload} from './types';
import jwt from "jsonwebtoken";

export function verifyToken(request: NextRequest): JWTPayload | null {
    try {
        // Récupérer le token JWT
        const jwtToken = request.cookies.get(process.env.COOKIE_NAME as string);
        const token = jwtToken?.value as string;

        console.log("Token from cookie:", token);

        if (!token) {
            console.log("No token found in cookies");
            return null;
        }

        // Clé secrète utilisée pour vérifier le token
        const privateKey = process.env.JWT_SECRET as string;

        if (!privateKey) {
            console.error("JWT_SECRET is not defined");
            return null;
        }

        // Vérification du token
        const userPayload = jwt.verify(token, privateKey) as JWTPayload;
        console.log("Verified token payload:", userPayload);

        return userPayload;
    } catch (error) {
        console.error("Error verifying token:", error);

        // Gérer les erreurs JWT spécifiques
        if (error instanceof jwt.TokenExpiredError) {
            console.error("Token expired");
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.error("Invalid token");
        }
        return null;
    }
}

export function verifyTokenFromCookies(token: string): JWTPayload | null {
    try {
        const privateKey = process.env.JWT_SECRET as string;
        return jwt.verify(token, privateKey) as JWTPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.error("Token expired");
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.error("Invalid token");
        } else {
            console.error("Error verifying token", error);
        }
        return null;
    }
}