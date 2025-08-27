// path: src/app/api/v1/agencies/admin-agencies/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  getAgencies,
  getAgenciesByAdminId,
} from "@/services/backend-services/Bk_AgencyService";
import { auth } from "@/auth/auth";
import { RoleDto, AgencyDto } from "@/services/dtos"; // Import AgencyDto

type AdminAgenciesQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortKey?: string;
  sortDir?: "asc" | "desc";
};

/**
 * Get agencies for admin
 * @description Retrieves a list of agencies based on the authenticated admin's role. SUPER_ADMIN sees all agencies, AGENCY_ADMIN sees agencies associated with them.
 * @params AdminAgenciesQueryParams
 * @response 200:AgencyDto[]:List of agencies
 * @response 401:{ message: string }:Unauthorized
 * @response 403:{ message: string }:Forbidden
 * @response 500:{ message: string }:Error fetching agencies
 * @auth bearer
 * @openapi
 */
export async function GET(request: NextRequest) {
  const sess = await auth();
  if (!sess) return new NextResponse("Unauthorized", { status: 401 });

  const role = sess.user?.role;
  const staffId = Number(sess.user?.id);

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const search = searchParams.get("search") ?? "";
  const sortKey = searchParams.get("sortKey") ?? "name";
  const sortDir = searchParams.get("sortDir") === "desc" ? "desc" : "asc";

  try {
    let result;

    if (role === RoleDto.SUPER_ADMIN) {
      result = await getAgencies({ page, limit, search, sortKey, sortDir });
    } else if (role === RoleDto.AGENCY_ADMIN) {
      result = await getAgenciesByAdminId(staffId, {
        page,
        limit,
        search,
        sortKey,
        sortDir,
      });
    } else {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return new NextResponse("Error fetching agencies", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
