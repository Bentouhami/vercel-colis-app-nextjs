// path: src/app/api/v1/simulations/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {BaseSimulationDto, FullSimulationDto, SimulationWithIds} from "@/utils/dtos";
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

    try {

        const body = await request.json() as SimulationWithIds;

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
        if (!body.userId) {
            const payload = await verifyToken(request);
            console.log("Payload from verifyToken:", payload);
            body.userId = !payload ? null : payload.id;
        }

        if (!body.destinataireId) {
            body.destinataireId = null;
        }

        console.log("clientId before setting in simulationData:", body.userId);
        console.log("clientId before setting in simulationData:", body.destinataireId);

        const simulationData: SimulationWithIds = {
            ...body
        };

        console.log("log ====> simulationData in POST request received in simulations route before saving path: src/app/api/v1/simulations/route.ts: ", simulationData);
        // Sauvegarder la simulation dans la base de données
        const simulationIdAndVerificationToken = await saveSimulation(simulationData);

        if (!simulationIdAndVerificationToken) {
            return NextResponse.json({error: 'Failed to create simulation'}, {status: 500});
        }

        console.log("log ====> simulationIdAndVerificationToken in POST request received in simulations route after saving path: src/app/api/v1/simulations/route.ts: ", simulationIdAndVerificationToken);

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
            return NextResponse.json({data: null}, { status: 200 });
        }

        const simulation = await getSimulationByIdAndToken(
            Number(simulationIdAndToken.id),
            simulationIdAndToken.verificationToken
        );

        if (!simulation) {
            console.log("Simulation introuvable.");
            return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
        }

        return NextResponse.json({ data: simulation }, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération de la simulation:", error);
        return NextResponse.json({ error: 'Erreur serveur, impossible de récupérer la simulation' }, { status: 500 });
    }
}


export async function PUT(request: NextRequest) {
    console.log("PUT request received with body:", request.body);

    try {
        const body = (await request.json()) as FullSimulationDto;
        console.log("Parsed body in PUT request:", body);

        if (!body) {
            console.error("Error: Missing required fields in the request body.");
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }


        if (!body.userId) {
            const userPayload = verifyToken(request);
            console.log("Payload from verifyToken:", userPayload);
            body.userId = !userPayload ? null : userPayload.id;

        }

        const updatedSimulation  = await updateSimulationWithSenderAndDestinataireIds(body);

        if (!updatedSimulation) {
            console.error("Error: Failed to update simulation - updateSimulationWithSenderAndDestinataireIds returned null.");
            return NextResponse.json({ error: 'Failed to update simulation' }, { status: 500 });
        }

        console.log("Updated simulation:", updatedSimulation);
        console.log("Updated parcels:", updatedSimulation.parcels);

        return NextResponse.json({ data: updatedSimulation }, { status: 200 });

    } catch (error) {
        console.error("Error in PUT route during simulation update:", error);
        return NextResponse.json({ error: 'Internal server error in simulation update' }, { status: 500 });
    }
}
