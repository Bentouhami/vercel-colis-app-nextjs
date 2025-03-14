// path: src/app/api/v1/agencies/create-agency/route.ts

import {NextRequest, NextResponse} from "next/server";
import {createAgency} from "@/services/backend-services/Bk_AgencyService";
import {RoleDto} from "@/services/dtos";
import {auth} from "@/auth/auth";

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    // check the connected user is a super admin
    const session = await auth();

    if (!session) {
        return NextResponse.json({error: 'User not found'}, {status: 401});
    }
    if (session.user.role !== RoleDto.SUPER_ADMIN) {
        return NextResponse.json({error: 'Not permitted for non super admin users'}, {status: 403});
    }

    try {
        // Get agency data from the request body
        const agencyData = await req.json();

        if (!agencyData) {
            return NextResponse.json({error: 'Agency data not found'}, {status: 400});
        }

        const staffId = parseInt(session?.user?.id!, 10);
        // Call the createAgency function to create the agency
        const createdAgency = await createAgency(agencyData, staffId);

        if (!createdAgency) {
            return NextResponse.json({error: 'Failed to create agency'}, {status: 500});
        }

        console.log("🚀 Agency created successfully in api route path api/v1/agencies/create-agency :", createdAgency);

        return NextResponse.json(createdAgency, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Failed to create agency'}, {status: 500});
    }
}