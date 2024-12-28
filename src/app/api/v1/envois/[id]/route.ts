// path: src/app/api/v1/envois/[id]/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {getEnvoiById, updateEnvoi} from "@/services/backend-services/Bk_EnvoiService";

/**
 * Update an envoi
 * @param req
 * @param res
 * @returns
 */
export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } } // Correct way to get params in Next.js App Router
) {

    if (req.method !== 'PUT') {
        return NextResponse.json("Not allowed method!")
    }

    try {

        console.log("log ====> req in PUT request received to update the envoi after successful payment in path: src/app/api/v1/envois/[id]/route.ts is : ", req);

        const envoiId = parseInt(params.id, 10); // Ensure the ID is parsed as an integer
        if (isNaN(envoiId)) {
            return NextResponse.json(
                {error: 'Invalid envoi ID provided.'},
                {status: 400}
            );
        }

        console.log("log ====> envoiId in PUT request received to update the envoi after successful payment in path: src/app/api/v1/envois/[id]/route.ts is : ", envoiId);

        // Update envoi in the database
        const updatedEnvoi = await updateEnvoi(envoiId);

        if (!updatedEnvoi) {
            console.log("log ====> updatedEnvoi not found in updateEnvoi function in path: src/app/api/v1/envois/[id]/route.ts is : ", updatedEnvoi);
            return NextResponse.json(
                {error: 'Envoi not found.'},
                {status: 404}
            );
        }

        console.log("log ====> updatedEnvoi in updateEnvoi function in path: src/app/api/v1/envois/[id]/route.ts is : ", updatedEnvoi); 

        return NextResponse.json({envoi: updatedEnvoi}, {status: 200});
    } catch (error) {
        console.error('Error updating envoi:', error);
        return NextResponse.json(
            {error: 'Internal server error.'},
            {status: 500}
        );
    }
}

/**
 * Get and envoi by id
 * @param req
 * @param res
 * */

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } } // Correct way to get params in Next.js App Router
) {
    if (req.method !== 'GET') {
        return NextResponse.json("Not allowed method!")
    }

    try {
        console.log("log ====> req in GET request received to get the envoi after successful payment in path: src/app/api/v1/envois/[id]/route.ts is : ", req);

        const envoiId = parseInt(params.id, 10); // Ensure the ID is parsed as an integer
        // if (isNaN(envoiId)) {
        //     return NextResponse.json(
        //         {error: 'Invalid envoi ID provided.'},
        //         {status: 400}
        //     );
        // }

        console.log("log ====> envoiId in GET request received to get the envoi after successful payment in path: src/app/api/v1/envois/[id]/route.ts is : ", envoiId);

        // Get envoi from the database
        const envoi = await getEnvoiById(envoiId);

        if (!envoi) {
            return NextResponse.json(
                {error: 'Envoi not found.'},
                {status: 404}
            );
        }
        return NextResponse.json({envoi: envoi}, {status: 200});
    } catch (error) {
        console.error('Error getting envoi:', error);
        return NextResponse.json(
            {error: 'Internal server error.'},
            {status: 500}
        );
    }
}