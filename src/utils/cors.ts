// Path: utils/cors.ts

const PRODUCTION_ORIGIN = 'https://vercel-colis-app-nextjs.vercel.app';
const DEVELOPMENT_ORIGIN = 'http://localhost:3000';

export function setCorsHeaders(origin: string | null): HeadersInit | undefined {
    // Define allowed origins based on the environment
    const allowedOrigins =
        process.env.NODE_ENV === 'production'
            ? [PRODUCTION_ORIGIN]
            : [DEVELOPMENT_ORIGIN];

    // Allow requests with no origin (e.g., direct browser calls)
    if (!origin) {
        console.warn("Request with no origin header received");
        return {
            'Access-Control-Allow-Origin': '*', // Allow all origins for requests without `origin`
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', // Allowed methods
            'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allowed headers
            'Access-Control-Allow-Credentials': 'true', // Allow cookies and credentials
        };
    }

    // Check if the origin is allowed
    if (!allowedOrigins.includes(origin)) {
        console.warn(`Blocked origin: ${origin}`);
        return undefined; // Origin not allowed
    }

    // Return CORS headers for allowed origins
    return {
        'Access-Control-Allow-Origin': origin, // Allowed origin
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', // Allowed methods
        'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allowed headers
        'Access-Control-Allow-Credentials': 'true', // Allow cookies and credentials
    };
}
