// path: src/app/api/v1/agencies/get-agency-by-id/route.ts

import {getAgencyById} from "@/services/backend-services/Bk_AgencyService";

export const dynamic = 'force-dynamic';
import {NextRequest, NextResponse} from 'next/server';
import {RoleDto} from "@/services/dtos";
import {auth} from "@/auth/auth";


/**
 * @method GET
 * @route /api/v1/agencies/get-agency-by-id
 * @desc Get agency by id
 * @access public
 */
export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    // check the connected user has the role of AGENCY_ADMIN or SUPER_ADMIN
    const session = await auth();
    const user = session?.user;
    if (!user) {
        return NextResponse.json({error: "You must be connected to get your agency"}, {status: 401});
    }
    if (user.role !== RoleDto.AGENCY_ADMIN && user.role !== RoleDto.SUPER_ADMIN) {
        return NextResponse.json({error: "You don't have the right to get your agency"}, {status: 403});
    }

    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({error: "Agency ID is required"}, {status: 400});
        }

        // Récupérer l'agence avec l'ID spécifié
        const agency = await getAgencyById(Number(id));

        if (!agency) {
            return NextResponse.json({error: 'Agency not found'}, {status: 404});
        }

        return NextResponse.json(agency, {status: 200});

    } catch (error) {
        console.error('Error fetching agency by id:', error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}