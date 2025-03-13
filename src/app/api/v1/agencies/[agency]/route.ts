// path: src/app/api/v1/agencies/[agency]/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {findAgencyByName} from "@/services/backend-services/Bk_AgencyService";


interface Props {
    params: {
        agency: string;
    }
}

export async function GET(req: NextRequest, {params}: Props) {

    try {
        const body = await req.json();

        if (!body) {
            return NextResponse.json({error: 'Invalid request'}, {status: 400});
        }

        const agencyName = body as string;

        const agency = await findAgencyByName(agencyName);

        if (!agency) {
            return NextResponse.json({error: 'Agency not found'}, {status: 404});
        }

        return NextResponse.json(agency.id);

    } catch (error) {
        console.error("Error getting departure agency:", error);
        return NextResponse.json({error: 'Failed to get departure agency id'}, {status: 500});
    }
}