// src\app\api\v1\(auth)\check-reset-token\route.ts
import { NextRequest, NextResponse } from "next/server"
import { checkResetToken } from "@/services/backend-services/Bk_AuthService"

type CheckResetTokenQueryParams = {
    token: string; // The reset password token
};

/**
 * Check reset password token validity
 * @description Checks if a given password reset token is valid.
 * @params CheckResetTokenQueryParams
 * @response 200:{ valid: boolean }:Token validity status
 * @openapi
 */
export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token")
    const isValid = await checkResetToken(token || "")
    return NextResponse.json({ valid: isValid })
}
