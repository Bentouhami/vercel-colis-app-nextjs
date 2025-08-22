import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { auth } from "@/auth/auth";
import { RoleDto } from "@/services/dtos/enums/EnumsDto";
import { AdminDashboardBackendService } from "@/services/backend-services/AdminDashboardBackendService";

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
      case Role.SUPER_ADMIN:
        dashboardData =
          await AdminDashboardBackendService.getSuperAdminDashboard();
        break;

      case Role.AGENCY_ADMIN:
        dashboardData =
          await AdminDashboardBackendService.getAgencyAdminDashboard(
            Number(userId)
          );
        break;

      case Role.ACCOUNTANT:
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
