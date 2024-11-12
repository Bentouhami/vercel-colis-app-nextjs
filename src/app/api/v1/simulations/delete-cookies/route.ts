import {NextResponse} from "next/server";
import {errorHandler} from "@/utils/handelErrors";
import {cookies} from "next/headers";

export async function GET() {
    try {
        // Supprimer les cookies de simulation

        cookies().delete("simulationResponse");

        // Créer la réponse avec le message de succès
        const response = NextResponse.json(
            {message: "Cookies deleted"},
            {status: 200}
        );

        // Ajouter les en-têtes CORS pour autoriser les requêtes cross origin
        response.headers.set('Access-Control-Allow-Origin', '*'); // Remplace '*' par ton domaine en production
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return response;
    } catch (error) {
        return errorHandler("Internal server error", 500);
    }
}