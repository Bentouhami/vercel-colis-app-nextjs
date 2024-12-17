// Path: src/app/api/v1/payment/complete-payment/route.ts
import {NextRequest, NextResponse} from "next/server";
import {completePaymentService} from "@/services/frontend-services/payment/paymentService";
import {getSimulationById, updatePaidEnvoi} from "@/services/backend-services/Bk_SimulationService";
import {verifySimulationToken} from "@/utils/verifySimulationToken";
import {SimulationStatus, EnvoiStatus} from "@/services/dtos";

export async function GET(req: NextRequest) {

    try {

        // 1. Retrieve Simulation Data from Cookie
        const simulationFromCookie = verifySimulationToken(req);


        if (!simulationFromCookie) {
            console.log("Aucun simulation trouvée dans le cookie");

            return NextResponse.json({data: null}, {status: 200});
        }

        let simulation = await getSimulationById(
            Number(simulationFromCookie.id));


        if (!simulation) {
            console.log("Simulation introuvable.");
            return NextResponse.json({data: null}, {status: 200});
        }
        // 2. Update Simulation Status to COMPLETED and STATUS to PENDING and PAID to TRUE
        simulation = simulation.simulationStatus === SimulationStatus.CONFIRMED ? {
            ...simulation,
            simulationStatus: SimulationStatus.COMPLETED,
            envoiStatus: EnvoiStatus.PENDING
        } : simulation;

        if (!simulation) {
            console.log("Simulation introuvable.");
            return NextResponse.json({data: null}, {status: 200});
        }

        console.log("log ====> simulation before updateSimulationWithSenderAndDestinataireIds function called in src/app/api/v1/payment/complete-payment/route.ts: ", simulation);


        // Update Simulation envoi status and simulationStatus
        await updatePaidEnvoi(simulation, simulationFromCookie);



        await completePaymentService();
        return NextResponse.json({message: "Payment completed successfully"});
    } catch (error) {
        console.error("Erreur lors de la création de la session Stripe:", error);
        return new NextResponse('Erreur de paiement', {status: 500});
    }
}