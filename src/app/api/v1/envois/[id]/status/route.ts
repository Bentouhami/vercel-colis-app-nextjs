// src/app/api/v1/envois/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/auth";
import { prisma } from "@/utils/db";
import { EnvoiStatus, TrackingEventStatus } from "@prisma/client";
import { RoleDto } from "@/services/dtos";
import { trackingRepository } from "@/services/repositories/tracking/TrackingRepository";

export const dynamic = "force-dynamic";

/**
 * Update an envoi status (admin-only) and append a matching tracking event.
 * NOTE (Next.js 15): `params` is a Promise and must be awaited.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <-- key: Promise here
) {
  // Await params per Next.js 15 route handlers
  const { id } = await params;
  const envoiId = Number(id);

  // 1) AuthZ (only SUPER_ADMIN / AGENCY_ADMIN)
  const session = await auth();
  if (
    !session ||
    ![RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN].includes(
      session.user.role as RoleDto
    )
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2) Validate ID
  if (!envoiId || Number.isNaN(envoiId)) {
    return NextResponse.json({ message: "Invalid Envoi ID" }, { status: 400 });
  }

  // 3) Safe body parse + validate status
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const newStatus = body?.status as EnvoiStatus | undefined;
  const location = body?.location as string | undefined;
  const description = body?.description as string | undefined;

  if (!newStatus || !Object.values(EnvoiStatus).includes(newStatus)) {
    return NextResponse.json(
      { message: "Invalid status provided" },
      { status: 400 }
    );
  }

  try {
    // 4) Update envoi
    const updatedEnvoi = await prisma.envoi.update({
      where: { id: envoiId },
      data: { envoiStatus: newStatus },
    });

    // 5) Map EnvoiStatus -> TrackingEventStatus
    let trackingEventStatus: TrackingEventStatus;
    switch (newStatus) {
      case EnvoiStatus.PENDING:
        trackingEventStatus = TrackingEventStatus.CREATED;
        break;
      case EnvoiStatus.SENT:
        trackingEventStatus = TrackingEventStatus.IN_TRANSIT; // generic transit milestone
        break;
      case EnvoiStatus.DELIVERED:
        trackingEventStatus = TrackingEventStatus.DELIVERED;
        break;
      case EnvoiStatus.CANCELLED:
        trackingEventStatus = TrackingEventStatus.FAILED;
        break;
      case EnvoiStatus.RETURNED:
        // keep FAILED unless you add a dedicated RETURNED event
        trackingEventStatus = TrackingEventStatus.FAILED;
        break;
      default:
        trackingEventStatus = TrackingEventStatus.CREATED; // fallback
    }

    // 6) Emit tracking event (keeps timeline + auto-syncs envoiStatus in repo)
    await trackingRepository.addEvent({
      envoiId: updatedEnvoi.id,
      status: trackingEventStatus,
      location,
      description:
        description ??
        `Statut mis à jour vers: ${newStatus.replaceAll("_", " ")}`,
    });

    return NextResponse.json({
      message: "Envoi status updated successfully",
      envoi: updatedEnvoi,
    });
  } catch (error) {
    console.error("Error updating envoi status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
