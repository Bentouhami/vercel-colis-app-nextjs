// path: src/app/api/v1/transports/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {getTransports} from "@/services/backend-services/Bk_TransportService";
import {updateTransport} from "@/services/backend-services/Bk_TransportService";
import {UpdateTransportRequestDto} from "@/services/dtos";
import {transportSchema} from "@/utils/validationSchema";

export const dynamic = 'force-dynamic';


/**
 * GET methode to fin transports
 * @param request
 * @constructor
 */
export async function GET(request: NextRequest) {
    console.log("GET request received in transports route");

    try {
        // Get transports
        const transports = await getTransports();

        if (!transports) {
            return NextResponse.json({error: 'Failed to get transports'}, {status: 500});
        }

        return NextResponse.json({data: transports, message: "Transports retrieved successfully"}, {status: 200});

    } catch (error) {
        console.error("Error getting transports:", error);
        return NextResponse.json({error: 'Failed to get transports'}, {status: 500});
    }
}


/**
 * PUT method
 * Update a transport
 * @param request - The incoming HTTP request.
 */
export async function PUT(request: NextRequest) {
    console.log("PUT request received in transports route");

    if (request.method !== "PUT") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
        // Parse the request body
        const body = await request.json();

        // Validate the request body using transportSchema
        const validationResult = transportSchema.safeParse(body);

        if (!validationResult.success) {
            // Return validation errors
            return NextResponse.json(
                { error: validationResult.error.errors },
                { status: 400 }
            );
        }

        // Destructure the parsed and validated data
        const validData = validationResult.data;

        // Update the transport in the database
        const updatedTransport = await updateTransport(validData);

        if (!updatedTransport) {
            return NextResponse.json(
                { error: "Transport not found or failed to update" },
                { status: 404 }
            );
        }

        console.log(
            "Updated transport found in PUT request: ",
            updatedTransport
        );

        return NextResponse.json(
            { data: updatedTransport, message: "Transport updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating transport:", error);
        return NextResponse.json({ error: "Failed to update transport" }, { status: 500 });
    }
}