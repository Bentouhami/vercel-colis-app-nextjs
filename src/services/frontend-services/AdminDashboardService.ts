import {
  DashboardSummaryDto,
  AgencyDashboardDto,
  AccountantDashboardDto,
} from "@/services/dtos/admin/DashboardDto";

export class AdminDashboardService {
  private static readonly BASE_URL = "/api/v1/admin/dashboard";

  static async getDashboardData(): Promise<
    DashboardSummaryDto | AgencyDashboardDto | AccountantDashboardDto
  > {
    try {
      const response = await fetch(this.BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données du dashboard:",
        error
      );
      throw new Error("Impossible de récupérer les données du dashboard");
    }
  }

  static async refreshDashboard(): Promise<
    DashboardSummaryDto | AgencyDashboardDto | AccountantDashboardDto
  > {
    // Force un refresh en ajoutant un timestamp
    const timestamp = new Date().getTime();

    try {
      const response = await fetch(`${this.BASE_URL}?refresh=${timestamp}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors du refresh du dashboard:", error);
      throw new Error("Impossible de rafraîchir les données du dashboard");
    }
  }
}
