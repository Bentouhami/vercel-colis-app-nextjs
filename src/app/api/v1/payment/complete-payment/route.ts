// Path: src/app/api/v1/payment/complete-payment/route.ts
import {NextResponse} from "next/server";
import {completePaymentService} from "@/services/frontend-services/payment/paymentService";
import {
    getSimulationByIdAndToken,
    updateSimulationWithSenderAndDestinataireIds
} from "@/services/backend-services/simulationService";
import {SimulationStatus} from "@/utils/dtos";
import {verifyTokenFromCookies} from "@/utils/verifySimulationToken";
import {getSimulation} from "@/services/frontend-services/simulation/SimulationService";

export async function GET(req: Request) {

    try {

        // 1. Retrieve Simulation Data from Cookie
        let simulationFromCookie = await getSimulation();

        if (!simulationFromCookie) {
            console.log("Aucun simulation trouvée dans le cookie");

            return NextResponse.json({data: null}, {status: 200});
        }

        // 2. Update Simulation Status to COMPLETED

        if (!simulationFromCookie) {
            console.log("Simulation introuvable.");
            return NextResponse.json({data: null}, {status: 200});
        }
        simulationFromCookie = simulationFromCookie.status === SimulationStatus.CONFIRMED ? {
            ...simulationFromCookie,
            status: SimulationStatus.COMPLETED
        } : simulationFromCookie;

        if (!simulationFromCookie) {
            console.log("Simulation introuvable.");
            return NextResponse.json({data: null}, {status: 200});
        }

        // Update Simulation Data in Cookie
        await updateSimulationWithSenderAndDestinataireIds(simulationFromCookie);


        // 5. Create Envoi Record in Database
        // 5. Add Parcels to parcels Table Using Envoi ID
        // 6. Update Transport’s Weight and Volume Based on New Envoi
        // 7. Create Notification for User and Agency
        // 8. Update User Profile with Agency ID or Additional Details
        // 9. Delete Simulation Cookie


        await completePaymentService();
        return NextResponse.json({message: "Payment completed successfully"});
    } catch (error) {
        console.error("Erreur lors de la création de la session Stripe:", error);
        return new NextResponse('Erreur de paiement', {status: 500});
    }
}