// /api/v1/users/login : route pour la connexion d'un utilisateur

import {NextRequest, NextResponse} from 'next/server';
import {errorHandler} from "@/utils/handelErrors";
import {prisma} from "@/utils/db";
import {loginUserSchema} from "@/utils/validationSchema";
import bcrypt from "bcryptjs";
import {LoginUserDto} from "@/utils/dtos";
import {setCookie} from "@/utils/generateToken";
import {JWTPayload} from "@/utils/types";
import {toLowerCase} from "@/utils/stringUtils";

/**
 * @method POST
 * @route.ts /api/v1/users/login
 * @desc Login a user
 * @access public
 */
export async function POST(request: NextRequest) {
    try {
        // Obtenez le corps de la requête
        const body = (await request.json()) as LoginUserDto;

        if (!body) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Valider les données du formulaire avec Zod
        const { success, error, data } = loginUserSchema.safeParse(body);

        if(!data) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }
        if (!success || !data.email) {  // Vérifier que l'email est bien présent
            return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
        }

        // Nettoyage des données (conversion de l'email en minuscule)
        const formattedEmail = toLowerCase(data.email);

        // Vérifier si l'utilisateur existe et récupérer les informations nécessaires
        const user = await prisma.user.findFirst({
            where: { email: formattedEmail },
            select: {
                id: true,
                password: true,
                role: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber : true,
            }
        });

        // Si l'utilisateur n'est pas trouvé ou si le mot de passe est incorrect
        if (!user || !user.password || !(await bcrypt.compare(data.password, user.password))) {
            // Utiliser un message générique pour des raisons de sécurité
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 400 }
            );
        }

        // Générez un jeton et retournez l'objet de réponse utilisateur
        const jwtPayload: JWTPayload = {
            id: user.id,
            role: user.role,
            userEmail: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
        };

        // Générez un cookie avec JWT
        const cookie = setCookie(jwtPayload);

        // Retourner la réponse avec le cookie
        return NextResponse.json(
            { message: "Authenticated" },
            {
                status: 200,
                headers: {
                    'Set-Cookie': cookie
                }
            }
        );

    } catch (error) {
        // Retourner une erreur interne en cas de problème serveur
        return errorHandler("Internal server error", 500);
    }
}
