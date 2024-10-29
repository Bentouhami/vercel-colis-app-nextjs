// path: src/app/api/v1/simulation/results/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {errorHandler} from "@/utils/handelErrors";
import {CreateParcelDto, SimulationWithIds,  SimulationStatus} from "@/utils/dtos";
import {simulationEnvoisSchema} from "@/utils/validationSchema";
import prisma from "@/utils/db";
import {verifyToken} from "@/utils/verifyToken";
import {findAgencyByName} from "@/services/backend-services/AgencyService";

/**
 * Route pour la simulation d'envoi
 * @method POST
 * @route /api/v1/simulations/results
 * @param request
 * @constructor
 */
export async function POST(request: NextRequest) {
    console.log("POST from path: src/app/api/v1/simulations/results/route.ts reached")

   if (request.method !== 'POST'){
       return errorHandler("Method not allowed", 404);
   }

    try {
        // Récupère le corps de la requête et valide les données
        const body = await request.json();
        if (!body) {
            return errorHandler("Invalid request body", 400);
        }


        const validated= simulationEnvoisSchema.safeParse(body);
        
        
        if (!validated.success) {
            console.log("validation not success ")

            return errorHandler(validated.error.errors[0].message, 400);
        }

        console.log("body : ", body)
        console.log("validated data : ", validated.data)

        //  destructuring de validated.data
        const {departureAgency, destinationAgency, packages} = validated.data;

        const departureAgencyId = await findAgencyByName(departureAgency);
        const destinationAgencyId = await findAgencyByName(destinationAgency);
        const colis = packages as CreateParcelDto[];

        console.log("departureAgencyId : ", departureAgencyId)
        console.log("destinationAgencyId : ", destinationAgencyId)
        console.log("colis : ", colis)
        if (!departureAgencyId || !destinationAgencyId || !colis) {
            return errorHandler("Simulation datas not found.", 404);
        }

        console.log("results route received, simulationData: ");


        // Récupère l'ID de l'utilisateur
        const userId = verifyToken(request)?.id;

        if (!userId) {
            return errorHandler("Not authorized", 401);
        }

        console.log("userId found: ", userId)


        // Préparer les données pour la création de la simulation
        const createSimulationData: SimulationWithIds = {
            departureAgencyId: departureAgencyId.id,
            destinationAgencyId: destinationAgencyId.id,
            userId: userId,
            destinataireId: 0,
            packages: colis,
            totalPrice: 0,
            status: SimulationStatus.DRAFT,
        };

        // Créer la simulation dans la base de données
        const newSimulation = await prisma.simulation.create({
            data: createSimulationData,
        });

        return NextResponse.json(newSimulation, {status: 201});
    } catch (error) {
        return errorHandler("Internal server error", 500);
    }
}
