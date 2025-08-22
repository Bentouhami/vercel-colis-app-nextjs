// src/app/api/v1/users/appointments/envoi-paye/route.ts

import { auth } from "@/auth/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const envoi = await prisma.envoi.findFirst({
    where: {
      userId: Number(session.user.id),
      paid: true,
      appointments: null,
      isDeleted: false,
    },
    select: {
      id: true,
      trackingNumber: true,
      departureAgency: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!envoi) {
    return NextResponse.json({ envoi: null }, { status: 200 });
  }

  return NextResponse.json({
    envoi: {
      id: envoi.id,
      trackingNumber: envoi.trackingNumber,
      departureAgencyName: envoi.departureAgency.name,
    },
  });
}
