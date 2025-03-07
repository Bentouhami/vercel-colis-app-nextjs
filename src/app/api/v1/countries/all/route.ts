// path: src/app/api/v1/countries/all/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {getAllCountries} from "@/services/backend-services/Bk_CountryService";

/**
 * @method GET
 * @route /api/v1/countries/all
 * @desc Get all countries
 * @access public
 */

export async function GET(req: NextRequest) {

    if (req.method !== 'GET') {
        console.log("Method not allowed");
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }
    try {
        console.log("GET request received in path: src/app/api/v1/countries/all/route.ts");

        const countries = await getAllCountries();

        if (!countries) {
            return NextResponse.json({error: "No countries found"}, {status: 404});
        }
        return NextResponse.json(countries, {status: 200});
    } catch (error) {
        console.error("Erreur dans l'API countries:", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}
