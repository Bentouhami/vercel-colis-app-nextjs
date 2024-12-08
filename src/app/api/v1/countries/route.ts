// path: src/app/api/v1/countries/route.ts

import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/utils/db";

/**
 * @method GET
 * @route /api/v1/countries
 * @desc Get distinct countries with agencies, optionally filtering by departureCountry
 * @access public
 */
export async function GET(req: NextRequest) {
    try {
        // Extraire le paramètre de la query string
        const departureCountry = req.nextUrl.searchParams.get('departureCountry');

        // Construire la requête Prisma
        const countries = await prisma.address.findMany({
            where: {
                Agency: {isNot: null},
                ...(departureCountry && {country: {not: departureCountry}}),
            },
            select: {
                id: true,
                country: true,
            },
            distinct: ["country"],
        });

        return NextResponse.json(countries, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}
