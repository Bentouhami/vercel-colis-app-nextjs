// path: src/app/api/v1/simulations/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {BaseSimulationDto, FullSimulationDto, SimulationWithIds, SimulationWithoutIds} from "@/utils/dtos";
import {simulationEnvoisSchema} from "@/utils/validationSchema";
import {verifyToken} from "@/utils/verifyToken";
import {
    getSimulationByIdAndToken,
    saveSimulation,
    updateSimulationWithSenderAndDestinataireIds
} from "@/services/backend-services/simulationService";
import {setSimulationResponseCookie} from "@/utils/generateSimulationToken";
import {verifySimulationToken} from "@/utils/verifySimulationToken";

export async function POST(request: NextRequest) {
    console.log("log ====> POST request received in simulations route");

    if (request.method !== 'POST') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }


    const body = await request.json() as SimulationWithoutIds;

    if (!body) {
        return NextResponse.json({error: 'Invalid request'}, {status: 400});
    }

    console.log("log ====> body in POST request received in simulations route: ", body);

    // Récupérer que les champs nécessaires pour la validation
    const simulationToValidate = {
        departureCountry: body.departureCountry,
        departureCity: body.departureCity,
        departureAgency: body.departureAgency,
        destinationCountry: body.destinationCountry,
        destinationCity: body.destinationCity,
        destinationAgency: body.destinationAgency,
        parcels: body.parcels,
    } as BaseSimulationDto;
    const validationResult = simulationEnvoisSchema.safeParse(simulationToValidate);

    // log validation

    if (!validationResult.success) {
        return NextResponse.json({error: 'Invalid request'}, {status: 400});
    }
    console.log("log ====> validationResult in POST request received in simulations route: ", validationResult);


    let clientId;
    const payload = await verifyToken(request);
    console.log("Payload from verifyToken:", payload);

    clientId = !payload ? null : payload.id;

    console.log("clientId before setting in simulationData:", clientId);

    const simulationData: SimulationWithIds = {
        userId: clientId,
        destinataireId: null,
        ...body,
    };

    console.log("simulationData in POST request received in simulations route: ", simulationData);

    try {
        // Sauvegarder la simulation dans la base de données
        const simulationIdAndVerificationToken = await saveSimulation(simulationData);
        if (!simulationIdAndVerificationToken) {
            return NextResponse.json({error: 'Failed to create simulation'}, {status: 500});
        }

        // Générer le cookie JWT
        const simulationCookie = setSimulationResponseCookie(simulationIdAndVerificationToken);

        if (!simulationCookie) {
            return NextResponse.json({error: 'Failed to create simulation'}, {status: 500});
        }

        // Créer la réponse et attacher le cookie sans renvoyer de données sensibles
        const response = NextResponse.json(
            {message: "Simulation successfully created"}, // Message sans données sensibles
            {status: 201}
        );

        response.headers.set('Set-Cookie', simulationCookie);

        return response;
    } catch (error) {
        return NextResponse.json({error: 'Failed to create simulation'}, {status: 500});
    }
}

export async function GET(request: NextRequest) {

    // log 
    console.log("log ====> GET request received in simulations route in path: src/app/api/simulations/simulations.ts");

    if (request.method !== 'GET') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    try {
        const simulationIdAndToken = verifySimulationToken(request);

        if (!simulationIdAndToken) {
            return NextResponse.json({error: 'Failed to get simulation'}, {status: 500});
        }

        console.log("log ====> simulationIdAndToken in GET request received in simulations route: ", simulationIdAndToken);

        // Récupérer les détails de la simulation
        const simulation: FullSimulationDto | null = await getSimulationByIdAndToken(Number(simulationIdAndToken.id), simulationIdAndToken.verificationToken);

        if (!simulation) {
            return NextResponse.json({error: 'Simulation not found'}, {status: 404});
        }

        console.log("log ====> simulation found in GET request received in simulations route in path: src/app/api/simulations/route.ts: ", simulation);

        console.log("Returning simulation data...");
        return NextResponse.json({data: simulation}, {status: 200});

    } catch (error) {
        console.error("Error getting simulation:", error);
        return NextResponse.json({error: 'Failed to get simulation'}, {status: 500});
    }
}

export async function PUT(request: NextRequest) {

    console.log("log ====> PUT function called in path: src/app/api/simulations/route.ts");

    if (request.method !== 'PUT') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    try {
        const body = (await request.json()) as FullSimulationDto;


        console.log("log ====> body in PUT request received in simulations route: ", body);

        if (!body) {
            return NextResponse.json({error: 'Missing required fields'}, {status: 400});
        }

        let sender = body.userId;

        if (!sender) {
            const userId = verifyToken(request);

            if (!userId) {
                return NextResponse.json({error: 'Unauthorized'}, {status: 401});
            }

            body.userId = userId;
        }

        if (sender && sender === body.destinataireId) {
            return NextResponse.json({error: 'You can not send to yourself'}, {status: 400});
        }


        const updatedSimulation = await updateSimulationWithSenderAndDestinataireIds(body);

        if (!updatedSimulation) {
            return NextResponse.json({error: 'Failed to update simulation'}, {status: 500});
        }

        return NextResponse.json({data: updatedSimulation, message: 'Simulation updated successfully'}, {status: 200});

    } catch (error) {
        return NextResponse.json({error: 'Failed to update simulation'}, {status: 500});
    }

}