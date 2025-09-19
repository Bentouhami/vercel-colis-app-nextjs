import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth/auth";
import { RoleDto } from "@/services/dtos";
import {
  DeleteUserById,
  getUserById,
} from "@/services/backend-services/Bk_UserService";
import { prisma } from "@/utils/db";

function parseUserId(idParam: string | undefined): number | null {
  if (!idParam) {
    return null;
  }

  const numericId = Number(idParam);
  if (!Number.isFinite(numericId) || numericId <= 0) {
    return null;
  }

  return numericId;
}

async function ensureAdminCanManageUser(
  role: RoleDto,
  sessionUserId: unknown,
  targetUserId: number
): Promise<NextResponse | null> {
  if (role === RoleDto.SUPER_ADMIN) {
    return null;
  }

  if (role !== RoleDto.AGENCY_ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const adminId = Number(sessionUserId);
  if (!Number.isFinite(adminId) || adminId <= 0) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (adminId === targetUserId) {
    return null;
  }

  const adminAgency = await prisma.agencyStaff.findFirst({
    where: {
      staffId: adminId,
      staffRole: RoleDto.AGENCY_ADMIN,
    },
    select: { agencyId: true },
  });

  if (!adminAgency) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [staffLink, clientLink] = await Promise.all([
    prisma.agencyStaff.findFirst({
      where: {
        staffId: targetUserId,
        agencyId: adminAgency.agencyId,
      },
      select: { id: true },
    }),
    prisma.agencyClients.findFirst({
      where: {
        clientId: targetUserId,
        agencyId: adminAgency.agencyId,
      },
      select: { clientId: true },
    }),
  ]);

  if (!staffLink && !clientLink) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const session = await auth();
  if (!session?.user?.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as RoleDto;
  const userId = parseUserId(params.id);

  if (!userId) {
    return NextResponse.json(
      { error: "Invalid user identifier" },
      { status: 400 }
    );
  }

  try {
    const unauthorized = await ensureAdminCanManageUser(
      role,
      session.user.id,
      userId
    );

    if (unauthorized) {
      return unauthorized;
    }

    const targetUser = await getUserById(userId);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: targetUser }, { status: 200 });
  } catch (error) {
    console.error("Admin fetch user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  if (request.method !== "DELETE") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const session = await auth();
  if (!session?.user?.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as RoleDto;
  const userId = parseUserId(params.id);

  if (!userId) {
    return NextResponse.json(
      { error: "Invalid user identifier" },
      { status: 400 }
    );
  }

  try {
    const unauthorized = await ensureAdminCanManageUser(
      role,
      session.user.id,
      userId
    );

    if (unauthorized) {
      return unauthorized;
    }

    const targetUser = await getUserById(userId);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const deleted = await DeleteUserById(userId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";