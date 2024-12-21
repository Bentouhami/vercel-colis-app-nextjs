// path: src/app/api/v1/users/logout/route.ts

import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {ALLOWED_ORIGINS} from "@/utils/constants";

export async function GET(req: Request) {
    try {
        const origin = req.headers.get("origin");

        // Validate the origin
        if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
            console.warn(`Blocked origin: ${origin}`);
            return NextResponse.json(
                {error: "Origin not allowed"},
                {status: 403}
            );
        }

        // Delete the simulationResponse cookie
        cookies().delete("simulationResponse");

        // Create response
        const response = NextResponse.json(
            {message: "Logged out"},
            {status: 200}
        );

        // Set CORS headers for the allowed origin
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.headers.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );

        return response;
    } catch (error) {
        console.error("Error during logout:", error);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}

// Preflight request handler for CORS
export async function OPTIONS(req: Request) {
    const origin = req.headers.get("origin");

    // Validate the origin
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
        return new NextResponse(null, {status: 204});
    }

    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    return new NextResponse(null, {headers, status: 204});
}
