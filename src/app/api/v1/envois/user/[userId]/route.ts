// path src/app/api/v1/envois/user/route.ts
import {NextRequest, NextResponse} from "next/server";
import {getAllEnvoisByUserId} from "@/services/backend-services/Bk_EnvoiService";

/**
 * Get All Envois by User ID
 */
export async function GET(req: NextRequest, {params}: { params: { userId: string } }) {

    if (req.method !== 'GET') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    const userId = Number(params.userId) || null;

    console.log("log ====> userId in API route is:", userId);

    if (!userId) {
        return NextResponse.json({error: "Invalid user ID"}, {status: 400});
    }

    const envoisList = await getAllEnvoisByUserId(userId);
    if (!envoisList || envoisList.length === 0) {
        return NextResponse.json({error: "EnvoiList not found"}, {status: 404});
    }

    return NextResponse.json(envoisList, {
            status: 200,
            headers: {
                "Cache-Control": "no-cache, max-age=0, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",

            },
        }
    );
}

export const dynamic = "force-dynamic";

