// path: src/app/api/v1/simulations/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSimulationById } from "@/services/backend-services/Bk_SimulationService";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    console.log("GET request received in simulations/[id] route");

    try {
        // Extract the dynamic route parameter `id`
        const id = Number(params.id);

        if (isNaN(id) || id <= 0) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        // Get simulation by id
        const simulation = await getSimulationById(id);

        if (!simulation) {
            return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
        }

        return NextResponse.json({ data: simulation }, { status: 200 });
    } catch (error) {
        console.error("Error getting simulation:", error);
        return NextResponse.json({ error: 'Failed to get simulation' }, { status: 500 });
    }
}








