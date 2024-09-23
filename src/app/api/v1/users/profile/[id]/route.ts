import {NextRequest, NextResponse} from 'next/server';
import {prisma} from "@/app/utils/db";
import {errorHandler} from "@/app/utils/handelErrors";
import {Address, User} from "@prisma/client";
import {verifyToken} from "@/app/utils/verifyToken";
import {UpdateUserProfileDto} from "@/app/utils/dtos";
import {userProfileSchema} from "@/app/utils/validationSchema";

interface Props {
    params: {
        id: string
    }
}

/** @method DELETE
 * @troute GET /api/v1/users/profile/:id
 * @description Delete a user profile
 * @access Private (only the user can delete their own profile)
 */

export async function DELETE(request: NextRequest, {params}: Props) {
    try {
        // get user from db by id
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(params.id)
            }
        }) as User | null;

        // if user not found
        if (!user) {

            return NextResponse.json(
                {error: "User not found"},
                {status: 404}
            );
        }
        // get auth token from header request
        //@ts-ignore

        // get auth token from header request and verify it with the token in the database
        const userFromToken = verifyToken(request);

        // verify if user id is the same as the user id in the token
        if (userFromToken !== null && userFromToken.id === user.id) {
            await prisma.user.delete({
                where: {
                    id: parseInt(params.id)
                }
            });
            // return a success message after deleting the user
            return NextResponse.json(
                {message: "your profile has been deleted"},
                {status: 200});
        }
        // return an error message if the user is not authorized to delete the profile
        return NextResponse.json(
            {error: "You are not authorized to delete this profile, forbidden"},
            {status: 403});

    } catch (error) {
        return errorHandler(
            "Internal server error",
            500);
    }

}

/** @method PUT
 * @troute PUT /api/v1/users/profile/:id
 * @description Update a user profile
 * @access Private (only the user can update their own profile)
 */

export async function PUT(request: NextRequest, {params}: Props) {
    try {
        // get user from db by id
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(params.id)
            }
        }) as User | null;

        if (!user) {
            return NextResponse.json(
                {error: "User not found"},
                {status: 404}
            );
        }
        // get auth token from header request
        const userFromToken = verifyToken(request);
        if (userFromToken !== null && userFromToken.id === user.id) {

            // get body data
            const body = (await request.json()) as UpdateUserProfileDto;
            const validated = userProfileSchema.safeParse(body);
            if (!validated.success) {
                return NextResponse.json(
                    {error: validated.error.errors[0].message},
                    {status: 400}
                );
            }

            // get address id from body
            const newAddress = body.Address as Address;
            const updatedAddress = await prisma.address.update({
                where: {
                    id: newAddress.id
                },
                data: {
                    street: newAddress.street,
                    number: newAddress.number,
                    city: newAddress.city,
                    zipCode: newAddress.zipCode,
                    country: newAddress.country
                }
            }) as Address;
            await prisma.user.update({
                where: {
                    id: parseInt(params.id)
                },
                data: {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    phoneNumber: body.phoneNumber,
                    email: body.email,
                    addressId: updatedAddress.id
                }
            });

        }


    } catch (error) {
        return errorHandler(
            "Internal server error",
            500);
    }
}