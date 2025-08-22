import { NextResponse } from "next/server";
import { AdminDashboardService } from "@/services/backend-services/AdminDashboardService";

export async function GET() {
  try {
    const stats = await AdminDashboardService.getSuperAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error in GET /api/v1/dashboard/super-admin:", error);
    return NextResponse.json(
      { message: "Failed to fetch super admin dashboard data" },
      { status: 500 }
    );
  }
}
