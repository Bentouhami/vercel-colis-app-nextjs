import { prisma } from "@/lib/prisma";
import {
  Role,
  PaymentStatus,
  EnvoiStatus,
  AppointmentStatus,
} from "@prisma/client";
import {
  AgencyPerformanceDto,
  SystemAlertDto,
  RecentClientDto,
  UpcomingAppointmentDto,
  MonthlyRevenueDto,
  RecentTransactionDto,
} from "@/services/dtos/admin/DashboardDto";

export class AdminDashboardRepository {
  /**
   * SUPER_ADMIN - Méthodes globales
   */

  static async getTotalAgencies(): Promise<number> {
    return await prisma.agency.count({
      where: { isDeleted: false },
    });
  }

  static async getTotalClients(): Promise<number> {
    return await prisma.user.count({
      where: {
        role: Role.CLIENT,
        isDeleted: false,
      },
    });
  }

  static async getTotalRevenue(): Promise<number> {
    const result = await prisma.payment.aggregate({
      where: {
        status: PaymentStatus.PAID,
        isDeleted: false,
      },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  static async getActiveAdmins(): Promise<number> {
    return await prisma.user.count({
      where: {
        role: {
          in: [Role.SUPER_ADMIN, Role.AGENCY_ADMIN, Role.ACCOUNTANT],
        },
        isActive: true,
        isDeleted: false,
      },
    });
  }

  static async getMonthlyShipments(): Promise<number> {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    return await prisma.envoi.count({
      where: {
        createdAt: {
          gte: currentMonth,
          lt: nextMonth,
        },
        isDeleted: false,
      },
    });
  }

  static async getPreviousMonthShipments(): Promise<number> {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    return await prisma.envoi.count({
      where: {
        createdAt: {
          gte: previousMonth,
          lt: currentMonth,
        },
        isDeleted: false,
      },
    });
  }

  static async getRecentAgencies(): Promise<AgencyPerformanceDto[]> {
    const agencies = await prisma.agency.findMany({
      where: { isDeleted: false },
      include: {
        _count: true,
        departureEnvoi: {
          where: {
            isDeleted: false,
            payment: {
              status: PaymentStatus.PAID,
            },
          },
          include: { payment: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    return agencies.map((agency) => ({
      id: agency.id,
      name: agency.name,
      clients: agency._count.departureEnvoi, // Approximation basée sur les envois
      revenue: agency.departureEnvoi.reduce(
        (sum, envoi) => sum + (envoi.payment?.amount || 0),
        0
      ),
      status: agency.isDeleted ? "inactive" : "active",
      admins: agency._count.agencyStaff,
    }));
  }

  static async getSystemAlerts(): Promise<SystemAlertDto[]> {
    const alerts: SystemAlertDto[] = [];

    // Vérifier les agences avec peu d'activité
    const lowActivityAgencies = await prisma.agency.count({
      where: {
        isDeleted: false,
        departureEnvoi: {
          none: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours
            },
          },
        },
      },
    });

    if (lowActivityAgencies > 0) {
      alerts.push({
        type: "warning",
        message: `${lowActivityAgencies} agences ont peu d'activité ce mois`,
      });
    }

    // Vérifier les paiements échoués
    const failedPayments = await prisma.payment.count({
      where: {
        status: PaymentStatus.FAILED,
        isDeleted: false,
      },
    });

    if (failedPayments > 0) {
      alerts.push({
        type: "error",
        message: `${failedPayments} paiements ont échoué et nécessitent une attention`,
      });
    }

    // Message de succès par défaut
    if (alerts.length === 0) {
      alerts.push({
        type: "success",
        message: "Toutes les opérations fonctionnent normalement",
      });
    }

    return alerts;
  }

  /**
   * AGENCY_ADMIN - Méthodes spécifiques à une agence
   */

  static async getAgencyByAdminId(adminId: number) {
    const agencyStaff = await prisma.agencyStaff.findFirst({
      where: {
        staffId: adminId,
        staffRole: Role.AGENCY_ADMIN,
      },
      include: { agency: true },
    });
    return agencyStaff?.agency || null;
  }

  static async getAgencyShipments(agencyId: number): Promise<number> {
    return await prisma.envoi.count({
      where: {
        departureAgencyId: agencyId,
        isDeleted: false,
      },
    });
  }

  static async getAgencyRevenue(agencyId: number): Promise<number> {
    const result = await prisma.payment.aggregate({
      where: {
        envoi: {
          departureAgencyId: agencyId,
          isDeleted: false,
        },
        status: PaymentStatus.PAID,
        isDeleted: false,
      },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  static async getAgencyClients(agencyId: number): Promise<number> {
    // Compter les clients uniques qui ont fait des envois depuis cette agence
    const uniqueClients = await prisma.envoi.findMany({
      where: {
        departureAgencyId: agencyId,
        isDeleted: false,
      },
      select: { client: { select: { id: true } } }, // Adjusted to access client.id
      distinct: ["id"], // Adjusted to use 'id' as a valid scalar field
    });

    return uniqueClients.length;
  }

  static async getUpcomingAppointments(agencyId: number): Promise<number> {
    return await prisma.appointment.count({
      where: {
        agencyId,
        date: { gte: new Date() },
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
        isDeleted: false,
      },
    });
  }

  static async getTodayShipments(agencyId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await prisma.envoi.count({
      where: {
        departureAgencyId: agencyId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        isDeleted: false,
      },
    });
  }

  static async getPendingShipments(agencyId: number): Promise<number> {
    return await prisma.envoi.count({
      where: {
        departureAgencyId: agencyId,
        envoiStatus: EnvoiStatus.PENDING,
        isDeleted: false,
      },
    });
  }

  static async getCompletedShipments(agencyId: number): Promise<number> {
    return await prisma.envoi.count({
      where: {
        departureAgencyId: agencyId,
        envoiStatus: EnvoiStatus.DELIVERED,
        isDeleted: false,
      },
    });
  }

  static async getRecentClients(agencyId: number): Promise<RecentClientDto[]> {
    const recentEnvois = await prisma.envoi.findMany({
      where: {
        departureAgencyId: agencyId,
        isDeleted: false,
      },
      include: {
        client: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Grouper par client et prendre les 3 plus récents
    const clientsMap = new Map();

    // Add null check for envoi.client
    recentEnvois.forEach((envoi) => {
      if (envoi.client && !clientsMap.has(envoi.client.id)) {
        clientsMap.set(envoi.client.id, {
          id: envoi.client.id,
          name:
            envoi.client.name ||
            `${envoi.client.firstName} ${envoi.client.lastName}` ||
            "Client inconnu",
          email: envoi.client.email,
          lastShipment: envoi.createdAt.toISOString().split("T")[0],
          totalShipments: 1,
        });
      } else if (envoi.client && clientsMap.has(envoi.client.id)) {
        clientsMap.get(envoi.client.id).totalShipments++;
      }
    });

    return Array.from(clientsMap.values()).slice(0, 3);
  }

  static async getUpcomingAppointmentsList(
    agencyId: number
  ): Promise<UpcomingAppointmentDto[]> {
    const appointments = await prisma.appointment.findMany({
      where: {
        agencyId,
        date: { gte: new Date() },
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
        isDeleted: false,
      },
      include: {
        envoi: {
          // Adjusted to include envoiId or correct property
          include: { client: true },
        },
      },
      orderBy: { date: "asc" },
      take: 3,
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      client: appointment.envoiId ? "Client lié à envoiId" : "Client inconnu", // Adjusted to use envoiId
      date: appointment.date.toISOString().split("T")[0],
      time: appointment.date.toTimeString().slice(0, 5),
      type: "Dépôt colis",
    }));
  }

  static async getAgencyAlerts(agencyId: number): Promise<SystemAlertDto[]> {
    const alerts: SystemAlertDto[] = [];

    // Vérifier les RDV en attente
    const pendingAppointments = await this.getUpcomingAppointments(agencyId);
    if (pendingAppointments > 5) {
      alerts.push({
        type: "warning",
        message: `${pendingAppointments} rendez-vous en attente`,
      });
    }

    // Vérifier les envois en attente
    const pendingShipments = await this.getPendingShipments(agencyId);
    if (pendingShipments > 10) {
      alerts.push({
        type: "info",
        message: `${pendingShipments} envois en attente de traitement`,
      });
    }

    // Message de succès par défaut
    if (alerts.length === 0) {
      alerts.push({
        type: "success",
        message: "Toutes les opérations de l'agence sont à jour",
      });
    }

    return alerts;
  }

  /**
   * ACCOUNTANT - Méthodes financières
   */

  static async getUnpaidShipments(): Promise<number> {
    return await prisma.envoi.count({
      where: {
        paid: false,
        isDeleted: false,
      },
    });
  }

  static async getMonthlyRevenues(): Promise<MonthlyRevenueDto[]> {
    const monthlyRevenues: MonthlyRevenueDto[] = [];
    const months = ["Oct", "Nov", "Déc", "Jan"];

    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const result = await prisma.payment.aggregate({
        where: {
          status: PaymentStatus.PAID,
          isDeleted: false,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: { amount: true },
      });

      monthlyRevenues.push({
        month: months[3 - i],
        revenue: result._sum.amount || 0,
      });
    }

    return monthlyRevenues;
  }

  static async getPendingPayments(): Promise<number> {
    return await prisma.payment.count({
      where: {
        status: PaymentStatus.PENDING,
        isDeleted: false,
      },
    });
  }

  static async getFailedPayments(): Promise<number> {
    return await prisma.payment.count({
      where: {
        status: PaymentStatus.FAILED,
        isDeleted: false,
      },
    });
  }

  static async getRecentTransactions(): Promise<RecentTransactionDto[]> {
    const payments = await prisma.payment.findMany({
      where: { isDeleted: false },
      include: {
        envoi: {
          include: {
            departureAgency: true,
            client: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return payments.map((payment) => ({
      id: payment.id,
      client:
        payment.envoi?.client?.name ||
        payment.envoi?.departureAgency?.name ||
        "Client inconnu",
      amount: payment.amount,
      date: payment.createdAt.toISOString().split("T")[0],
      status: payment.status.toLowerCase(),
      type: "Paiement envoi",
    }));
  }

  static async getFinancialAlerts(): Promise<SystemAlertDto[]> {
    const alerts: SystemAlertDto[] = [];

    // Vérifier les paiements échoués
    const failedPayments = await this.getFailedPayments();
    if (failedPayments > 0) {
      alerts.push({
        type: "warning",
        message: `${failedPayments} paiements échoués nécessitent une attention`,
      });
    }

    // Vérifier les paiements en attente
    const pendingPayments = await this.getPendingPayments();
    if (pendingPayments > 10) {
      alerts.push({
        type: "info",
        message: `${pendingPayments} paiements en attente de traitement`,
      });
    }

    // Message de succès par défaut
    if (alerts.length === 0) {
      alerts.push({
        type: "success",
        message: "Tous les paiements sont à jour",
      });
    }

    return alerts;
  }
}
