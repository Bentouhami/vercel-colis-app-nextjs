// path: src/app/api/v1/users/route.ts
import { NextRequest, NextResponse } from "next/server";

import { ProfileDto, RoleDto } from "@/services/dtos";
import {
  getAllUsers,
  getUsersByAgencyAdmin,
} from "@/services/backend-services/Bk_UserService";
import { auth } from "@/auth/auth";

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get users list
 *     description: Retrieves a list of users based on the authenticated user's role. Super admins can see all users, while agency admins can only see users associated with their agency.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProfileDto'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Method not allowed
 */
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
    users = await getAllUsers();
  } else if (role === RoleDto.AGENCY_ADMIN) {
    const adminId = Number(session?.user.id);

    users = await getUsersByAgencyAdmin(adminId);
  }

  if (!users) {
    return NextResponse.json([], { status: 200 });
  }
  return NextResponse.json(users, { status: 200 });
}
