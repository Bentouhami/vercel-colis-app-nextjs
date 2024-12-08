// path : src/services/frontend-services/contact/ContactService.ts

import {DOMAIN} from "@/utils/constants";

import {MessageBodyDto} from "@/services/dtos/emails/EmailDto";

export async function sendContactEmail(messageBody: MessageBodyDto): Promise<number> {

    console.log("log ====> sendContactEmail function called in path: src/services/frontend-services/contact/ContactService.ts with messageBody: ", messageBody);

    try {
        const response = await fetch(`${DOMAIN}/api/v1/contact`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messageBody),
        });

        if (!response.ok) {
            throw new Error("can't send contact email");
        }

        return response.status;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
