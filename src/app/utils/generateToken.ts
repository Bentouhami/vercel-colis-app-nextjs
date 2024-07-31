import jwt from "jsonwebtoken";
import { JWTPayload } from "@/app/utils/types";
import { serialize } from "cookie";

/**
 * Generate a JWT token
 * @param jwtPayload
 * @returns {string} token
 *
 */
export function generateJwt(jwtPayload: JWTPayload) {
    const privateKey = process.env.JWT_SECRET as string;
    const token = jwt.sign(
        jwtPayload,
        privateKey,
        {
            expiresIn: "30d"
        });
    return token;
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
    const cookie = serialize(cookieName, token,  // nom du cookie
        {
            httpOnly: true,  // cookie non accessible par le client
            secure: process.env.NODE_ENV === "production",  // cookie uniquement en HTTP pour le développement ou en HTTPS pour la production
            sameSite: 'strict',
            path: '/',  // cookie utilisé uniquement sur le domaine courant
            maxAge: 60 * 60 * 24 * 30,  // cookie valide pendant 30 jours
        });
    return cookie;
}
