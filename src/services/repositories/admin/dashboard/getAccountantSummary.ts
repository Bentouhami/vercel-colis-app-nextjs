import { AccountantDashboardSummary } from "@/services/dtos/admins/DashboardSummaryDto";
import { PaymentStatusDto } from "@/services/dtos/enums/EnumsDto";
import { prisma } from "@/utils/db";
// import { prisma } from "@/lib/prisma";

export async function getAccountantSummary(): Promise<AccountantDashboardSummary> {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Calculer les 4 derniers mois
  const monthsData = [];
  for (let i = 3; i >= 0; i--) {
    const date = new Date(currentYear, currentDate.getMonth() - i, 1);
    const nextMonth = new Date(currentYear, currentDate.getMonth() - i + 1, 1);

    monthsData.push({
      startDate: date,
      endDate: nextMonth,
      monthName: date.toLocaleDateString("fr-FR", { month: "long" }),
    });
  }

  const [totalRevenueResult, unpaidShipments, ...monthlyRevenueResults] =
    await Promise.all([
      // Revenus totaux
      prisma.payment.aggregate({
        where: {
          status: PaymentStatusDto.PAID,
          isDeleted: false,
        },
        _sum: { amount: true },
      }),

      // Envois non payés
      prisma.envoi.count({
        where: {
          paid: false,
          isDeleted: false,
        },
      }),

      // Revenus par mois (4 derniers mois)
      ...monthsData.map((month) =>
        prisma.payment.aggregate({
          where: {
            status: PaymentStatusDto.PAID,
            isDeleted: false,
            createdAt: {
              gte: month.startDate,
              lt: month.endDate,
            },
          },
          _sum: { amount: true },
        })
      ),
    ]);

  // Construire les données mensuelles
  const revenueByMonth = monthsData.map((month, index) => ({
    month: month.monthName,
    amount: monthlyRevenueResults[index]._sum.amount || 0,
  }));

  // Pour les dépenses, on peut utiliser une logique métier ou un modèle séparé
  // Ici je mets 0 car il n'y a pas de modèle "Expense" dans votre schema
  const expenses = 0;

  return {
    role: "ACCOUNTANT",
    totalRevenue: totalRevenueResult._sum.amount || 0,
    expenses,
    unpaidShipments,
    revenueByMonth,
  };
}
