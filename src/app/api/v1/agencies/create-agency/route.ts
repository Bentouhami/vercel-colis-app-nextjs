// path: src/app/api/v1/agencies/create-agency/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createAgency } from "@/services/backend-services/Bk_AgencyService";
import { RoleDto, CreateAgencyDto, AgencyDto } from "@/services/dtos"; // Import DTOs
import { auth } from "@/auth/auth";

/**
 * Create a new agency
 * @description Creates a new agency record. Accessible only by SUPER_ADMIN.
 * @body CreateAgencyDto
 * @response 200:AgencyDto:Agency created successfully
 * @response 400:{ error: string }:Agency data not found
 * @response 401:{ error: string }:User not found
 * @response 403:{ error: string }:Not permitted for non super admin users
 * @response 500:{ error: string }:Failed to create agency
 * @auth bearer
 * @openapi
 */
export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // check the connected user is a super admin
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }
  if (session.user.role !== RoleDto.SUPER_ADMIN) {
    return NextResponse.json(
      { error: "Not permitted for non super admin users" },
      { status: 403 }
    );
  }

  try {
    // Get agency data from the request body
    const agencyData = await req.json();

    if (!agencyData) {
      return NextResponse.json(
        { error: "Agency data not found" },
        { status: 400 }
      );
    }

    const staffId = parseInt(<string>session?.user?.id!, 10);
    // Call the createAgency function to create the agency
    const createdAgency = await createAgency(agencyData, staffId);

    if (!createdAgency) {
      return NextResponse.json(
        { error: "Failed to create agency" },
        { status: 500 }
      );
    }

    return NextResponse.json(createdAgency, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create agency" },
      { status: 500 }
    );
  }
}
