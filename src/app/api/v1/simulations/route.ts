// path: src/app/api/v1/simulations/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {BaseSimulationDto, SimulationWithIds, SimulationStatus, SimulationWithoutIds} from "@/utils/dtos";
import {simulationEnvoisSchema} from "@/utils/validationSchema";
import {verifyToken} from "@/utils/verifyToken";
import {saveSimulation} from "@/services/backend-services/simulationService";

export async function POST(request: NextRequest) {
    console.log("log ====> POST request received in simulations route");

    if (request.method !== 'POST') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }


    const body = await request.json() as SimulationWithoutIds;

    if (!body) {
        return NextResponse.json({error: 'Invalid request'}, {status: 400});
    }

    // Validation du payload
    // Vérifier que le payload est valide en fonction de la structure de la validationSchema
    // Si la validation échoue, retourner une erreur 400
    // Sinon, continuer avec le traitement de la requête
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

    if (!payload) {
        console.log("clientId not found in verifyToken function, setting it to null");

        clientId = null;
    } else {
        console.log("clientId found in verifyToken function, setting it to payload.id");
        clientId = payload.id;
        console.log("clientId in verifyToken function: ", clientId);
    }

    console.log("clientId before setting in simulationData:", clientId);

    const simulationData: SimulationWithIds = {
        userId: clientId, // ajoutée pour la CreateSimulationDto interface
        destinataireId: null, // ajoutée pour la CreateSimulationDto interface
       ...body, // représente SimulationWithoutIds pour le status en plus les (BaseSimulationDto, SimulationCalculationTotalsDto interfaces)
    };

    console.log("simulationData after setting userId:", simulationData.userId);

    console.log("simulationData in POST request received in simulations route: ", simulationData);

    try {
        // Sauvegarder la simulation dans la base de données
        const simulationId = await saveSimulation(simulationData);
        return NextResponse.json(simulationId);
    } catch (error) {
        return NextResponse.json({error: 'Failed to create simulation'}, {status: 500});
    }
}
