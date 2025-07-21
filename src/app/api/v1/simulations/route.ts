// path: src/app/api/v1/simulations/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  CreateSimulationRequestDto,
  EnvoiStatus,
  SimulationResponseDto,
  SimulationStatus,
} from "@/services/dtos";
import {
  createSimulation,
  getSimulationById,
  updatePaidEnvoi,
} from "@/services/backend-services/Bk_SimulationService";
import { setSimulationResponseCookie } from "@/utils/generateSimulationToken";
import { verifySimulationToken } from "@/utils/verifySimulationToken";
import { getToken } from "next-auth/jwt";

/**
 * POST request handler for the /simulations route
 * POST request to create a new simulation with the provided data
 * @param request - NextRequest object
 * @returns NextResponse object with JSON response
 */
export async function POST(request: NextRequest) {
  // make sure the POST route is called

  console.log(
    "POST request received in path: src/app/api/v1/simulations/route.ts"
  );

  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    let simulationDataToCreate =
      (await request.json()) as CreateSimulationRequestDto;

    if (!simulationDataToCreate) {
      console.log("simulationDataToCreate is undefined");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Retrieve the connected user's token
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET as string,
    });

    // check if the user trying to create a simulation is already a client or a user visitor
    let userId;
    if (!token) {
      userId = null;
    } else {
      userId = Number(token.id) || null;
    }

    // Assign the userId to the simulation data
    simulationDataToCreate.userId = userId;

    console.log(
      " ====> Creating simulation with data in POST request in path: src/app/api/v1/simulations/route.ts : ",
      simulationDataToCreate
    );

    // Create a new simulation using the provided data
    const simulationIdAndVerificationToken = await createSimulation(
      simulationDataToCreate
    );

    if (!simulationIdAndVerificationToken) {
      return NextResponse.json(
        { success: false, error: "Failed to create simulation" },
        { status: 500 }
      );
    }

    const simulationCookie = setSimulationResponseCookie(
      simulationIdAndVerificationToken
    );

    if (!simulationCookie) {
      return NextResponse.json(
        { error: "Failed to create simulation" },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      { message: "Simulation successfully created" },
      { status: 201 }
    );

    response.headers.set("Set-Cookie", simulationCookie);

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create simulation" },
      { status: 500 }
    );
  }
}

/**
 * Methode GET
 * @param request
 * @constructor
 */
export async function GET(request: NextRequest) {
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // get simulation id and token from cookies
    const simulationIdAndToken = verifySimulationToken(request);

    // Check if the user has a simulation cookie
    if (!simulationIdAndToken) {
      return NextResponse.json({ success: false }, { status: 200 });
    }

    // Get the simulation data from the database using the simulation ID and token
    const simulation = await getSimulationById(Number(simulationIdAndToken.id));

    if (!simulation) {
      return NextResponse.json(
        { error: "Simulation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: simulation }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur, impossible de récupérer la simulation" },
      { status: 500 }
    );
  }
}

/**
 * PUT request handler for the /simulations route
 * PUT request to update a simulation with the provided data
 * @param request
 * @constructor
 */
export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as SimulationResponseDto;

    if (!body) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Retrieve the connected user's token
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET as string,
    });

    if (!body.userId) {
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      body.userId = Number(token.id);
    }

    // get simulationIdAndToken from the body
    const simulationIdAndToken = verifySimulationToken(request);

    if (!simulationIdAndToken) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    let simulationStatus: SimulationStatus =
      body.simulationStatus || SimulationStatus.DRAFT;

    if (simulationStatus === SimulationStatus.DRAFT) {
      simulationStatus = SimulationStatus.CONFIRMED;
    }

    body.simulationStatus = simulationStatus;
    body.envoiStatus = body.envoiStatus || EnvoiStatus.PENDING;
    body.id = Number(simulationIdAndToken.id);
    if (!body.id) {
      return NextResponse.json(
        { error: "Simulation ID not found" },
        { status: 400 }
      );
    }

    await updatePaidEnvoi(body, simulationIdAndToken);

    return NextResponse.json(
      { message: "Simulation updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error in simulation update" },
      { status: 500 }
    );
  }
}
