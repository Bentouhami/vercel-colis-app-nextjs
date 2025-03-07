// path: src/app/api/v1/agencies/admin-agencies/[id]/route.ts

import {NextRequest, NextResponse} from 'next/server'
import {getAgenciesByAdminId} from "@/services/backend-services/Bk_AgencyService";


export async function GET(request: NextRequest, {params}: { params: { id: string } }) {
    if (request.method !== 'GET') {
        return new NextResponse('Method not allowed', {
            status: 405,
        })
    }

    // get the user admin id from params
    const userAdminId = Number(params.id);
    if (!userAdminId) {
        return new NextResponse('Invalid user admin id', {
            status: 400,
        })
    }

    try {
        const agencies = await getAgenciesByAdminId(userAdminId);
        if (!agencies) {
            console.log("log ====> agencies is null in src/app/api/v1/agencies/admin-agencies/[id]/route.ts");

            return new NextResponse('Agency not found', {
                status: 404,
            })
        }

        console.log("log ====> agencies in src/app/api/v1/agencies/admin-agencies/[id]/route.ts: ", agencies);

        return NextResponse.json(agencies, {
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
export const dynamic = 'force-dynamic'


