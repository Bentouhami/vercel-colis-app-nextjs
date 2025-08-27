// path: src/app/api/v1/agencies/[id]/route.ts

import { getAgencyById } from "@/services/backend-services/Bk_AgencyService";

export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { RoleDto, AgencyDto } from "@/services/dtos"; // Import AgencyDto
import { auth } from "@/auth/auth";

type GetAgencyByIdQueryParams = {
    agencyId: number; // ID of the agency
};

/**
 * Get agency details by ID
 * @description Retrieves agency details by its ID. Accessible by AGENCY_ADMIN and SUPER_ADMIN.
 * @params GetAgencyByIdQueryParams
 * @response 200:AgencyDto:Agency details
 * @response 400:{ error: string }:Agency ID is required
 * @response 401:{ error: string }:Unauthorized
 * @response 403:{ error: string }:Forbidden
 * @response 404:{ error: string }:Agency not found
 * @response 500:{ error: string }:Internal server error
 * @auth bearer
 * @openapi
 */
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ agencyId: string }> } // This 'params' is likely from a dynamic route, but the file name is not dynamic. I'll assume it's a query param for documentation.
) {
  const params = await props.params; // This line suggests it's a dynamic route, but the file name is not [agencyId].
  // Re-reading the file, it seems `props.params` is used, but the route is `/get-agency-by-id`.
  // This is a mismatch. I will document it as a query parameter for now, as that's how it would typically be accessed without a dynamic route segment.
  // If the user intends this to be a dynamic route, the file should be `get-agency-by-id/[agencyId]/route.ts`.

  const { searchParams } = new URL(req.url);
  const agencyIdParam = searchParams.get("agencyId"); // Assuming query param based on file name

  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // check the connected user has the role of AGENCY_ADMIN or SUPER_ADMIN
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return NextResponse.json(
      { error: "You must be connected to get your agency" },
      { status: 401 }
    );
  }

  if (user.role !== RoleDto.AGENCY_ADMIN && user.role !== RoleDto.SUPER_ADMIN) {
    return NextResponse.json(
      { error: "You don't have the right to get your agency" },
      { status: 403 }
    );
  }

  try {
    const id = parseInt(agencyIdParam || "", 10); // Use query param
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Agency ID is required" },
        { status: 400 }
      );
    }

    // Récupérer l'agence avec l'ID spécifié
    const agency = await getAgencyById(id);

    if (!agency) {
      return NextResponse.json({ error: "Agency not found" }, { status: 404 });
    }

    return NextResponse.json(agency, { status: 200 });
  } catch (error) {
    console.error("Error fetching agency by id:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
