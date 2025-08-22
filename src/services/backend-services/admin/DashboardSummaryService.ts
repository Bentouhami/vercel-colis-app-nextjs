// path: /services/backend-service/admin/DashboardSummaryService.ts
import {
  AdminRole,
  DashboardSummaryDto,
  SuperAdminDashboardSummaryBackend,
} from "@/services/dtos/admins/DashboardSummaryDto";
import { getAccountantSummary } from "@/services/repositories/admin/dashboard/getAccountantSummary";
import { getAgencyAdminSummary } from "@/services/repositories/admin/dashboard/getAgencyAdminSummary";
import { getSuperAdminSummary } from "@/services/repositories/admin/dashboard/getSuperAdminSummary";

export async function getDashboardSummaryForRole(
  role: AdminRole,
  user: { id: string }
): Promise<DashboardSummaryDto> {
  switch (role) {
    case "SUPER_ADMIN":
      return await getSuperAdminSummary();
    case "AGENCY_ADMIN":
      return await getAgencyAdminSummary(user.id);
    case "ACCOUNTANT":
      return await getAccountantSummary();
    default:
      throw new Error("Rôle non supporté");
  }
}
