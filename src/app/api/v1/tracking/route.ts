import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { trackingRepository} from "@/services/repositories/tracking/TrackingRepository";
import { TrackingEventStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
    const token = await getToken({ req });
    if (!token) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const { envoiId, status, location, description } = await req.json();

    try {
        await trackingRepository.adminAddEvent(token.role as any, {
            envoiId,
            status: status as TrackingEventStatus,
            location,
            description,
        });
        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
}
