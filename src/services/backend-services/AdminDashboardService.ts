import { PrismaClient, Role, EnvoiStatus, PaymentStatus } from "@prisma/client";
import { getSuperAdminSummary } from "@/services/repositories/admin/dashboard/getSuperAdminSummary";
import { getAgencyAdminSummary } from "@/services/repositories/admin/dashboard/getAgencyAdminSummary";
import { getAccountantSummary } from "@/services/repositories/admin/dashboard/getAccountantSummary";
import {
  DashboardSummaryDto,
  AdminRole,
} from "@/services/dtos/admins/DashboardSummaryDto";
import { getDashboardSummaryForRole } from "./admin/DashboardSummaryService";

// const prisma = new PrismaClient();

import { SuperAdminStats } from "@/services/dtos/admins/DashboardSummaryDto";
import { prisma } from "@/utils/db";

export interface AgencyAdminStats {
  agencyName: string;
  agencyShipments: number;
  agencyRevenue: number;
  agencyClients: number;
  upcomingAppointments: number;
  todayShipments: number;
  pendingShipments: number;
  completedShipments: number;
  recentClients: Array<{
    id: number;
    name: string;
    email: string;
    lastShipment: string;
    totalShipments: number;
  }>;
  upcomingAppointmentsList: Array<{
    id: number;
    client: string;
    date: string;
    time: string;
    type: string;
  }>;
}

export interface AccountantStats {
  totalGlobalRevenue: number;
  totalExpenses: number;
  unpaidShipments: number;
  monthlyRevenues: Array<{
    month: string;
    revenue: number;
  }>;
  pendingPayments: number;
  failedPayments: number;
  recentTransactions: Array<{
    id: number;
    client: string;
    amount: number;
    date: string;
    status: string;
    type: string;
  }>;
  financialAlerts: Array<{
    type: string;
    message: string;
  }>;
}

