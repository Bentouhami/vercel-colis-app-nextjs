// /api/v1/users/login : route pour la connexion d'un utilisateur

import {NextRequest, NextResponse} from 'next/server';
import {errorHandler} from "@/utils/handelErrors";
import {loginUserSchema} from "@/utils/validationSchema";
import bcrypt from "bcryptjs";
import {LoginUserDto} from "@/utils/dtos";
import {toLowerCase} from "@/utils/stringUtils";
import {generateJWTPayloadAndSetCookie} from "@/services/frontend-services/UserService";
import {generateVerificationTokenForUser} from "@/utils/generateToken";
import {VerificationDataType} from "@/utils/types";
import {getUserByEmail, updateVerificationTokenForOldUser} from "@/services/backend-services/UserService";

/**
 * @method POST
 * @route.ts /api/v1/users/login
 * @desc Login a user
 * @access public
 */
export async function POST(request: NextRequest) {


    if (request.method !== "POST") {
        return NextResponse.json({error: "Method not allowed"}, {status: 405});
    }
    try {
        // Obtenez le corps de la requête
        const body = (await request.json()) as LoginUserDto;

        if (!body) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        // Valider les données du formulaire avec Zod
        const {success, error, data} = loginUserSchema.safeParse(body);

        if (!data) {
            return NextResponse.json({error: "Invalid data"}, {status: 400});
        }
        if (!success || !data.email) {  // Vérifier que l'email est bien présent
            return NextResponse.json({error: "Invalid email or password"}, {status: 400});
        }

        // Nettoyage des données (conversion de l'email en minuscule)
        const formatedEmail = toLowerCase(data.email);



        const user = await getUserByEmail(formatedEmail);

        if (!user) {
            return NextResponse.json(
                {error: "Invalid email or password"},
                {status: 400}
            );
        }
        // Si l'utilisateur n'est pas trouvé ou si le mot de passe est incorrect
        if (!user.password || !(await bcrypt.compare(data.password, user.password))) {
            // Utiliser un message générique pour des raisons de sécurité
            return NextResponse.json(
                {error: "Invalid email or password"},
                {status: 400}
            );
        }


        const verificationData = generateVerificationTokenForUser() as VerificationDataType;

        // si le n'a pas vérifié son email
        if (user && !user.isVerified && user.emailVerified && user.emailVerified < new Date()) {
            await updateVerificationTokenForOldUser(user.id, verificationData)

        }


        // Generate JWTPayload object and setCookies
        const cookie = await generateJWTPayloadAndSetCookie(
            user.id,
            user.roles,
            user.email,
            user.firstName,
            user.lastName,
            user.phoneNumber,
            user.image || ""
        );

        // Retourner la réponse avec le cookie
        return NextResponse.json(
            {message: "Authenticated"},
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