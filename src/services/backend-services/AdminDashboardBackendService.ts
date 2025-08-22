import { AdminDashboardRepository } from "@/services/repositories/AdminDashboardRepository";
import {
  DashboardSummaryDto,
  AgencyDashboardDto,
  AccountantDashboardDto,
} from "@/services/dtos/admin/DashboardDto";

export class AdminDashboardBackendService {
  static async getSuperAdminDashboard(): Promise<DashboardSummaryDto> {
    try {
      const [
        totalAgencies,
        totalClients,
        totalRevenue,
        activeAdmins,
        monthlyShipments,
        previousMonthShipments,
        recentAgencies,
        systemAlerts,
      ] = await Promise.all([
        AdminDashboardRepository.getTotalAgencies(),
        AdminDashboardRepository.getTotalClients(),
        AdminDashboardRepository.getTotalRevenue(),
        AdminDashboardRepository.getActiveAdmins(),
        AdminDashboardRepository.getMonthlyShipments(),
        AdminDashboardRepository.getPreviousMonthShipments(),
        AdminDashboardRepository.getRecentAgencies(),
        AdminDashboardRepository.getSystemAlerts(),
      ]);

      // Calculer la croissance mensuelle
      const monthlyGrowth =
        previousMonthShipments > 0
          ? ((monthlyShipments - previousMonthShipments) /
              previousMonthShipments) *
            100
          : 0;

      return {
        totalAgencies,
        totalClients,
        totalRevenue,
        activeAdmins,
        monthlyShipments,
        monthlyGrowth: Math.round(monthlyGrowth * 100) / 100, // Arrondir à 2 décimales
        recentAgencies,
        systemAlerts,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données Super Admin:",
        error
      );
      throw new Error(
        "Impossible de récupérer les données du dashboard Super Admin"
      );
    }
  }

  static async getAgencyAdminDashboard(
    adminId: number
  ): Promise<AgencyDashboardDto> {
    try {
      // Récupérer l'agence de l'admin
      const agency = await AdminDashboardRepository.getAgencyByAdminId(adminId);

      if (!agency) {
        throw new Error("Agence non trouvée pour cet administrateur");
      }

      const [
        agencyShipments,
        agencyRevenue,
        agencyClients,
        upcomingAppointments,
        todayShipments,
        pendingShipments,
        completedShipments,
        recentClients,
        upcomingAppointmentsList,
        systemAlerts,
      ] = await Promise.all([
        AdminDashboardRepository.getAgencyShipments(agency.id),
        AdminDashboardRepository.getAgencyRevenue(agency.id),
        AdminDashboardRepository.getAgencyClients(agency.id),
        AdminDashboardRepository.getUpcomingAppointments(agency.id),
        AdminDashboardRepository.getTodayShipments(agency.id),
        AdminDashboardRepository.getPendingShipments(agency.id),
        AdminDashboardRepository.getCompletedShipments(agency.id),
        AdminDashboardRepository.getRecentClients(agency.id),
        AdminDashboardRepository.getUpcomingAppointmentsList(agency.id),
        AdminDashboardRepository.getAgencyAlerts(agency.id),
      ]);

      return {
        agencyShipments,
        agencyRevenue,
        agencyClients,
        upcomingAppointments,
        todayShipments,
        pendingShipments,
        completedShipments,
        recentClients,
        upcomingAppointmentsList,
        systemAlerts,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données Agency Admin:",
        error
      );
      throw new Error(
        "Impossible de récupérer les données du dashboard Agency Admin"
      );
    }
  }

  static async getAccountantDashboard(): Promise<AccountantDashboardDto> {
    try {
      const [
        totalRevenue,
        unpaidShipments,
        monthlyRevenues,
        pendingPayments,
        failedPayments,
        recentTransactions,
        financialAlerts,
      ] = await Promise.all([
        AdminDashboardRepository.getTotalRevenue(),
        AdminDashboardRepository.getUnpaidShipments(),
        AdminDashboardRepository.getMonthlyRevenues(),
        AdminDashboardRepository.getPendingPayments(),
        AdminDashboardRepository.getFailedPayments(),
        AdminDashboardRepository.getRecentTransactions(),
        AdminDashboardRepository.getFinancialAlerts(),
      ]);

      return {
        totalRevenue,
        unpaidShipments,
        monthlyRevenues,
        pendingPayments,
        failedPayments,
        recentTransactions,
        financialAlerts,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données Accountant:",
        error
      );
      throw new Error(
        "Impossible de récupérer les données du dashboard Accountant"
      );
    }
  }
}
