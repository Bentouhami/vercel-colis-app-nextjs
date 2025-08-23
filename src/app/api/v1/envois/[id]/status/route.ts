import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/auth";
import { prisma } from "@/utils/db";
import { EnvoiStatus } from "@prisma/client";
import { trackingRepository } from "@/services/repositories/tracking/TrackingRepository";
import { TrackingEventStatus } from "@prisma/client";
import { RoleDto } from "@/services/dtos";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await auth();

    // 1. Check authentication and authorization
    if (!session || ![RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN].includes(session.user.role as RoleDto)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const envoiId = Number(params.id);
    if (isNaN(envoiId)) {
        return NextResponse.json({ message: "Invalid Envoi ID" }, { status: 400 });
    }

    const { status: newStatus } = await req.json();

    if (!Object.values(EnvoiStatus).includes(newStatus)) {
        return NextResponse.json({ message: "Invalid status provided" }, { status: 400 });
    }

    try {
        // 2. Update envoi status
        const updatedEnvoi = await prisma.envoi.update({
            where: { id: envoiId },
            data: { envoiStatus: newStatus },
        });

        // 3. Create a tracking event for the status change
        let trackingEventStatus: TrackingEventStatus;
        switch (newStatus) {
            case EnvoiStatus.PENDING:
                trackingEventStatus = TrackingEventStatus.CREATED; // Or a new PENDING status
                break;
            case EnvoiStatus.SENT:
                trackingEventStatus = TrackingEventStatus.IN_TRANSIT;
                break;
            case EnvoiStatus.DELIVERED:
                trackingEventStatus = TrackingEventStatus.DELIVERED;
                break;
            case EnvoiStatus.CANCELLED:
                trackingEventStatus = TrackingEventStatus.FAILED; // Or a new CANCELLED status
                break;
            case EnvoiStatus.RETURNED:
                trackingEventStatus = TrackingEventStatus.FAILED; // Or a new RETURNED status
                break;
            default:
                trackingEventStatus = TrackingEventStatus.CREATED; // Fallback
        }

        await trackingRepository.addEvent({
            envoiId: updatedEnvoi.id,
            status: trackingEventStatus,
            description: `Statut mis à jour vers: ${newStatus.replaceAll("_", " ")}`,
        });

        return NextResponse.json({ message: "Envoi status updated successfully", envoi: updatedEnvoi });
    } catch (error) {
        console.error("Error updating envoi status:", error);
        console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
