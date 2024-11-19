// path: src/app/api/v1/simulations/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {
    BaseSimulationDto, EnvoiStatus,
    FullSimulationDto, SimulationDto,
    SimulationStatus,
} from "@/utils/dtos";
import {verifyToken} from "@/utils/verifyToken";
import {
    getSimulationByIdAndToken,
    saveSimulation,
    updateSimulationWithSenderAndDestinataireIds
} from "@/services/backend-services/simulationService";
import {setSimulationResponseCookie} from "@/utils/generateSimulationToken";
import {verifySimulationToken} from "@/utils/verifySimulationToken";

/**
 * POST request handler for the /simulations route
 * POST request to create a new simulation with the provided data
 * @param request - NextRequest object
 * @returns NextResponse object with JSON response
 */
export async function POST(request: NextRequest) {
    console.log("log ====> POST request received in simulations route path src/app/api/v1/simulations/route.ts");

    if (request.method !== 'POST') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    try {
        const BaseSimulationDto = await request.json() as BaseSimulationDto;

        if (!BaseSimulationDto) {
            return NextResponse.json({error: 'Invalid request'}, {status: 400});
        }


        console.log("log ====> BaseSimulationDto in POST request received in simulations route before saving path: src/app/api/v1/simulations/route.ts: ", BaseSimulationDto);

        const simulationIdAndVerificationToken = await saveSimulation(BaseSimulationDto);

        if (!simulationIdAndVerificationToken) {
            return NextResponse.json({error: 'Failed to create simulation'}, {status: 500});
        }

        console.log("log ====> simulationIdAndVerificationToken in POST request received in simulations route after saving path: src/app/api/v1/simulations/route.ts: ", simulationIdAndVerificationToken);

        const simulationCookie = setSimulationResponseCookie(simulationIdAndVerificationToken);

        if (!simulationCookie) {
            return NextResponse.json({error: 'Failed to create simulation'}, {status: 500});
        }

        const response = NextResponse.json(
            {message: "Simulation successfully created"},
            {status: 201}
        );

        console.log("log ====> simulationCookie in POST request received in simulations route after saving path: src/app/api/v1/simulations/route.ts: ", simulationCookie);

        response.headers.set('Set-Cookie', simulationCookie);

        console.log("log ====> response in POST request received in simulations route after saving path: src/app/api/v1/simulations/route.ts: ", response);

        return response;

    } catch (error) {
        return NextResponse.json({error: 'Failed to create simulation'}, {status: 500});
    }
}


export async function GET(request: NextRequest) {
    console.log("GET request received in simulations route");

    try {
        const simulationIdAndToken = verifySimulationToken(request);

        if (!simulationIdAndToken) {
            console.log("Aucun token ou ID de simulation valide.");
            return NextResponse.json({data: null}, {status: 200});
        }
        console.log("log ====> simulationIdAndToken in GET request received in simulations route after verifying token: ", simulationIdAndToken);

        const simulation = await getSimulationByIdAndToken(
            Number(simulationIdAndToken.id),
            simulationIdAndToken.verificationToken
        );

        if (!simulation) {
            console.log("Simulation introuvable.");
            return NextResponse.json({error: 'Simulation not found'}, {status: 404});
        }

        console.log("log ====> simulation in GET request received in simulations route after calling getSimulationByIdAndToken function with id and verificationToken: ", simulation);


        return NextResponse.json({data: simulation}, {status: 200});

    } catch (error) {
        console.error("Erreur lors de la récupération de la simulation:", error);
        return NextResponse.json({error: 'Erreur serveur, impossible de récupérer la simulation'}, {status: 500});
    }
}

/**
 * PUT request handler for the /simulations route
 * PUT request to update a simulation with the provided data
 * @param request
 * @constructor
 */
export async function PUT(request: NextRequest) {
    console.log("PUT request received with body:", request.body);

    try {
        const body = (await request.json()) as SimulationDto;
        console.log("Parsed body in PUT request:", body);

        if (!body) {
            console.error("Error: Missing required fields in the request body.");
            return NextResponse.json({error: 'Missing required fields'}, {status: 400});
        }


        if (!body.userId) {
            const userPayload = verifyToken(request);
            console.log("Payload from verifyToken:", userPayload);
            body.userId = !userPayload ? null : userPayload.id;
        }
        // get simulationIdAndToken from the body
        const simulationIdAndToken = verifySimulationToken(request);

        if (!simulationIdAndToken) {
            console.log("Aucun token ou ID de simulation valide.");
            return NextResponse.json({data: null}, {status: 200});
        }

        let simulationStatus: SimulationStatus = body.simulationStatus ||
            SimulationStatus.DRAFT;

        if (simulationStatus === SimulationStatus.DRAFT) {
            simulationStatus = SimulationStatus.CONFIRMED;
        }

        body.simulationStatus = simulationStatus;
        body.status = body.status || EnvoiStatus.PENDING;
        body.id = Number(simulationIdAndToken.id);
        if (!body.id) {
            console.error("Error: Simulation ID not found in request body.");
            return NextResponse.json({error: 'Simulation ID not found'}, {status: 400});
        }
       await updateSimulationWithSenderAndDestinataireIds(body);

        return NextResponse.json({message: "Simulation updated successfully"}, {status: 200});

    } catch (error) {
        console.error("Error in PUT route during simulation update:", error);
        return NextResponse.json({error: 'Internal server error in simulation update'}, {status: 500});
    }
}
