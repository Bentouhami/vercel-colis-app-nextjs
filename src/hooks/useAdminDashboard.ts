"use client";

import { useState, useEffect } from "react";
import { AdminDashboardService } from "@/services/frontend-services/AdminDashboardService";
import {
  DashboardSummaryDto,
  AgencyDashboardDto,
  AccountantDashboardDto,
} from "@/services/dtos/admin/DashboardDto";

type DashboardData =
  | DashboardSummaryDto
  | AgencyDashboardDto
  | AccountantDashboardDto;

export function useAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await AdminDashboardService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("Erreur lors du chargement du dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    try {
      setError(null);
      const dashboardData = await AdminDashboardService.refreshDashboard();
      setData(dashboardData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors du refresh"
      );
      console.error("Erreur lors du refresh du dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refresh: refreshDashboard,
    refetch: fetchDashboardData,
  };
}
