// path: src/lib/simulationCookie.ts
'use server'

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { CreatedSimulationResponseDto } from "@/services/dtos";

export async function getSimulationFromCookie() : Promise<CreatedSimulationResponseDto | null> {
    try {
        const cookieName = process.env.SIMULATION_COOKIE_NAME;
        if (!cookieName) return null;

        const cookieStore = await cookies();
        const simulationCookie = cookieStore.get(cookieName);

        if (!simulationCookie) {
            return null;
        }

        const privateKey = process.env.JWT_SECRET;
        if (!privateKey) return null;

        return jwt.verify(simulationCookie.value, privateKey) as CreatedSimulationResponseDto;
    } catch (error) {
        return null;
    }
}

