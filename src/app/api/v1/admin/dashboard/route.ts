// path: src\app\api\v1\admin\dashboard\route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { RoleDto } from "@/services/dtos/enums/EnumsDto";
import { AdminDashboardBackendService } from "@/services/backend-services/AdminDashboardBackendService";
import { auth } from "@/auth/auth";
import { DashboardSummaryDto } from "@/services/dtos/admin/DashboardDto"; // Import DashboardSummaryDto

/**
 * Get admin dashboard data
 * @description Retrieves dashboard data based on the authenticated admin's role (SUPER_ADMIN, AGENCY_ADMIN, ACCOUNTANT).
 * @response 200:DashboardSummaryDto:Dashboard data
 * @response 401:{ error: string }:Unauthorized
 * @response 403:{ error: string }:Access denied
 * @response 400:{ error: string }:Role not recognized
 * @response 500:{ error: string }:Internal server error
 * @auth bearer
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier la session
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role as RoleDto;

    // Vérifier que l'utilisateur est admin
    if (
      ![RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT].includes(
        userRole
      )
    ) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Récupérer les données selon le rôle
    let dashboardData;

    switch (userRole) {
      case RoleDto.SUPER_ADMIN:
        dashboardData =
          await AdminDashboardBackendService.getSuperAdminDashboard();
        break;

      case RoleDto.AGENCY_ADMIN:
        dashboardData =
          await AdminDashboardBackendService.getAgencyAdminDashboard(
            Number(userId)
          );
        break;

      case RoleDto.ACCOUNTANT:
        dashboardData =
          await AdminDashboardBackendService.getAccountantDashboard();
        break;

      default:
        return NextResponse.json(
          { error: "Rôle non reconnu" },
          { status: 400 }
        );
    }

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Erreur API dashboard admin:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
