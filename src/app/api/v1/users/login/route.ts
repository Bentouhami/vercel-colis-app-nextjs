// /api/v1/users/login : route pour la connexion d'un utilisateur

import {NextRequest, NextResponse} from 'next/server';
import {errorHandler} from "@/utils/handelErrors";
import {loginUserSchema} from "@/utils/validationSchema";
import bcrypt from "bcryptjs";
import {LoginUserDto} from "@/utils/dtos";
import {toLowerCase} from "@/utils/stringUtils";
import {generateJWTPayloadAndSetCookie} from "@/services/frontend-services/UserService";
import {getVerificationData} from "@/utils/generateToken";
import {VerificationDataType} from "@/utils/types";
import {getUserByEmail, updateVerificationTokenForOldUser} from "@/services/backend-services/UserService";

/**
 * @method POST
 * @route.ts /api/v1/users/login
 * @desc Login a user
 * @access public
 */
export async function POST(request: NextRequest) {

    console.log("log ====> POST function called in path: src/app/api/v1/users/login/route.ts and request.method is: ", request.method);


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


        console.log("log ====> calling getUserByEmail function in path: src/app/api/v1/users/login/route.ts with email: ", formatedEmail);

        const user = await getUserByEmail(formatedEmail);

        console.log("log ====> user found in path: src/app/api/v1/users/login/route.ts: ", user);
        if (!user) {
            return NextResponse.json(
                {error: "Invalid email or password"},
                {status: 400}
            );
        }
        // Si l'utilisateur n'est pas trouvé ou si le mot de passe est incorrect
        if (!user.password || !(await bcrypt.compare(data.password, user.password))) {
            console.log("log ====> user not found or password is incorrect in path: src/app/api/v1/users/login/route.ts");

            // Utiliser un message générique pour des raisons de sécurité
            return NextResponse.json(
                {error: "Invalid email or password"},
                {status: 400}
            );
        }
        console.log(" log ====> user found and password is correct in path: src/app/api/v1/users/login/route.ts");

        console.log("loh ====> calling getVerificationData function in path: src/app/api/v1/users/login/route.ts");

        const verificationData = getVerificationData() as VerificationDataType;

        // si le n'a pas vérifié son email
        if (user && !user.isVerified && user.emailVerified && user.emailVerified < new Date()) {

            console.log("log ====> calling updateVerificationTokenForOldUser function in path: src/app/api/v1/users/login/route.ts with user.id and verificationData: ", user.id, verificationData);
            await updateVerificationTokenForOldUser(user.id, verificationData)

        }


        console.log("log ====> calling generateJWTPayloadAndSetCookie function in path: src/app/api/v1/users/login/route.ts with user.id and user.roles, user.email, user.firstName, user.lastName, user.phoneNumber, user.image: ", user.id, user.roles, user.email, user.firstName, user.lastName, user.phoneNumber, user.image);

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