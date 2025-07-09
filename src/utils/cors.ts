// Path: utils/cors.ts
const PRODUCTION_ORIGIN = "https://vercel-colis-app-nextjs.vercel.app";
const DEVELOPMENT_ORIGIN = "http://localhost:3000";

export function setCorsHeaders(origin: string): HeadersInit | undefined {
  // Liste dynamique des origines autorisées
  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? [
          PRODUCTION_ORIGIN,
          ...(process.env.VERCEL_URL
            ? [`https://${process.env.VERCEL_URL}`]
            : []),
          ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
            : []),
        ]
      : [DEVELOPMENT_ORIGIN];

  // Vérification si l'origine est autorisée
  if (!allowedOrigins.includes(origin)) {
    return undefined; // Origine non autorisée
  }

  // En-têtes CORS configurés
  return {
    "Access-Control-Allow-Origin": origin, // Origine autorisée
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS", // Méthodes autorisées
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // En-têtes autorisés
    "Access-Control-Allow-Credentials": "true", // Autorise les cookies et credentials
  };
}
