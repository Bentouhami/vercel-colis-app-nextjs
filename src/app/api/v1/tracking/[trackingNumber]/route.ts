// E:\fullstack_project\NextJs_Projects\newColiApp\src\app\api\v1\tracking\route.ts
import {NextRequest, NextResponse} from "next/server";
import {trackingRepository} from "@/services/repositories/tracking/TrackingRepository";
import { prisma } from "@/utils/db"

export async function POST(req: NextRequest) {
    const body = await req.json();
    await trackingRepository.addEvent({
        envoiId: body.envoiId,
        status: body.status,
        location: body.location,
        description: body.description,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ trackingNumber: string }> }
) {
    // Await params in Next.js 15
    const { trackingNumber } = await params;

    if (!trackingNumber)
        return NextResponse.json({ error: "trackingNumber manquant" }, { status: 400 });

    try {
        // 1. Retrouver l'envoi de référence
        const envoi = await prisma.envoi.findFirst({
            where: { trackingNumber },
            select: {
                id: true,
                envoiStatus: true,
                totalWeight: true,
                totalVolume: true,
                totalPrice: true,
                departureDate: true,
                arrivalDate: true,
                departureAgency: { select: { name: true } },
                arrivalAgency: { select: { name: true } },
            },
        });

        if (!envoi)
            return NextResponse.json({ error: "Colis introuvable" }, { status: 404 });

        // 2. Charger les évènements associés
        const events = await trackingRepository.listByTrackingNumber(trackingNumber);

        return NextResponse.json({ events, envoi });
    } catch (err) {
        console.error("GET /tracking error", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}