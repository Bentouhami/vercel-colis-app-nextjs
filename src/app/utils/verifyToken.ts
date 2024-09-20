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