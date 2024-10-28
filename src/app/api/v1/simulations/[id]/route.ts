// GET /api/simulations/:id

import {NextRequest, NextResponse} from "next/server";
import {getSimulationById} from "@/services/backend-services/simulationService";
import {FullSimulationDto} from "@/utils/dtos";

interface Props {
    params: {
        id: string;
    }
}

export async function GET(req: NextRequest, {params}: Props) {
    try {
        // Récupérer l'ID de la simulation
        const simulationId = parseInt(params.id);   // Convertir la chaîne en entier

        // Récupérer les détails de la simulation
        const simulation : FullSimulationDto = await getSimulationById(simulationId);

        if (!simulation) {
            return NextResponse.json({error: 'Simulation not found'}, {status: 404});
        }

        return NextResponse.json(simulation);
    } catch (error) {
        console.error("Error getting simulation:", error);
        return NextResponse.json({error: 'Failed to get simulation'}, {status: 500});
    }

}
