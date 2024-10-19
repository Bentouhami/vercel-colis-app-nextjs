import prisma from "@/utils/db";
import {NextRequest, NextResponse} from "next/server";
import {JWTPayload} from "@/utils/types";
import {setCookie} from "@/utils/generateToken";
import {UserResponseDto} from "@/utils/dtos";

export async function POST(req: NextRequest) {
    // Récupérer le token depuis le corps de la requête
    const {token} = await req.json(); // Utiliser req.json() pour extraire le body correctement

    if (!token) {
        return NextResponse.json({message: "Token is missing"}, {status: 400});
    }

    console.log("Verify token: ", token);

    try {
        // Rechercher l'utilisateur avec le token et vérifier si le token n'a pas expiré
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token,
                verificationTokenExpires: {
                    gt: new Date() // Le token doit être encore valide (pas expiré)
                },
            },
        });

        if (!user) {
            console.log("Token invalide");
            return NextResponse.json({message: "Invalid token"}, {status: 400});
        }

        // Mettre à jour l'état de l'utilisateur pour indiquer que son email est vérifié
        await prisma.user.update({
            where: {id: user.id},
            data: {
                isVerified: true,
                emailVerified: new Date(),
                verificationToken: null,
                verificationTokenExpires: null,
            },
        });

        // Générer un cookie JWT avec les informations de l'utilisateur
        const jwtPayload: JWTPayload = {
            id: user.id,
            role: user.role,
            userEmail: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            image: user.image
        };

        const cookie = setCookie(jwtPayload);

        // Créer l'objet de réponse utilisateur
        const userResponse: UserResponseDto = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth,
            phoneNumber: user.phoneNumber ?? "",
            email: user.email,
            image: user.image,
            role: user.role
        };
        return NextResponse.json(
            {
                user: userResponse,
                message: "Email verified successfully"
            },
            {
                status: 200,
                headers: {'Set-Cookie': cookie}
            }
        );

    } catch (error) {
        console.error("Error verifying email:", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}
