// api/v1/simulation/results/route.ts : Route de simulation d'envoi

import {NextRequest, NextResponse} from 'next/server';
import {errorHandler} from "@/utils/handelErrors";
import {SimulationEnvoisDto} from "@/utils/dtos";
import {simulationEnvoisSchema} from "@/utils/validationSchema";
import {calculateEnvoiDetails} from "@/services/envois/SimulationEnvoisService";

/**
 * Route pour la simulation d'envoi
 * @method POST
 * @route /api/v1/envois
 * @param request
 * @constructor
 */
export async function POST(request: NextRequest) {
    try {
        // Récupère le corps de la requête et valide les données
        const body = await request.json() as SimulationEnvoisDto;
        if(!body){
            return errorHandler("Invalid request body", 400);
        }
        // console.log("before validation", body); // DEBUG

        const validated = simulationEnvoisSchema.safeParse(body);


        if (!validated.success) {
            return errorHandler(validated.error.errors[0].message, 400);
        }

        console.log("Validated data:", validated.data);
        const envoiDetails = await calculateEnvoiDetails(validated.data);

        // Utiliser le service pour calculer les détails de l'envoi
        // const envoiDetails = await calculateEnvoiDetails(body);


        return NextResponse.json(envoiDetails, { status: 200 });
    } catch (error) {
        return errorHandler("Internal server error", 500);
    }
}
