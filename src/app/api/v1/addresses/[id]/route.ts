import {NextRequest, NextResponse} from "next/server";
import {addressSchema} from "@/app/utils/validationSchema";
import { UpdateAddressDto} from "@/app/utils/dtos";
import prisma from "@/app/utils/db";
import {errorHandler} from "@/app/utils/handelErrors";
import {Address} from "@prisma/client";

interface Props {
    params: {
        id: string;
    }
}

/**
 * @method GET
 * @route /api/v1/addresses/:id
 * @desc Get single address by id
 * @access public
 */
export async function GET(request: NextRequest, {params}: Props) {
    try {
        // // on récupère l'adresse avec l'id passé en paramètre
        const address : Address |null = await prisma.address.findUnique({
            where: {
                id: parseInt(params.id)
            }

        })

        if(!address){
            return errorHandler("No address found", 404);
        }

        // si aucune adresse n'est trouvée, on renvoie une erreur
        return NextResponse.json({message:"Address updated successfully", address: address},{status:201});

        // si une erreur survient, on renvoie une erreur

    } catch (error) {
        // si une erreur survient, on renvoie une erreur
        return errorHandler("Internal server error" , 500);
    }
}



/**
 * @method PUT
 * @route /api/v1/addresses/:id
 * @desc Update single address by id
 * @access public
 */
export async function PUT(request: NextRequest, {params}: Props) {
    try {
        // récupérer le body de la requête et le transformer en adresse DTO
        const address : Address | null = await prisma.address.findUnique({
            where: {id: parseInt(params.id)}
        })

        if(!address){
            return errorHandler("No address found", 404);
        }
        const body = (await request.json()) as UpdateAddressDto;

        const updatedAddress = await prisma.address.update({
            where: {
                id: parseInt(params.id)
            },
            data: {
                street: body.street,
                number: body.number,
                city: body.city,
                zipCode: body.zipCode,
                country: body.country
            }
        });

        return NextResponse.json({message:"Address updated successfully", address: updatedAddress},{status:201});

    } catch (error) {
        // si une erreur survient, on renvoie une erreur
        return errorHandler("Internal server error" , 500);
    }
}



