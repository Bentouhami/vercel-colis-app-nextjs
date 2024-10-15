// path: src/app/api/v1/simulation


import {NextRequest, NextResponse} from 'next/server';
import {prisma} from "@/utils/db";

/**
 * @method GET
 * @route /api/v1/simulation
 * @desc Get distinct countries with agencies
 * @access public
 */
// Récupérer les pays avec des agences associées pour la simulation (utilisé pour le formulaire de simulation)
export async function GET() {
    try {
        // Récupérer les adresses avec des agences associées
        const countries = await prisma.address.findMany({
            where: {
                Agency: {
                    // Vérifier qu'il y a une agence associée à cette adresse
                    isNot: null,
                },
            },
            select: {
                id: true, // id de l'adresse
                country: true,
            },

            distinct: ["country"],
        });

        // Retourner les pays distincts
        return NextResponse.json(countries, {status: 200});

    } catch (error) {
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

/**
 * @method POST
 * @route /api/v1/simulation
 * @desc Get distinct destination countries with agencies by departure country (used for a simulation form)
 * @access public
 */
// Récupérer les pays avec des agences associées pour la simulation (utilisé pour le formulaire de simulation)
export async function POST(request: NextRequest) {

    try {
        const {departureCountry} = await request.json();
        if (!departureCountry || departureCountry === '') {
            // Récupérer les adresses avec des agences associées
            const countries = await prisma.address.findMany({
                where: {
                    Agency: {
                        // Vérifier qu'il y a une agence associée à cette adresse
                        isNot: null, // Vérifier qu'il y a une agence associée à cette adresse
                    },
                },
                select: {
                    id: true, // id de l'adresse
                    country: true,
                },
                distinct: ["country"],
            });

            // Retourner les pays distincts
            return NextResponse.json(countries, {status: 200});
        } else {
            // Récupérer les adresses avec des agences associées
            const countries = await prisma.address.findMany({
                where: {
                    Agency: {
                        // Vérifier qu'il y a une agence associée à cette adresse
                        isNot: null, // Vérifier qu'il y a une agence associée à cette adresse
                    },
                    country: {
                        not: departureCountry
                    },
                },
                select: {
                    id: true, // id de l'adresse
                    country: true,
                },

                distinct: ["country"],
            });

            // Retourner les pays distincts
            return NextResponse.json(countries, {status: 200});
        }
    } catch (error) {
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}