export class AdminDashboardService {
  /**
   * Get dashboard stats for SUPER_ADMIN
   */
  static async getSuperAdminStats(): Promise<SuperAdminStats> {
    try {
      // Total agencies
      const totalAgencies = await prisma.agency.count({
        where: { isDeleted: false },
      });

      // Total clients (users with CLIENT role)
      const totalClients = await prisma.user.count({
        where: {
          role: Role.CLIENT,
          isDeleted: false,
        },
      });

      // Total revenue from all paid envois
      const revenueResult = await prisma.payment.aggregate({
        where: {
          status: PaymentStatus.PAID,
          isDeleted: false,
        },
        _sum: {
          amount: true,
        },
      });
      const totalRevenue = revenueResult._sum.amount || 0;

      // Active admins (SUPER_ADMIN, AGENCY_ADMIN, ACCOUNTANT)
      const activeAdmins = await prisma.user.count({
        where: {
          role: {
            in: [Role.SUPER_ADMIN, Role.AGENCY_ADMIN, Role.ACCOUNTANT],
          },
          isDeleted: false,
          isActive: true,
        },
      });

      // Monthly shipments (current month)
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const monthlyShipments = await prisma.envoi.count({
        where: {
          createdAt: {
            gte: currentMonth,
            lt: nextMonth,
          },
          isDeleted: false,
        },
      });

      // Previous month for growth calculation
      const previousMonth = new Date(currentMonth);
      previousMonth.setMonth(previousMonth.getMonth() - 1);

      const previousMonthShipments = await prisma.envoi.count({
        where: {
          createdAt: {
            gte: previousMonth,
            lt: currentMonth,
          },
          isDeleted: false,
        },
      });

      const monthlyGrowth =
        previousMonthShipments > 0
          ? ((monthlyShipments - previousMonthShipments) /
              previousMonthShipments) *
            100
          : 0;

      // Recent agencies with their stats
      const agencies = await prisma.agency.findMany({
        where: { isDeleted: false },
        include: {
          agencyClients: {
            include: {
              client: true,
            },
          },
          agencyStaff: {
            where: {
              staffRole: {
                in: [Role.AGENCY_ADMIN, Role.ACCOUNTANT],
              },
            },
          },
          departureEnvoi: {
            where: {
              isDeleted: false,
            },
            include: {
              payment: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
      });

      const recentAgencies = agencies.map((agency) => {
        const clients = agency.agencyClients.length;
        const revenue = agency.departureEnvoi
          .filter((envoi) => envoi.payment?.status === PaymentStatus.PAID)
          .reduce((sum, envoi) => sum + (envoi.payment?.amount || 0), 0);

        return {
          id: agency.id,
          name: agency.name,
          clients,
          revenue,
          status: agency.isDeleted ? "inactive" : "active",
          admins: agency.agencyStaff.length,
        };
      });

      // System alerts (basic implementation)
      const systemAlerts = [
        {
          type: "info",
          message: `${totalAgencies} agences actives sur la plateforme`,
        },
        {
          type: "success",
          message: `${monthlyShipments} envois ce mois (+${monthlyGrowth.toFixed(
            1
          )}%)`,
        },
      ];

      return {
        totalAgencies,
        totalClients,
        totalRevenue,
        activeAdmins,
        monthlyShipments,
        monthlyGrowth,
        recentAgencies,
        systemAlerts,
      };
    } catch (error) {
      console.error("Error fetching super admin stats:", error);
      throw new Error("Failed to fetch super admin statistics");
    }
  }

  /**
   * Get dashboard stats for AGENCY_ADMIN
   */
  static async getAgencyAdminStats(userId: number): Promise<AgencyAdminStats> {
    try {
      // Find the agency this admin manages
      const agencyStaff = await prisma.agencyStaff.findFirst({
        where: {
          staffId: userId,
          staffRole: Role.AGENCY_ADMIN,
        },
        include: {
          agency: {
            include: {
              agencyClients: {
                include: {
                  client: true,
                },
              },
              departureEnvoi: {
                where: { isDeleted: false },
                include: {
                  payment: true,
                  client: true,
                },
              },
              appointments: {
                where: {
                  isDeleted: false,
                  date: {
                    gte: new Date(),
                  },
                },
                include: {
                  envoi: {
                    include: {
                      client: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!agencyStaff?.agency) {
        throw new Error("Agency not found for this admin");
      }

      const agency = agencyStaff.agency;
      const agencyName = agency.name;

      // Agency shipments
      const agencyShipments = agency.departureEnvoi.length;

      // Agency revenue
      const agencyRevenue = agency.departureEnvoi
        .filter((envoi) => envoi.payment?.status === PaymentStatus.PAID)
        .reduce((sum, envoi) => sum + (envoi.payment?.amount || 0), 0);

      // Agency clients
      const agencyClients = agency.agencyClients.length;

      // Upcoming appointments
      const upcomingAppointments = agency.appointments.length;

      // Today's shipments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayShipments = agency.departureEnvoi.filter((envoi) => {
        const envoiDate = new Date(envoi.createdAt);
        return envoiDate >= today && envoiDate < tomorrow;
      }).length;

      // Pending and completed shipments
      const pendingShipments = agency.departureEnvoi.filter(
        (envoi) => envoi.envoiStatus === EnvoiStatus.PENDING
      ).length;

      const completedShipments = agency.departureEnvoi.filter(
        (envoi) => envoi.envoiStatus === EnvoiStatus.DELIVERED
      ).length;

      // Recent clients
      const recentClients = agency.agencyClients.slice(0, 3).map((ac) => {
        const client = ac.client;
        const clientEnvois = agency.departureEnvoi.filter(
          (e) => e.userId === client.id
        );
        const lastEnvoi = clientEnvois.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        return {
          id: client.id,
          name: client.name || `${client.firstName} ${client.lastName}`,
          email: client.email,
          lastShipment: lastEnvoi
            ? lastEnvoi.createdAt.toISOString().split("T")[0]
            : "N/A",
          totalShipments: clientEnvois.length,
        };
      });

      // Upcoming appointments list
      const upcomingAppointmentsList = agency.appointments
        .slice(0, 3)
        .map((appointment) => ({
          id: appointment.id,
          client: appointment.envoi.client?.name || "Client inconnu",
          date: appointment.date.toISOString().split("T")[0],
          time: appointment.date.toTimeString().slice(0, 5),
          type: "Dépôt colis",
        }));

      return {
        agencyName,
        agencyShipments,
        agencyRevenue,
        agencyClients,
        upcomingAppointments,
        todayShipments,
        pendingShipments,
        completedShipments,
        recentClients,
        upcomingAppointmentsList,
      };
    } catch (error) {
      console.error("Error fetching agency admin stats:", error);
      throw new Error("Failed to fetch agency admin statistics");
    }
  }

  /**
   * Get dashboard stats for ACCOUNTANT
   */
  static async getAccountantStats(): Promise<AccountantStats> {
    try {
      // Total global revenue
      const revenueResult = await prisma.payment.aggregate({
        where: {
          status: PaymentStatus.PAID,
          isDeleted: false,
        },
        _sum: {
          amount: true,
        },
      });
      const totalGlobalRevenue = revenueResult._sum.amount || 0;

      // Total expenses (mock calculation - you might have a separate expenses table)
      const totalExpenses = totalGlobalRevenue * 0.4; // Assuming 40% expenses

      // Unpaid shipments
      const unpaidShipments = await prisma.envoi.count({
        where: {
          paid: false,
          isDeleted: false,
        },
      });

      // Monthly revenues for the last 4 months
      const monthlyRevenues = [];
      const months = ["Oct", "Nov", "Déc", "Jan"];

      for (let i = 3; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthRevenue = await prisma.payment.aggregate({
          where: {
            status: PaymentStatus.PAID,
            isDeleted: false,
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          _sum: {
            amount: true,
          },
        });

        monthlyRevenues.push({
          month: months[3 - i],
          revenue: monthRevenue._sum.amount || 0,
        });
      }

      // Pending and failed payments
      const pendingPayments = await prisma.payment.count({
        where: {
          status: PaymentStatus.PENDING,
          isDeleted: false,
        },
      });

      const failedPayments = await prisma.payment.count({
        where: {
          status: PaymentStatus.FAILED,
          isDeleted: false,
        },
      });

      // Recent transactions
      const recentPayments = await prisma.payment.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          envoi: {
            include: {
              client: true,
              departureAgency: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
      });

      const recentTransactions = recentPayments.map((payment) => ({
        id: payment.id,
        client: payment.envoi.departureAgency?.name || "Agence inconnue",
        amount: payment.amount,
        date: payment.createdAt.toISOString().split("T")[0],
        status: payment.status.toLowerCase(),
        type: "Commission",
      }));

      // Financial alerts
      const financialAlerts = [
        {
          type: failedPayments > 0 ? "warning" : "success",
          message:
            failedPayments > 0
              ? `${failedPayments} paiements échoués nécessitent une attention`
              : "Tous les paiements sont à jour",
        },
        {
          type: "info",
          message: `${pendingPayments} paiements en attente de traitement`,
        },
      ];

      return {
        totalGlobalRevenue,
        totalExpenses,
        unpaidShipments,
        monthlyRevenues,
        pendingPayments,
        failedPayments,
        recentTransactions,
        financialAlerts,
      };
    } catch (error) {
      console.error("Error fetching accountant stats:", error);
      throw new Error("Failed to fetch accountant statistics");
    }
  }

  /**
   * Get dashboard summary based on user role
   */
  static async getDashboardSummary(
    userId: number,
    userRole: Role
  ): Promise<DashboardSummaryDto> {
    try {
      let adminRole: AdminRole;

      switch (userRole) {
        case Role.SUPER_ADMIN:
          adminRole = "SUPER_ADMIN";
          break;
        case Role.AGENCY_ADMIN:
          adminRole = "AGENCY_ADMIN";
          break;
        case Role.ACCOUNTANT:
          adminRole = "ACCOUNTANT";
          break;
        default:
          throw new Error(`Rôle non autorisé: ${userRole}`);
      }

      return await getDashboardSummaryForRole(adminRole, {
        id: userId.toString(),
      });
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      throw new Error("Failed to fetch dashboard data");
    }
  }
}
