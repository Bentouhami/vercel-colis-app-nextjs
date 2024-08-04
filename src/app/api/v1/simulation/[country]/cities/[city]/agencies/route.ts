import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from "@/app/utils/handelErrors";
import {prisma} from "@/app/utils/db";

/**
 * @method GET
 * @route /api/v1/simulation/[country]/cities/[city]/agencies
 * @desc Get agencies in a specific city
 * @access public
 */
export async function GET(request: NextRequest, { params }: { params: { country: string, city: string } }) {
    try {
        const country = decodeURIComponent(params.country);
        const city = decodeURIComponent(params.city);

        if (!country || !city) {
            return errorHandler("Country and city are required", 400);
        }

        const agencies = await prisma.agency.findMany({
            where: {
                Address: {
                    country: country,
                    city: city
                }
            },

            select: {
                id: true, // id de l'agence
                name: true,

            }
        });

        if (!agencies || agencies.length === 0) {
            return errorHandler("No agencies found", 404);
        }
        // récupérer les noms des agences dans un tableau
        // const agenciesNames = agencies.map(agency => agency.name);
        return NextResponse.json(agencies, { status: 200 });
    } catch (error) {
        return errorHandler("Internal server error", 500);
    }
}
