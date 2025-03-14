// path: src/app/api/v1/agencies/update-agency/route.ts

/**
 * This route is used to update an existing agency in the database.
 * It takes the agency data as a JSON payload and updates the corresponding agency in the database.
 * If the agency is not found, it returns a 404 error.
 * If the update operation fails, it returns a 500 error.
 * @param req - The incoming request object
 * @param res - The outgoing response object
 */

import {NextRequest, NextResponse} from "next/server";
import {updateAgency} from "@/services/backend-services/Bk_AgencyService";

export async function PUT(req: NextRequest) {
    if (req.method !== 'PUT') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    try {
        // Get agency data from the request body
        const agencyData = await req.json();

        if (!agencyData) {
            return NextResponse.json({error: 'Agency data not found'}, {status: 400});
        }

        // Call the updateAgency function to update the agency
        const updatedAgency = await updateAgency(agencyData);

        if (!updatedAgency) {
            return NextResponse.json({error: 'Failed to update agency'}, {status: 500});
        }

        console.log("🚀 Agency updated successfully in api route path api/v1/agencies/update-agency :", updatedAgency);

        return NextResponse.json(updatedAgency, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Failed to update agency'}, {status: 500});
    }
}