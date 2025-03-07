// path: src/app/api/v1/simulations/delete-cookies/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DOMAIN } from "@/utils/constants";
export async function GET() {
    try {
        const cookieName = process.env.SIMULATION_COOKIE_NAME;

        if (!cookieName) {
            console.error("No cookie name found in env variables");
            return NextResponse.json(
                { message: "Server configuration error" },
                { status: 500 }
            );
        }

        const response = NextResponse.json(
            { message: "Simulation cookies deleted successfully" },
            { status: 200 }
        );

        // Set expired cookie
        response.cookies.set(cookieName, "", {
            expires: new Date(0),
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            httpOnly: true
        });


        return response;
    } catch (error) {
        console.error("Error in delete cookies route:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}