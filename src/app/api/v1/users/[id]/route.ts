// path: src/app/api/v1/users/[id]/route.ts

import {NextRequest, NextResponse} from "next/server";
import {getUserById} from "@/services/backend-services/Bk_UserService";

export async function GET(req: NextRequest, {params}: { params: { id: string } }) {
    console.log("log ====> GET request received in path: src/app/api/v1/users/[id]/route.ts");

    try {
        const userId = params.id; // Récupère l'ID depuis les paramètres de l'URL
        console.log("userId in GET request received in path: src/app/api/v1/users/[id]/route.ts: ", userId);

        if (!userId) {
            return NextResponse.json({error: 'Missing required parameter'}, {status: 400});
        }

        const user = await getUserById(Number(userId));

        if (!user) {
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }
        return NextResponse.json({data: user});
    } catch (error) {
        console.error('Error getting user:', error);
        return NextResponse.json({error: 'Failed to get user'}, {status: 500});
    }
}
