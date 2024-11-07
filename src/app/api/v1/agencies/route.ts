// path: src/app/api/v1/agencies/route.ts

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/utils/db";

/**
 * @method GET
 * @route /api/v1/agencies?city=CityName
 * @desc Get agencies for a given city
 * @access public
 */
export async function GET(req: NextRequest) {
    try {
        const city = req.nextUrl.searchParams.get('city');
        if (!city) {
            return NextResponse.json({ error: "City is required" }, { status: 400 });
        }

        // Récupérer les agences pour la ville spécifiée en paramètre
        const agencies = await prisma.agency.findMany({
            where: {
                address: {
                    city: city,
                },
            },
            select: {
                id: true,
                name: true,
                address: {
                    select: {
                        city: true,
                        country: true,
                    },
                },
            },
        });

        if (!agencies) {
            return NextResponse.json({ error: 'No agencies found' }, { status: 404 });
        }

        return NextResponse.json(agencies, { status: 200 });

    } catch (error) {
        console.error('Error fetching agencies:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
