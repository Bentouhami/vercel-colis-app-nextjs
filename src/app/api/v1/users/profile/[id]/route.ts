import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/app/utils/db";
import {errorHandler} from "@/app/utils/handelErrors";
import {User} from "@prisma/client";
import {verifyToken} from "@/app/utils/verifyToken";

interface Props {
    params: {
        id: string
    }
}

/** @method DELETE
 * @troute GET /api/v1/users/profile/:id
 * @description Delete a user profile
 * @access Private
 */

export async function DELETE(request: NextRequest, {params}: Props) {
    try {
        // get user from db by id
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(params.id)
            }
        }) as User;

        // if user not found
        if (!user) {

            return NextResponse.json(
                {error: "User not found"},
                {status: 404}
            );
        }
        // get auth token from header request
        //@ts-ignore

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