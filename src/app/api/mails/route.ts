// path: src/lib/mailer

import { sendMail } from "@/utils/mail.utils";

export async function POST() {
    const sender = {
        name: "Coli",
        address: "coli@colisapp.com"
    };

    const recipients = [
        {
            name: "Colis Reception",
            address: "coli.reception@colisapp.com"
        }
    ];

    const subject = "Test Mail";
    const message = "This is a test mail";

    try {
        await sendMail({
            sender,
            recipients,
            subject,
            message
        });
        return new Response(
            JSON.stringify({
                message: "Mail sent successfully",
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Error sending mail",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}
