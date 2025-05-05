import {NextRequest, NextResponse} from "next/server";
import {errorHandler} from "@/utils/handelErrors";
import {Address} from "@prisma/client";
import prisma from "@/utils/db";

interface Props {
    params: Promise<{
        id: string;
    }>
}

/**
 * @method GET
 * @route.ts /api/v1/addresses/:id
 * @desc Get single address by id
 * @access public
 */
export async function GET(request: NextRequest, props: Props) {
    const params = await props.params;
    try {
        // // on récupère l'adresse avec l'id passé en paramètre
        const address: Address | null = await prisma.address.findUnique({
            where: {
                id: parseInt(params.id)
            }

        })

        if (!address) {
            return errorHandler("No address found", 404);
        }

        // si aucune adresse n'est trouvée, on renvoie une erreur
        return NextResponse.json(
            {message: "address found", address},
            {status: 200});

        // si une erreur survient, on renvoie une erreur

    } catch (error) {
        // si une erreur survient, on renvoie une erreur
        return errorHandler("Internal server error", 500);
    }
}


/**
 * @method PUT
 * @route.ts /api/v1/addresses/:id
 * @desc Update single address by id
 * @access public
 */
export async function PUT(request: NextRequest, props: Props) {
    const params = await props.params;
    if (request.method !== "PUT") {
        return errorHandler("Method not allowed", 405);
    }

    try {
        // récupérer le body de la requête et le transformer en adresse DTO
        const address = await prisma.address.findUnique({
            where: {id: parseInt(params.id)}
        })

        if (!address) {
            return errorHandler("No address found", 404);
        }
        const body = await request.json();

        const updatedAddress = await prisma.address.update({
            where: {
                id: parseInt(params.id)
            },
            data: {
                street: body.street,
                streetNumber: body.number,
                city: body.city,
                cityId: body.cityId,
                boxNumber: body.boxNumber,
                complement: body.complement,
            }
        });

        return NextResponse.json({message: "Address updated successfully", address: updatedAddress}, {status: 201});

    } catch (error) {
        // si une erreur survient, on renvoie une erreur
        return errorHandler("Internal server error", 500);
    }
}



