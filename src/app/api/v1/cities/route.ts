// path: src/app/api/v1/cities/route.ts

export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/utils/db";
import { CityDto } from "@/services/dtos/cities/CityDto"; // Import CityDto

type CitiesQueryParams = {
    countryId: number; // ID of the country
};

/**
 * Get cities with agencies by country
 * @description Retrieves a list of cities that have an agency for a given country ID.
 * @params CitiesQueryParams
 * @response 200:CityDto[]:List of cities
 * @response 400:{ error: string }:Country ID is required
 * @response 405:{ error: string }:Method not allowed
 * @response 500:{ error: string }:Internal server error
 * @openapi
 */
export async function GET(req: NextRequest) {

    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    try {
        const countryId = req.nextUrl.searchParams.get('countryId');

        if (!countryId) {
            return NextResponse.json({ error: "Country ID is required" }, { status: 400 });
        }


        const cities = await prisma.city.findMany({
            where: {
                countryId: Number(countryId), // Filter cities by country ID
                addresses: {
                    some: { agency: { isNot: null } }, // Only cities with an agency
                },
            },
            select: {
                id: true,
                name: true, // Ensure API returns `{ id, name }`
            },
            orderBy: {
                name: 'asc',
            }
        });


        return NextResponse.json(cities, { status: 200 });
    } catch (error) {
        console.error("Error fetching cities:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
