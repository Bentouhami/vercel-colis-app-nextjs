// utils/cors.ts

export function setCorsHeaders(origin: string): HeadersInit | undefined {
    const allowedOrigins = [
        'http://localhost:3000',
        'https://vercel-colis-app-nextjs.vercel.app',
    ];

    // Si l'origine n'est pas autorisée, renvoie `undefined`
    if (!allowedOrigins.includes(origin)) {
        return undefined;
    }

    // Sinon, retourne les en-têtes CORS nécessaires
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}
