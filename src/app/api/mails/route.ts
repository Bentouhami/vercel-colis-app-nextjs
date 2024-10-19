// path: src/lib/mailer

import {sendMail} from "@/utils/mail.utils";

export async function POST(){
    const sender = {
        name: "Coli",
        address: "coli@colisapp.com"
    }

    const recipients = [
        {
            name: "Colis Reception",
            address: "coli.reception@colisapp.com"
        }
    ]

    const subject = "Test Mail"
    const message = "This is a test mail"

   try{
        await sendMail({
            sender,
            recipients,
            subject,
            message
        })
        return {
            status: 200,
            message: "Mail sent successfully"
        }
    } catch (error) {
        return {
            status: 500,
            message: "Error sending mail"
        }
    }
}