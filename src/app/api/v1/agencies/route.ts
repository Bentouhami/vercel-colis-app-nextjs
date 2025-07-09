// path: src/app/api/v1/agencies/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/utils/db";

/**
 * @method GET
 * @route /api/v1/agencies?city=CityID
 * @desc Get agencies for a given city
 * @access public
 */
export async function GET(req: NextRequest) {
    try {
        const cityId = req.nextUrl.searchParams.get('city'); // Ensure city ID is received
        if (!cityId) {
            return NextResponse.json({ error: "City ID is required" }, { status: 400 });
        }


        // Fetch agencies for the selected city
        const agencies = await prisma.agency.findMany({
            where: {
                address: {
                    cityId: Number(cityId),
                },
            },
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            }
        });

        if (!agencies || agencies.length === 0) {
            return NextResponse.json({ error: 'No agencies found' }, { status: 404 });
        }


        return NextResponse.json(agencies, { status: 200 });

    } catch (error) {
        console.error(' Error fetching agencies:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

