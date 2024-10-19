// path: /src/app/api/v1/users/profile/[id]/route.ts (Route pour l'API de profil utilisateur) route for the user profile api

import {NextRequest, NextResponse} from "next/server";
import prisma from "@/utils/db";
import {errorHandler} from "@/utils/handelErrors";



// get user profile by id
export async function GET(request: NextRequest) {
    try {
        // get user from db by id
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(request.nextUrl.searchParams.get('id') as string)
            }
        });

        if (!user) {
            return NextResponse.json(
                {error: "User not found"},
                {status: 404}
            );
        }
        return NextResponse.json(user);
    } catch (error) {
        return errorHandler(
            "Internal server error",
            500);
    }
}