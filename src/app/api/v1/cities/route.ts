// path: src/app/api/v1/cities/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/utils/db";

/**
 * @method GET
 * @route /api/v1/cities?country=CountryName
 * @desc Get cities for a given country
 * @access public
 */
export async function GET(req: NextRequest) {
    try {
        const country = req.nextUrl.searchParams.get('country');
        if (!country) {
            return NextResponse.json({ error: "Country is required" }, { status: 400 });
        }

        const cities = await prisma.address.findMany({
            where: {
                country: country,
                Agency: { isNot: null },
            },
            select: {
                id: true,
                city: true,
            },
            distinct: ["city"],
        });

        return NextResponse.json(cities, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
