import { AgencyAdminDashboardSummary } from "@/services/dtos/admins/DashboardSummaryDto";
import {
  AppointmentStatusDto,
  PaymentStatusDto,
  RoleDto,
} from "@/services/dtos/enums/EnumsDto";
import { prisma } from "@/utils/db";
// import { prisma } from "@/lib/prisma";

export async function getAgencyAdminSummary(
  userId: string
): Promise<AgencyAdminDashboardSummary> {
  const userIdInt = parseInt(userId);

  // Récupérer l'agence de l'admin
  const agencyStaff = await prisma.agencyStaff.findFirst({
    where: {
      staffId: userIdInt,
      staffRole: RoleDto.AGENCY_ADMIN,
    },
    include: {
      agency: true,
    },
  });

  if (!agencyStaff) {
    throw new Error("Agency not found for this admin");
  }

  const agencyId = agencyStaff.agencyId;
  const currentDate = new Date();

  const [myShipments, agencyRevenueResult, upcomingAppointments, clientsCount] =
    await Promise.all([
      // Envois de cette agence (départ)
      prisma.envoi.count({
        where: {
          departureAgencyId: agencyId,
          isDeleted: false,
        },
      }),

      // Revenus de l'agence via les paiements des envois
      prisma.payment.aggregate({
        where: {
          status: PaymentStatusDto.PAID,
          isDeleted: false,
          envoi: {
            departureAgencyId: agencyId,
          },
        },
        _sum: { amount: true },
      }),

      // RDV à venir pour cette agence
      prisma.appointment.count({
        where: {
          agencyId: agencyId,
          date: {
            gte: currentDate,
          },
          status: {
            in: [AppointmentStatusDto.PENDING, AppointmentStatusDto.CONFIRMED],
          },
          isDeleted: false,
        },
      }),

      // Clients liés à cette agence
      prisma.agencyClients.count({
        where: {
          agencyId: agencyId,
        },
      }),
    ]);

  return {
    role: "AGENCY_ADMIN",
    myShipments,
    agencyRevenue: agencyRevenueResult._sum.amount || 0,
    upcomingAppointments,
    clientsCount,
  };
}
