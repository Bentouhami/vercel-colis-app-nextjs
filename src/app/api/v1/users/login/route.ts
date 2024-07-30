import {NextRequest, NextResponse} from 'next/server';
import {errorHandler} from "@/app/utils/handelErrors";
import prisma from "@/app/utils/db";
import {loginUserSchema} from "@/app/utils/validationSchema";
import bcrypt from "bcryptjs";
import {LoginUserDto} from "@/app/utils/dtos";
import {User} from "@prisma/client";
import {setCookie} from "@/app/utils/generateToken";
import {JWTPayload} from "@/app/utils/types";

/**
 * @method POST
 * @route /api/v1/users/login
 * @desc Login a user
 * @access public
 */
export async function POST(request: NextRequest) {
    try {
        // Obtenez le corps de la requête
        const body = (await request.json()) as LoginUserDto;

        const validated = loginUserSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json(
                {error: validated.error.errors[0].message},
                {status: 400});
        }

        // Obtenez l'utilisateur à partir de la base de données avec l'email donné
        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        }) as User;

        // Si l'utilisateur n'est pas trouvé, retournez un message d'erreur
        if (!user) {
            return errorHandler("Invalid credentials, please try again or register", 400);
        }

        // Vérifiez si le mot de passe correspond
        const isMatched =
            await bcrypt.compare(body.password, user.password);
        if (!isMatched) {
            return errorHandler(
                "Invalid credentials, please try again or register", 400);
        }

        // Générez un jeton et retournez l'objet de réponse utilisateur
        const jwtPayload: JWTPayload = {
            id: user.id,
            role: user.role,
            userEmail: user.email
        };
        // Générez un cookie et retournez l'objet de réponse utilisateur
        const cookie = setCookie(jwtPayload);
        return NextResponse.json(
            {message: "Authenticated",},
            {
                status: 200,
                headers: {
                    'Set-Cookie': cookie
                }
            }
        );
    } catch (error) {
        return errorHandler("Internal server error", 500);
    }
}
