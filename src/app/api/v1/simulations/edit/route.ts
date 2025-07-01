// path: src/app/api/v1/simulations/edit/route.ts
'use server';

import {NextRequest, NextResponse} from 'next/server';
import {UpdateEditedSimulationDto} from "@/services/dtos";
import {updateSimulationAndParcels} from "@/services/backend-services/Bk_SimulationService";
import {getToken} from "next-auth/jwt";

/**
 * PUT request handler for the /simulations route
 * PUT request to update a simulation with the provided data
 * @param request
 * @constructor
 */
export async function PUT(request: NextRequest) {
    if (request.method !== 'PUT') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    try {
        const body = (await request.json()) as UpdateEditedSimulationDto;

        if (!body) {
            console.error("Error: Missing required fields in the request body.");
            return NextResponse.json({error: 'Missing required fields'}, {status: 400});
        }

        // if no userId in body, get it from token
        if (!body.userId) {

            // Retrieve the connected user's token
            const token = await getToken({req: request, secret: process.env.AUTH_SECRET as string});

            if (!token) {
                body.userId = null;
            }

            // set the userId in the body to the connected user's ID or null if not found
            body.userId = Number(token?.id) || null;

        }
        await updateSimulationAndParcels(body);


        return NextResponse.json({message: "Simulation updated successfully"}, {status: 200});

    } catch (error) {
        console.error("Error in PUT route during simulation update:", error);
        return NextResponse.json({error: 'Internal server error in simulation update'}, {status: 500});
    }
}
