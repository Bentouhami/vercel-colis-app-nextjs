import {NextRequest, NextResponse} from 'next/server';
import {errorHandler} from "@/utils/handelErrors";
import {prisma} from "@/utils/db";

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
                id: true,
                name: true,

            }
        });

        if (!agencies || agencies.length === 0) {
            return errorHandler("No agencies found", 404);
        }
        // récupérer les noms des agences dans un tableau

        return NextResponse.json(agencies, { status: 200 });
    } catch (error) {
        return errorHandler("Internal server error", 500);
    }
}
