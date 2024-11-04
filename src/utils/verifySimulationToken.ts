// verifyToken.ts
// vérification du token JWT
// src/app/utils/verifyToken.ts


import {NextRequest} from 'next/server';
import jwt from "jsonwebtoken";
import {CreatedSimulationResponseDto} from "@/utils/dtos";

export function verifySimulationToken(request: NextRequest): CreatedSimulationResponseDto | null {
    try {
        // Récupérer le token JWT
        const jwtToken = request.cookies.get(process.env.SIMULATION_COOKIE_NAME as string);
        const token = jwtToken?.value as string;

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
        const simulationPayload = jwt.verify(token, privateKey) as CreatedSimulationResponseDto;

        if (!simulationPayload) {
            console.error("Invalid simulation token");
            return null;
        }

        return simulationPayload;
    } catch (error) {
        // Gérer les erreurs JWT spécifiques
        if (error instanceof jwt.TokenExpiredError) {
            console.error("Token expired");
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.error("Invalid token");
        }
        return null;
    }
}

export function verifyTokenFromCookies(token: string): CreatedSimulationResponseDto | null {
    try {
        const privateKey = process.env.JWT_SECRET as string;
        return jwt.verify(token, privateKey) as CreatedSimulationResponseDto;
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