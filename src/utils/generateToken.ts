// /src/app/utils/generateToken.ts : génération de jeton

import jwt from "jsonwebtoken";
import {JWTPayload} from "@/utils/types";
import {serialize} from "cookie";
import {randomBytes} from "crypto";

/**
 * Generate a JWT token
 * @param jwtPayload
 * @returns {string} token
 *
 */
export function generateJwt(jwtPayload: JWTPayload) {
    const privateKey = process.env.JWT_SECRET as string;

    // return token
    return jwt.sign(
        jwtPayload,
        privateKey,
        {
            expiresIn: "2h"
        });
}

/**
 * Set cookies with JWT
 * @param jwtPayload
 * @returns {string}
 */
export function setCookie(jwtPayload: JWTPayload): string {
    const cookieName = process.env.COOKIE_NAME;
    if (!cookieName) {
        throw new Error("COOKIE_NAME environment variable is not set");
    }

    const token = generateJwt(jwtPayload);
    return serialize(cookieName, token,  // nom du cookie
        {
            httpOnly: true,  // cookie non accessible par le client
            secure: process.env.NODE_ENV === "production",  // cookie uniquement en HTTP pour le développement ou en HTTPS pour la production
            sameSite: 'strict', // pour les sous domaines (ex: www.example.com)
            path: '/',  // cookie utilisé uniquement sur le domaine courant
            maxAge: 60 * 60 * 2 // 2 heures en secondes
        });
}


export  function generateVerificationTokenForUser() {

    // Générer un token de vérification de l'email
    // Générer un token de vérification
    const verificationToken = randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 15); // Expiration en 15 minutes

    return {
        verificationToken,
        verificationTokenExpires
    };
}