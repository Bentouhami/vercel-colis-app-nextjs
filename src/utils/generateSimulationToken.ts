// src/utils/generateSimulationToken.ts

import jwt from "jsonwebtoken";
import {serialize} from "cookie";
import {CreatedSimulationResponseDto} from "@/services/dtos";

/**
 * Generate a JWT token
 * @returns {string} token
 *
 * @param simulationResponseData
 */
export function generateJwt(simulationResponseData: CreatedSimulationResponseDto): string {
    const privateKey = process.env.JWT_SECRET as string;

    // return token
    return jwt.sign(
        simulationResponseData,
        privateKey,
        {
            expiresIn: "2h"
        });
}

/**
 * Set cookies with JWT
 * @returns {string}
 * @param simulationResponseData
 */
export function setSimulationResponseCookie(simulationResponseData: CreatedSimulationResponseDto): string {
    const cookieName = process.env.SIMULATION_COOKIE_NAME;
    if (!cookieName) {
        throw new Error("SIMULATION_COOKIE_NAME environment variable is not set");
    }

    const token = generateJwt(simulationResponseData);
    return serialize(cookieName, token,  // nom du cookie
        {
            httpOnly: true,  // cookie non accessible par le client
            secure: process.env.NODE_ENV === "production",  // cookie uniquement en HTTP pour le développement ou en HTTPS pour la production
            sameSite: 'lax', // pour les sous domaines (ex: www.example.com)
            path: '/',  // cookie utilisé uniquement sur le domaine courant
            maxAge: 60 * 60 * 2, // 2 heures en secondes
        });
}
