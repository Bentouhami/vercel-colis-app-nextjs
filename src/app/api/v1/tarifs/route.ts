//path: src/app/api/v1/tarifs/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {findTarifs} from "@/services/backend-services/TarifService";

export async function GET(req: NextRequest) {
    console.log("log ====> GET request received in tarifs route");

    if (req.method !== 'GET') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    try {
        const tarifs = await findTarifs();

        // Vérifiez si `tarifs` correspond bien à `TarifsDto`
        if (!tarifs || typeof tarifs !== 'object' || !('weightRate' in tarifs) || !('volumeRate' in tarifs)) {
            console.log("tarifs not found or incorrect structure");
            return NextResponse.json({error: 'Tarifs not found or invalid format'}, {status: 404});
        }

        console.log("tarifs found", tarifs);
        
        return NextResponse.json({tarifs}, {status: 200});
        // Convertissez les Decimals en nombres
    } catch (error) {
        console.error('Error getting tarifs:', error);
        return NextResponse.json({error: 'Failed to get tarifs'}, {status: 500});
    }
}
