//path: src/app/api/v1/tarifs/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {findTarifs} from "@/services/backend-services/Bk_TarifService";

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

