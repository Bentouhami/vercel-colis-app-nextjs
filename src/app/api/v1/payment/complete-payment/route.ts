// Path: src/app/api/v1/payment/complete-payment/route.ts
import {NextRequest, NextResponse} from "next/server";
import {completePaymentService} from "@/services/frontend-services/payment/paymentService";
import {
    getSimulationByIdAndToken, updateSimulation,
    updateSimulationWithSenderAndDestinataireIds
} from "@/services/backend-services/simulationService";
import {EnvoiStatus, SimulationStatus} from "@/utils/dtos";
import {verifySimulationToken} from "@/utils/verifySimulationToken";

export async function GET(req: NextRequest) {

    try {

        // 1. Retrieve Simulation Data from Cookie
        const simulationFromCookie = await verifySimulationToken(req);


        if (!simulationFromCookie) {
            console.log("Aucun simulation trouvée dans le cookie");

            return NextResponse.json({data: null}, {status: 200});
        }

        let simulation = await getSimulationByIdAndToken(
            Number(simulationFromCookie.id),
            simulationFromCookie.verificationToken);


        if (!simulation) {
            console.log("Simulation introuvable.");
            return NextResponse.json({data: null}, {status: 200});
        }
        // 2. Update Simulation Status to COMPLETED
        simulation = simulation.simulationStatus === SimulationStatus.CONFIRMED ? {
            ...simulation,
            simulationStatus: SimulationStatus.COMPLETED,
            status: EnvoiStatus.PENDING
        } : simulation;

        if (!simulation) {
            console.log("Simulation introuvable.");
            return NextResponse.json({data: null}, {status: 200});
        }

        console.log("log ====> simulation before updateSimulationWithSenderAndDestinataireIds function called in src/app/api/v1/payment/complete-payment/route.ts: ", simulation);


        // Update Simulation envoi status and simulationStatus
        await updateSimulation(simulation, simulationFromCookie);


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