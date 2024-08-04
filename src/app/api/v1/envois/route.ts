import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from "@/app/utils/handelErrors";
import { SimulationEnvoisDto } from "@/app/utils/dtos";
import { simulationEnvoisSchema } from "@/app/utils/validationSchema";
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

        // console.log("before validation", body);

        const validated = simulationEnvoisSchema.safeParse(body);


        if (!validated.success) {
            return errorHandler(validated.error.errors[0].message, 400);
        }


        // Utiliser le service pour calculer les détails de l'envoi
        const envoiDetails = await calculateEnvoiDetails(body);


        return NextResponse.json(envoiDetails, { status: 200 });
    } catch (error) {
        return errorHandler("Internal server error", 500);
    }
}
