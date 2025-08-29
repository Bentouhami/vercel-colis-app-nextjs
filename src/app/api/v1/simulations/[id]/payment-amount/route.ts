// /app/api/v1/simulations/[id]/payment-amount/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getSimulationById } from "@/services/backend-services/Bk_SimulationService";
import { RoleDto } from "@/services/dtos";
import { auth } from "@/auth/auth";
import { getEnvoiById } from "@/services/backend-services/Bk_EnvoiService"; // Assuming this is the correct import for getEnvoiById

type SimulationPaymentAmountParams = {
  id: number; // ID of the simulation
};

/**
 * Get simulation payment details
 * @description Retrieves payment details for a specific simulation, including authentication, role, and ownership checks.
 * @pathParams SimulationPaymentAmountParams
 * @response 200:{ success: boolean, data: object }:Payment details for the simulation
 * @response 400:{ error: string }:Invalid simulation ID or price
 * @response 401:{ error: string }:Unauthorized
 * @response 403:{ error: string }:Forbidden access or admin account
 * @response 404:{ error: string }:Simulation not found
 * @response 500:{ error: string }:Internal server error
 * @auth bearer
 * @openapi
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  try {
    //  1. Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    //  2. Block admin accounts from payments
    if (
      session.user.role &&
      [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT].includes(
        session.user.role as RoleDto
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Les comptes administrateurs ne peuvent pas effectuer de paiements",
        },
        { status: 403 }
      );
    }

    //  3. Validate simulation ID
    const simulationId = Number(params.id);
    if (isNaN(simulationId) || simulationId <= 0) {
      return NextResponse.json(
        { error: "ID de simulation invalide" },
        { status: 400 }
      );
    }

    //  4. Get simulation from database
    const simulation = await getSimulationById(simulationId);
    if (!simulation) {
      return NextResponse.json(
        { error: "Simulation introuvable" },
        { status: 404 }
      );
    }

    //  5. Check if user owns this simulation (sender or recipient)
    const currentUserId = Number(session.user.id);
    const isOwner =
      simulation.userId === currentUserId ||
      simulation.destinataireId === currentUserId;

    if (!isOwner) {
      console.warn(
        `Unauthorized payment access: User ${currentUserId} tried to access simulation ${simulationId}`
      );
      return NextResponse.json(
        { error: "Accès non autorisé à cette simulation" },
        { status: 403 }
      );
    }

    //  6. Check if simulation has a valid price
    if (!simulation.totalPrice || simulation.totalPrice <= 0) {
      return NextResponse.json(
        { error: "Prix de la simulation non disponible" },
        { status: 400 }
      );
    }
    // get full simulation by id
    const envoi = await getEnvoiById(simulationId);

    //  7. Check if simulation is not already paid
    if (envoi?.paid) {
      return NextResponse.json(
        { error: "Cette simulation a déjà été payée" },
        { status: 400 }
      );
    }

    //  8. Return secure payment data
    return NextResponse.json(
      {
        success: true,
        data: {
          simulationId: simulation.id,
          amount: simulation.totalPrice,
          currency: "EUR",
          departureCity: simulation.departureCity,
          destinationCity: simulation.destinationCity,
          totalWeight: simulation.totalWeight,
          parcelsCount: simulation.parcels?.length || 0,
          isValidForPayment: true,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching payment amount:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
