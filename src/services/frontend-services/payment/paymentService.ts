// Path: src/services/frontend-services/payment/paymentService.ts
import {API_DOMAIN} from "@/utils/constants";

export async function completePaymentService() {

    console.log("log ====> paymentService function called in src/services/frontend-services/payment/paymentService.ts");

    try {
        const response = await fetch(`${API_DOMAIN}/payment/complete-payment`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                cache: "no-cache",
                pragma: "no-cache",
            },
            credentials: "include",
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
