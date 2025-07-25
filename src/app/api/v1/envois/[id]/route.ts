// path: src/app/api/v1/envois/[id]/route.ts

import {NextRequest, NextResponse} from 'next/server';
import { getPaymentSuccessDataById, updateEnvoi} from "@/services/backend-services/Bk_EnvoiService";

/**
 * Update an envoi
 * @param req
 * @param props
 * @returns
 */
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    if (req.method !== 'PUT') {
        return NextResponse.json("Not allowed method!")
    }

    try {
        const envoiId = parseInt(params.id, 10);
        if (isNaN(envoiId)) {
            return NextResponse.json(
                {error: 'Invalid envoi ID provided.'},
                {status: 400}
            );
        }

        // Update envoi in the database
        const updatedEnvoi = await updateEnvoi(envoiId);
        if (!updatedEnvoi) {
            return NextResponse.json(
                {error: 'Envoi not found.'},
                {status: 404}
            );
        }

        return NextResponse.json(updatedEnvoi, {status: 200});
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
 * @param props
 * */

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    if (req.method !== 'GET') {
        return NextResponse.json("Not allowed method!")
    }
    try {
        const envoiId = parseInt(params.id, 10);

        if (!envoiId || isNaN(envoiId)) {
            return NextResponse.json(
                {error: 'Invalid envoi ID provided.'},
                {status: 400}
            );
        }

        // Get envoi from the database
        const envoi = await getPaymentSuccessDataById(envoiId);

        if (!envoi) {
            return NextResponse.json(
                {error: 'Envoi not found.'},
                {status: 404}
            );
        }
        return NextResponse.json(envoi, {status: 200});
    } catch (error) {
        console.error('Error getting envoi:', error);
        return NextResponse.json(
            {error: 'Internal server error.'},
            {status: 500}
        );
    }
}