// path: src\app\api\v1\dashboard\super-admin\route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { AdminDashboardService } from "@/services/backend-services/AdminDashboardService";

/**
 * Get Super Admin dashboard statistics
 * @description Retrieves statistics for the Super Admin dashboard.
 * @response 200:SuperAdminStats:Super Admin dashboard statistics
 * @response 500:{ message: string }:Failed to fetch super admin dashboard data
 * @openapi
 */
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
