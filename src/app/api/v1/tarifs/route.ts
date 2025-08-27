//path: src/app/api/v1/tarifs/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {findTarifs} from "@/services/backend-services/Bk_TarifService";
import { TarifsDto } from "@/services/dtos/tarifs/TarifDto"; // Import DTO

/**
 * Get tarifs
 * @description Retrieves the pricing tariffs.
 * @response 200:TarifsDto[]:List of tarifs
 * @response 404:{ error: string }:Tarifs not found or invalid format
 * @response 405:{ error: string }:Method not allowed
 * @response 500:{ error: string }:Failed to get tarifs
 * @openapi
 */
export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    try {
        // Get tarifs from the backend
        const tarifs = await findTarifs();

        if (!tarifs) {
            return NextResponse.json({error: 'Tarifs not found or invalid format'}, {status: 404});
        }

        return NextResponse.json(tarifs, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Failed to get tarifs'}, {status: 500});
    }
}

