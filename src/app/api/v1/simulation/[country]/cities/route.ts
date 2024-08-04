import {errorHandler} from "@/app/utils/handelErrors";
import {prisma} from "@/app/utils/db";
import {NextRequest, NextResponse} from "next/server";


/**
 * @method GET
 * @route /api/v1/simulation/:country/cities
 * @desc Get cities with agencies in a specific country
 * @access public
 *
 */

export async function GET(request: NextRequest, {params}: { params: { country: string } }) {
    try {
        const country = decodeURIComponent(params.country);

        if (!country) {
            return errorHandler("Country is required", 400);
        }

        // Récupérer les addresses des agences dans le pays donné
        const cities = await prisma.address.findMany({
            where: {
                country: country,
                Agency: {
                    isNot: null,
                }
            },
            select: {
                id: true, // id de l'adresse
                city: true
            }
        });

        if (!cities || cities.length === 0) {
            return errorHandler("No addresses found", 404);
        }
        //
        // const citiesSet = new Set(addresses.map(address => address.city));

        // const cities = Array.from(addresses);
        // on renvoie les pays
        return NextResponse.json(cities, {status: 200});
    } catch (error) {
        return errorHandler(
            "Internal server error",
            500);
    }
}