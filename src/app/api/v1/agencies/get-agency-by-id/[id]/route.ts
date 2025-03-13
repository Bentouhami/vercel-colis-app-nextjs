// path: src/app/api/v1/agencies/get-agency-by-id/[id]/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {getAgencyById} from "@/services/backend-services/Bk_AgencyService";

export async function GET(request: NextRequest, {params}: { params: { id: string } }) {
    if (request.method !== 'GET') {
        return new NextResponse('Method not allowed', {
            status: 405,
        })
    }

    // get the agency id from params
    const agencyId = parseInt(params.id, 10);
    if (!agencyId) {
        return new NextResponse('Invalid agency id', {
            status: 400,
        })
    }

    try {
        const agency = await getAgencyById(agencyId);
        if (!agency) {
            return new NextResponse('Agency not found', {
                status: 404,
            })
        }

        return NextResponse.json(agency, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        })
    } catch (error) {
        return new NextResponse('Error fetching agency', {
            status: 500,
        })
    }
}