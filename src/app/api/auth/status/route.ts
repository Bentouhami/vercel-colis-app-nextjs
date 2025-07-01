// path: src/app/api/auth/status/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {verifyTokenFromCookies} from '@/utils/verifyToken';


/**
 * Vérifie si l'utilisateur est authentifié et renvoie son token JWT
 * @param request
 * @constructor
 */
export async function GET(request: NextRequest) {
    const cookieName = process.env.COOKIE_NAME || 'auth';
    const token = request.cookies.get(cookieName)?.value || '';

    const userPayload = verifyTokenFromCookies(token);

    if (!userPayload) {
        return NextResponse.json({isAuthenticated: false}, {status: 200});
    }

    return NextResponse.json({
        isAuthenticated: true,
        user: userPayload,
    }, {status: 200});
}
