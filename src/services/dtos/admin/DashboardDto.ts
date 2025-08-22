// DTOs pour le dashboard admin
export interface DashboardSummaryDto {
  totalAgencies: number;
  totalClients: number;
  totalRevenue: number;
  activeAdmins: number;
  monthlyShipments: number;
  monthlyGrowth: number;
  recentAgencies: AgencyPerformanceDto[];
  systemAlerts: SystemAlertDto[];
}

export interface AgencyDashboardDto {
  agencyShipments: number;
  agencyRevenue: number;
  agencyClients: number;
  upcomingAppointments: number;
  todayShipments: number;
  pendingShipments: number;
  completedShipments: number;
  recentClients: RecentClientDto[];
  upcomingAppointmentsList: UpcomingAppointmentDto[];
  systemAlerts: SystemAlertDto[];
}

export interface AccountantDashboardDto {
  totalRevenue: number;
  unpaidShipments: number;
  monthlyRevenues: MonthlyRevenueDto[];
  pendingPayments: number;
  failedPayments: number;
  recentTransactions: RecentTransactionDto[];
  financialAlerts: SystemAlertDto[];
}

export interface AgencyPerformanceDto {
  id: number;
  name: string;
  clients: number;
  revenue: number;
  status: string;
  admins: number;
}

export interface SystemAlertDto {
  type: "success" | "warning" | "error" | "info";
  message: string;
}

export interface RecentClientDto {
  id: number;
  name: string;
  email: string;
  lastShipment: string;
  totalShipments: number;
}

export interface UpcomingAppointmentDto {
  id: number;
  client: string;
  date: string;
  time: string;
  type: string;
}

export interface MonthlyRevenueDto {
  month: string;
  revenue: number;
}

export interface RecentTransactionDto {
  id: number;
  client: string;
  amount: number;
  date: string;
  status: string;
  type: string;
}
