// path: src/app/api/v1/agencies/update-agency/route.ts

import {NextRequest, NextResponse} from "next/server";
import {updateAgency} from "@/services/backend-services/Bk_AgencyService";
import { UpdateAgencyDto, AgencyDto } from "@/services/dtos"; // Import DTOs

/**
 * Update an existing agency
 * @description Updates an existing agency record in the database.
 * @body UpdateAgencyDto
 * @response 200:AgencyDto:Agency updated successfully
 * @response 400:{ error: string }:Agency data not found
 * @response 405:{ error: string }:Method not allowed
 * @response 500:{ error: string }:Failed to update agency
 * @openapi
 */
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

        return NextResponse.json(updatedAgency, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Failed to update agency'}, {status: 500});
    }
}