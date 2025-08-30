// path: src/app/api/v1/dashboard/monthly-summary/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/auth";
import { prisma } from "@/utils/db";
import { RoleDto } from "@/services/dtos/enums/EnumsDto";

// Returns last 30 days summary keyed by YYYY-MM-DD
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const role = session?.user?.role as RoleDto | undefined;
    if (!role || ![RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT].includes(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 29); // include today
    start.setHours(0, 0, 0, 0);

    // Aggregate paid payments per day
    const payments = await prisma.payment.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: start, lte: today },
        isDeleted: false,
      },
      select: { amount: true, createdAt: true },
    });

    // Count new clients per day
    const clients = await prisma.user.findMany({
      where: {
        role: "CLIENT",
        createdAt: { gte: start, lte: today },
        isDeleted: false,
      },
      select: { createdAt: true },
    });

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const makeKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const result: Record<string, { totalAmount: number; totalTtcAmount: number; totalCustomers: number }> = {};

    // Initialize all days to zero
    for (let i = 0; i < 30; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      result[makeKey(d)] = { totalAmount: 0, totalTtcAmount: 0, totalCustomers: 0 };
    }

    payments.forEach((p) => {
      const key = makeKey(new Date(p.createdAt));
      if (!result[key]) result[key] = { totalAmount: 0, totalTtcAmount: 0, totalCustomers: 0 };
      result[key].totalAmount += p.amount;
      result[key].totalTtcAmount += p.amount; // TTC same as amount for now
    });

    clients.forEach((c) => {
      const key = makeKey(new Date(c.createdAt));
      if (!result[key]) result[key] = { totalAmount: 0, totalTtcAmount: 0, totalCustomers: 0 };
      result[key].totalCustomers += 1;
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("monthly-summary error", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

