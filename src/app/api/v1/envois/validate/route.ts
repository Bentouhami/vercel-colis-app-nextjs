// api/v1/envois/validate/route.ts : Route de validation d'envoi

import {NextRequest, NextResponse} from 'next/server';
import {errorHandler} from "@/app/utils/handelErrors";
import {CreateDestinataireDto, CreateParcelDto, ValidatedEnvoisDto} from "@/app/utils/dtos";
import {verifyToken} from "@/app/utils/verifyToken";

/**
 * @route: POST /api/v1/envois/validate
 * @desc: Validate envoi to the DB
 * @access:private restricted only connected user can access this route
 * @
 */

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        // vérify token and get user id
        const userId = verifyToken(req)?.id; // get user id from token payload if user is connected or null if not connected

        if (!userId) {
            return errorHandler("User not connected", 401);
        }
        // get body data
        const body = await req.json() as ValidatedEnvoisDto;

        // get destinataire data from body
        const destinataire = body.destinataire as CreateDestinataireDto;

        // get packages data from body
        const packages = body.packages as CreateParcelDto[];




    } catch (error) {
        errorHandler("Internal Server Error", 500);
    }
}
