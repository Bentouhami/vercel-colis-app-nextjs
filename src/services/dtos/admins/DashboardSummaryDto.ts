// src/services/dtos/admins/DashboardSummaryDto.ts

// region Types
// 1. Interface commune de base

export type AdminRole = "SUPER_ADMIN" | "AGENCY_ADMIN" | "ACCOUNTANT";

// 2. DTO pour SUPER_ADMIN
export interface SuperAdminDashboardSummaryBackend {
  role: "SUPER_ADMIN";
  totalAgencies: number;
  totalClients: number;
  totalRevenue: number;
  activeAdmins: number;
  shipmentsThisMonth: number;
}

export interface SuperAdminStats {
  totalAgencies: number;
  totalClients: number;
  totalRevenue: number;
  activeAdmins: number;
  monthlyShipments: number;
  monthlyGrowth: number;
  recentAgencies: Array<{
    id: number;
    name: string;
    clients: number;
    revenue: number;
    status: string;
    admins: number;
  }>;
  systemAlerts: Array<{
    type: string;
    message: string;
  }>;
}

// 3. DTO pour AGENCY_ADMIN
export interface AgencyAdminDashboardSummary {
  role: "AGENCY_ADMIN";
  myShipments: number;
  agencyRevenue: number;
  upcomingAppointments: number;
  clientsCount: number;
}

// 4. DTO pour ACCOUNTANT
export interface AccountantDashboardSummary {
  role: "ACCOUNTANT";
  totalRevenue: number;
  expenses: number;
  unpaidShipments: number;
  revenueByMonth: {
    month: string; // ex: "Juillet"
    amount: number;
  }[];
}

// 5. Union type pour le résumé du tableau de bord
export type DashboardSummaryDto =
  | SuperAdminDashboardSummaryBackend
  | AgencyAdminDashboardSummary
  | AccountantDashboardSummary;

// 6. Fonction utilitaire pour vérifier le type de résumé
export function isSuperAdminSummary(
  summary: DashboardSummaryDto
): summary is SuperAdminDashboardSummaryBackend {
  return (
    (summary as SuperAdminDashboardSummaryBackend).totalAgencies !== undefined
  );
}

export function isAgencyAdminSummary(
  summary: DashboardSummaryDto
): summary is AgencyAdminDashboardSummary {
  return (summary as AgencyAdminDashboardSummary).myShipments !== undefined;
}

export function isAccountantSummary(
  summary: DashboardSummaryDto
): summary is AccountantDashboardSummary {
  return (summary as AccountantDashboardSummary).expenses !== undefined;
}
// endregion

// region Types
