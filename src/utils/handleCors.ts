// Path: src/utils/handleCors.ts
import {NextResponse} from 'next/server';
import {setCorsHeaders} from './cors';

export function handleOptionsRequest(req: Request): NextResponse {
    const origin = req.headers.get('origin') || '';
    const corsHeaders = setCorsHeaders(origin);

    if (!corsHeaders) {
        return new NextResponse(JSON.stringify({error: 'Origine non autorisée'}), {status: 403});
    }

    return new NextResponse(null, {
        headers: corsHeaders,
        status: 204,
    });
}
