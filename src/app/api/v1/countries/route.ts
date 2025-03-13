// path: src/app/api/v1/countries/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

/**
 * @method GET
 * @route /api/v1/countries
 * @desc Get distinct countries with agencies, optionally filtering by departureCountry
 * @access public
 */
export async function GET(req: NextRequest) {
    try {
        // Extract the departureCountry query parameter
        let departureCountry = req.nextUrl.searchParams.get("departureCountry");


        // Ensure departureCountry is a valid integer or null
        const departureCountryId = departureCountry && !isNaN(Number(departureCountry))
            ? Number(departureCountry)
            : null;

        // Build the Prisma query
        const countries = await prisma.city.findMany({
            where: {
                addresses: { some: { agency: { isNot: null } } }, // Ensures the city has an agency
                ...(departureCountryId !== null ? { countryId: { not: departureCountryId } } : {}),
            },
            select: {
                country: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            distinct: ["countryId"], // Ensures unique countries
        });


        return NextResponse.json(countries, { status: 200 });
    } catch (error) {
        console.error("Erreur API countries:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
