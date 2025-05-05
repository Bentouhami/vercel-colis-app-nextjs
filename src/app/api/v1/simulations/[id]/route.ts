// path: src/app/api/v1/simulations/[id]/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {getSimulationById, updateSimulationTransportId} from "@/services/backend-services/Bk_SimulationService";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    if (request.method !== 'GET') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    try {
        // Extract the dynamic route parameter `id`
        const id = Number(params.id);

        if (isNaN(id) || id <= 0) {
            return NextResponse.json({error: 'Invalid request'}, {status: 400});
        }

        // Get simulation by id
        const simulation = await getSimulationById(id);

        if (!simulation) {
            return NextResponse.json({error: 'Simulation not found'}, {status: 404});
        }

        return NextResponse.json({data: simulation}, {status: 200});
    } catch (error) {
        console.error("Error getting simulation:", error);
        return NextResponse.json({error: 'Failed to get simulation'}, {status: 500});
    }
}

// Update simulation with the suitable transport id
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;


    if (request.method !== "PUT") {
        return NextResponse.json({error: "Method not allowed"}, {status: 405});
    }
    try {
        // Extract the dynamic route parameter `id` for the simulation ID
        const simulationId = Number(params.id);

        // extract transport is from the request body
        const {transportId} = await request.json();


        if (!simulationId || !transportId) {
            return NextResponse.json({error: "Invalid request"}, {status: 400});
        }

        // Update the simulation with the suitable transport ID
        const updatedSimulation = await updateSimulationTransportId(simulationId, transportId);

        if (!updatedSimulation) {
            return NextResponse.json({error: "Failed to update simulation"}, {status: 500});
        }
        return NextResponse.json(
            {
                data: updatedSimulation,
                message: "Simulation transport id updated successfully"
            },
            {status: 200}
        );
    } catch (error) {
        console.error("Error updating simulation:", error);
        return NextResponse.json({error: "Failed to update simulation"}, {status: 500});
    }
}









