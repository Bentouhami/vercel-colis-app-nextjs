// src/app/api/v1/users/appointments/book/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/auth/auth";
import { prisma } from "@/utils/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { envoiId, date } = await req.json();

  if (!envoiId || !date) {
    return NextResponse.json(
      { message: "Envoi ou date manquant" },
      { status: 400 }
    );
  }

  // Vérifier que l'envoi appartient à l'utilisateur et qu'il est payé
  const envoi = await prisma.envoi.findFirst({
    where: {
      id: Number(envoiId),
      userId: Number(session.user.id),
      paid: true,
      isDeleted: false,
      appointments: null,
    },
    include: {
      departureAgency: true,
    },
  });

  if (!envoi) {
    return NextResponse.json(
      { message: "Envoi non valide ou déjà associé à un rendez-vous." },
      { status: 403 }
    );
  }

  // Créer le rendez-vous
  const appointment = await prisma.appointment.create({
    data: {
      envoiId: envoi.id,
      agencyId: envoi.departureAgencyId,
      date: new Date(date),
    },
  });

  return NextResponse.json({ appointment }, { status: 201 });
}
