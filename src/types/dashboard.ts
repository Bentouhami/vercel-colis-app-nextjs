export interface SuperAdminDashboardData {
    totalAgencies: number;
    totalClients: number;
    totalRevenue: number;
    activeAdmins: number;
    monthlyShipments: number;
    monthlyGrowth: number;
    recentAgencies: {
        id: string;
        name: string;
        clients: number;
        revenue: number;
        status: string;
        admins: number;
    }[];
    systemAlerts: {
        type: "warning" | "info" | "success" | "error";
        message: string;
    }[];
}