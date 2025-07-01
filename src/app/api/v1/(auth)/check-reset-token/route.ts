// src\app\api\v1\(auth)\check-reset-token\route.ts
import { NextRequest, NextResponse } from "next/server"
import { checkResetToken } from "@/services/backend-services/Bk_AuthService"

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token")
    const isValid = await checkResetToken(token || "")
    return NextResponse.json({ valid: isValid })
}
