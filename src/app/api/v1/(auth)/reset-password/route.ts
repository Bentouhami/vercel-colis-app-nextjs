// Esrc\app\api\auth\reset-password\route.ts

import { NextResponse } from "next/server"
import {resetPassword} from "@/services/backend-services/Bk_AuthService";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { token, password } = body

        if (!token || typeof token !== "string" || !password || typeof password !== "string") {
            return NextResponse.json(
                { success: false, message: "Token ou mot de passe invalide." },
                { status: 400 }
            )
        }

        await resetPassword(token, password)

        return NextResponse.json({
            success: true,
            message: "Mot de passe mis à jour avec succès.",
        })
    } catch (error: any) {
        console.error("Erreur API reset-password:", error)
        return NextResponse.json(
            { success: false, message: error.message || "Erreur interne." },
            { status: 400 }
        )
    }
}
