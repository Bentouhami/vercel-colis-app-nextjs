// path: src/app/api/v1/cities/route.ts

export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/utils/db";

/**
 * @method GET
 * @route /api/v1/cities?country=CountryID
 * @desc Get cities that have an agency for a given country
 * @access public
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
