// path: src/app/api/v1/agencies/findAgency/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {getAgencyIdByCountryAndCityAndAgencyName} from "@/services/backend-services/Bk_AgencyService";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    console.log("GET request received in agencies/find route");
    if (request.method === "POST") {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }
    try {
        // get city, country and agency name from url params
        const searchParams = request.nextUrl.searchParams;
        const country = searchParams.get('country');
        const city = searchParams.get('city');
        const agencyName = searchParams.get('agency_name');

        console.log("log ====> country in findAgency route: ", country);
        console.log("log ====> city in findAgency route: ", city);
        console.log("log ====> agencyName in findAgency route: ", agencyName);

        if (!country || !city || !agencyName) {
            return NextResponse.json({error: 'Invalid request'}, {status: 400});
        }
        // send data to backend-services/Bk_AgencyService.ts to find the agency
        // based on country, city and agency name
        const agencyId = await getAgencyIdByCountryAndCityAndAgencyName(country, city, agencyName);

        if (!agencyId) {
            return NextResponse.json({error: 'Agency not found'}, {status: 404});
        }

        return NextResponse.json(
            {agencyId: agencyId},
            {status: 200}
        );

    } catch (error) {
        console.error("Error getting agency:", error);
        return NextResponse.json({error: 'Failed to get agency'}, {status: 500});
    }
}
