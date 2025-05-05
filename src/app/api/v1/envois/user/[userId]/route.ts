// path src/app/api/v1/envois/user/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllEnvoisByUserId } from "@/services/backend-services/Bk_EnvoiService";

/**
 * Get All Envois by User ID with Pagination
 */
export async function GET(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
    const params = await props.params;
    if (req.method !== "GET") {
        return NextResponse.json("Not allowed method!", { status: 405 });
    }

    try {
        const userId = Number(params.userId);
        if (!userId) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        // Extract query parameters for pagination
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 5;
        const offset = (page - 1) * limit;

        // Fetch paginated envois
        const { envois, total } = await getAllEnvoisByUserId(userId, limit, offset);

        return NextResponse.json(
            { data: envois, total },
            {
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
            }
        );
    } catch (error) {
        console.error("Error getting envois:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

