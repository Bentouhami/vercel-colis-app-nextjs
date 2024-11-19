// Path: src/app/api/v1/envois/cancel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cancelSimulation } from "@/services/backend-services/envoiService";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { envoiId } = body;

        // Validation des données
        if (!envoiId || typeof envoiId !== "number") {
            return NextResponse.json(
                { error: "Paramètre 'envoiId' invalide ou manquant." },
                { status: 400 }
            );
        }

        // Annuler la simulation
        await cancelSimulation(envoiId);

        return NextResponse.json(
            { message: `Simulation ${envoiId} annulée avec succès.` },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Erreur lors de l'annulation de la simulation :", error);

        // Gestion des erreurs spécifiques
        if (error.message.includes("introuvable")) {
            return NextResponse.json(
                { error: error.message },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: "Erreur lors de l'annulation de la simulation." },
            { status: 500 }
        );
    }
}
