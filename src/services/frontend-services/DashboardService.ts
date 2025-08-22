import axiosInstance from "@/utils/axiosInstance";
import { SuperAdminStats } from "@/services/dtos/admins/DashboardSummaryDto";

export const getSuperAdminDashboardData =
  async (): Promise<SuperAdminStats> => {
    const response = await axiosInstance.get("/api/v1/dashboard/super-admin");
    return response.data;
  };
