// path: src/app/api/v1/agencies/findAgency/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";

type FindAgencyQueryParams = {
    country: number; // ID of the country
    city: string; // Name of the city
    agency_name: string; // Name of the agency
};

/**
 * Find agency ID by details
 * @description Finds the ID of an agency by its name, city, and country.
 * @params FindAgencyQueryParams
 * @response 200:{ agencyId: number }:Agency ID found
 * @response 400:{ error: string }:Missing or invalid parameters
 * @response 404:{ error: string }:Agency not found
 * @response 500:{ error: string }:Internal server error
 * @openapi
 */
export async function GET(req: NextRequest) {
    // Extract query parameters
    const countryParam = req.nextUrl.searchParams.get("country");
    const cityParam = req.nextUrl.searchParams.get("city");
    const agencyName = req.nextUrl.searchParams.get("agency_name");

    if (!countryParam || !cityParam || !agencyName) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const countryId = Number(countryParam);
    if (isNaN(countryId)) {
        return NextResponse.json({ error: "Invalid country id" }, { status: 400 });
    }

    try {
        const agency = await prisma.agency.findFirst({
            where: {
                name: agencyName,
                address: {
                    city: {
                        name: cityParam,
                        country: { id: countryId },
                    },
                },
            },
            select: { id: true },
        });

        if (!agency) {
            return NextResponse.json({ error: "Agency not found" }, { status: 404 });
        }
        return NextResponse.json({ agencyId: agency.id }, { status: 200 });
    } catch (error) {
        console.error("Error in findAgency route:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
