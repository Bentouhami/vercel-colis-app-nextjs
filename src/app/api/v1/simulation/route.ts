import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

/**
 * @method GET
 * @route /api/v1/simulation
 * @desc Get distinct countries with agencies
 * @access public
 */
export async function GET() {
    try {
        // Récupérer les adresses avec des agences associées
        const addresses = await prisma.address.findMany({
            where: {
                Agency: {
                    // Vérifier qu'il y a une agence associée à cette adresse
                    isNot: null,
                },
            },
            select: {
                country: true,
            },
        });

        // Vérifier les résultats obtenus

        // Obtenir les pays distincts
        const countriesSet = new Set(addresses.map(address => address.country));
        const countries = Array.from(countriesSet);

        // Vérifier les pays distincts

        // Retourner les pays distincts
        return NextResponse.json(countries, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
