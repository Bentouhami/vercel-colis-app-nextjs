// Path: src/services/frontend-services/payment/paymentService.ts
import {DOMAIN} from "@/utils/constants";

export async function completePaymentService() {

    console.log("log ====> paymentService function called in src/services/frontend-services/payment/paymentService.ts");


    try {
        const response = await fetch(`${DOMAIN}/api/v1/payment/complete-payment`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to complete payment");
        }
        return response.json();
    } catch (error) {
        console.error("Erreur lors de la création de la session Stripe:", error);
        throw error;
    }
}