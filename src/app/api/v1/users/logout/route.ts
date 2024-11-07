// path : /api/v1/users/logout/route.ts
// logout route.ts : route pour la déconnexion d'un utilisateur

import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {errorHandler} from '@/utils/handelErrors';

// Fonction pour gérer la déconnexion (GET request)
export async function GET(request: NextRequest) {
    try {
        // Supprimer le cookie d'authentification
        cookies().delete("auth");
        cookies().delete("simulationResponse");

        // Créer la réponse avec le message de succès
        const response = NextResponse.json(
            {message: "Logged out"},
            {status: 200}
        );

        // Ajouter les en-têtes CORS pour autoriser les requêtes cross-origin
        response.headers.set('Access-Control-Allow-Origin', '*'); // Remplace '*' par ton domaine en production
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return response;
    } catch (error) {
        return errorHandler("Internal server error", 500);
    }
}

// Fonction pour gérer la requête OPTIONS (pré-vol)
export async function OPTIONS() {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*'); // Remplace '*' par ton domaine en production
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new NextResponse(null, {headers, status: 204}); // 204 = No Content
}