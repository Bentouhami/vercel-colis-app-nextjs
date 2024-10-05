// path: /src/app/api/v1/auth/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {verifyTokenFromCookies} from '@/utils/verifyToken';

export async function GET(request: NextRequest) {
    const cookieName = process.env.COOKIE_NAME || 'auth';
    const token = request.cookies.get(cookieName)?.value || '';

    const userPayload = verifyTokenFromCookies(token);

    if (!userPayload) {
        return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    return NextResponse.json({
        isAuthenticated: true,
        user: userPayload,
    }, { status: 200 });
}
