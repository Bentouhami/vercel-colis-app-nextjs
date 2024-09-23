// /api/v1/users/login : route pour la connexion d'un utilisateur

import {NextRequest, NextResponse} from 'next/server';
import {errorHandler} from "@/app/utils/handelErrors";
import {prisma} from "@/app/utils/db";
import {loginUserSchema} from "@/app/utils/validationSchema";
import bcrypt from "bcryptjs";
import {LoginUserDto} from "@/app/utils/dtos";
import {setCookie} from "@/app/utils/generateToken";
import {JWTPayload} from "@/app/utils/types";
import {toLowerCase} from "@/app/utils/stringUtils";

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
                password: true,  // On récupère le mot de passe pour le comparer
                id: true,
                role: true,
                email: true,
            }
        });

        // Si l'utilisateur n'est pas trouvé ou si le mot de passe est incorrect
        if (!user || !(await bcrypt.compare(data.password, user.password))) {
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
            userEmail: user.email
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
