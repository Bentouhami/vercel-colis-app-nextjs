// path src/app/api/v1/envois/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllEnvoisByUserId } from "@/services/backend-services/Bk_EnvoiService";

/**
 * Get All Envois by User ID
 */
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const userId = Number(params.userId) || null;

    console.log("log ====> userId in API route is:", userId);

    if (!userId) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const envoisList = await getAllEnvoisByUserId(userId);
    if (!envoisList || envoisList.length === 0) {
        return NextResponse.json({ error: "EnvoiList not found" }, { status: 404 });
    }

    return NextResponse.json(envoisList, {
        headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    });
}

