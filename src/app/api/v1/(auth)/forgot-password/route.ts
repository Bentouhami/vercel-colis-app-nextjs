// src\app\api\auth\forgot-password\route.ts

import { NextResponse } from "next/server"
import {sendResetPasswordEmail} from "@/services/backend-services/Bk_AuthService";
import { ForgotPasswordDto } from "@/services/dtos/auth/authDtos"; // Import ForgotPasswordDto

/**
 * Request password reset
 * @description Sends a password reset email to the provided email address.
 * @body ForgotPasswordDto
 * @response 200:{ message: string }:Confirmation message
 * @response 400:{ message: string }:Invalid email
 * @response 500:{ message: string }:Server error
 * @openapi
 */
export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email || typeof email !== "string") {
            return NextResponse.json({ message: "Email invalide." }, { status: 400 })
        }

        // Appel backend-service
        await sendResetPasswordEmail(email)

        // Toujours renvoyer un message neutre pour la sécurité
        return NextResponse.json({
            message: "Si l’adresse existe, un lien de réinitialisation a été envoyé.",
        })
    } catch (error: any) {
        console.error("Erreur API forgot-password:", error)
        return NextResponse.json(
            { message: "Erreur serveur." },
            { status: 500 }
        )
    }
}
