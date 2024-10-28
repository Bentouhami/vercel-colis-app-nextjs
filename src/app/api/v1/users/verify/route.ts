// path: src/app/api/v1/users/verify/route.ts

import {NextRequest, NextResponse} from "next/server";
import { Role, UserResponseDto} from "@/utils/dtos";
import {
    getUserByValidToken,
    updateUserAndResetTokenVerificationAfterVerification
} from "@/services/backend-services/UserService";


/**
 * @method POST
 * @route /api/v1/users/verify
 * @desc Verify email
 * @return {UserResponseDto} user object
 */

export async function POST(req: NextRequest) {
    // Récupérer le token depuis le corps de la requête
    const {token} = await req.json(); // Utiliser req.json() pour extraire le body correctement

    if (!token) {
        return NextResponse.json({message: "Token is missing"}, {status: 400});
    }

    console.log("log=> Verify token: ", token);

    try {
        // Rechercher l'utilisateur avec le token et vérifier si le token n'a pas expiré

        const user = await getUserByValidToken(token);
        console.log("log => path: src/app/api/v1/users/verify/route.ts : user", user);

        if (!user) {
            console.log("Token invalide");
            return NextResponse.json({message: "Invalid token"}, {status: 400});
        }

        // Mettre à jour l'état de l'utilisateur pour indiquer que son email est vérifié
        await updateUserAndResetTokenVerificationAfterVerification(user.id);

        // Créer l'objet de réponse utilisateur
        const userResponse: UserResponseDto = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            phoneNumber: user.phoneNumber,
            email: user.email,
            image: user.image,
            role: Role.CLIENT
        };

        console.log("log => userResponse retourné après vérification du token: ", userResponse);

        return NextResponse.json(
            {
                user: userResponse,
                message: "Email verified successfully"
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error("Error verifying email:", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}
