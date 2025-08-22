import { SuperAdminDashboardSummaryBackend } from "@/services/dtos/admins/DashboardSummaryDto";
import { prisma } from "@/lib/prisma";
import { PaymentStatus, Role } from "@prisma/client";

export async function getSuperAdminSummary(): Promise<SuperAdminDashboardSummaryBackend> {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const [
    totalAgencies,
    totalClients,
    totalRevenueResult,
    activeAdmins,
    shipmentsThisMonth,
  ] = await Promise.all([
    // Total des agences actives
    prisma.agency.count({
      where: { isDeleted: false },
    }),

    // Total des clients
    prisma.user.count({
      where: {
        role: Role.CLIENT,
        isDeleted: false,
      },
    }),

    // Revenus totaux via les paiements (utilise Payment.amount)
    prisma.payment.aggregate({
      where: {
        status: PaymentStatus.PAID,
        isDeleted: false,
      },
      _sum: { amount: true },
    }),

    // Admins d'agence actifs
    prisma.user.count({
      where: {
        role: Role.AGENCY_ADMIN,
        isActive: true,
        isDeleted: false,
      },
    }),

    // Envois de ce mois
    prisma.envoi.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth,
        },
        isDeleted: false,
      },
    }),
  ]);

  return {
    role: "SUPER_ADMIN",
    totalAgencies,
    totalClients,
    totalRevenue: totalRevenueResult._sum.amount || 0, // Utilise amount du modèle Payment
    activeAdmins,
    shipmentsThisMonth,
  };
}
