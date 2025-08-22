// path: src/app/api/v1/users/all/route.ts
import { NextRequest, NextResponse } from "next/server";

import { ProfileDto, RoleDto } from "@/services/dtos";
import {
  getAllUsers,
  getUsersByAgencyAdmin,
} from "@/services/backend-services/Bk_UserService";
import { auth } from "@/auth/auth";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const session = await auth();
  const user = session?.user;

  if (!user || !user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = user.role as RoleDto;

  let users: ProfileDto[] | null = null;
  if (role === RoleDto.SUPER_ADMIN) {
    // get all users for the super admin
    users = await getAllUsers();
  } else if (role === RoleDto.AGENCY_ADMIN) {
    const adminId = Number(session?.user.id);

    // get agency users for the agency admin
    users = await getUsersByAgencyAdmin(adminId);
  }

  if (!users) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(users, { status: 200 });
}
