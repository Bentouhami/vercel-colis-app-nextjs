// path: src/app/api/v1/destinataires/route.ts

import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/db";
import {capitalizeFirstLetter, toLowerCase} from "@/utils/stringUtils";
import {CreateDestinataireDto} from "@/utils/dtos";
import {destinataireSchema} from "@/utils/validationSchema";
import {verifyToken} from "@/utils/verifyToken";
import {DestinataireData} from "@/utils/types";

export async function POST(req: NextRequest) {
    try {
        // Récupérer les données de la requête POST
        const body = (await req.json()) as CreateDestinataireDto;

        // Vérifier si les données sont présentes
        if (!body) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        // Valider les données avec Zod
        const validationResult = destinataireSchema.safeParse(body);

        // Si la validation a échoué, retourner une erreur 400 avec le message d'erreur
        if (!validationResult.success) {
            return NextResponse.json({error: validationResult.error.errors[0].message}, {status: 400});
        }

        // Récupérer les données du destinataire
        const {firstName, lastName, phoneNumber, email} = validationResult.data;

        // Récupérer le token de l'utilisateur connecté
        const token = req.cookies.get(process.env.COOKIE_NAME as string);
        if (!token) {
            return new Response('Unauthorized', {status: 401});
        }

        const userPayload = verifyToken(req);
        if (!userPayload) {
            return NextResponse.json('Unauthorized', {status: 401});
        }

        // Chercher le destinataire dans la base de données
        let destinataireData = await prisma.user.findFirst({
            where: {
                email: toLowerCase(email),
                phoneNumber: phoneNumber
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                email: true,
            }
        }) as DestinataireData;

        // Vérifier si le client a utilisé ses propres informations comme destinataire
        if (destinataireData && userPayload && (destinataireData.id === userPayload.id)) {
            console.log("User attempted to use their own information as destinataire: ", destinataireData, userPayload);

            // Retourner un message d'erreur générique pour éviter de divulguer des informations spécifiques
            return NextResponse.json(
                {error: "Vous ne pouvez pas utiliser vos propres informations comme destinataire."},
                {status: 400}
            );
        }

        // Créer un nouveau destinataire si aucun n'existe avec ces informations
        if (!destinataireData) {
            destinataireData = await prisma.user.create({
                data: {
                    firstName: capitalizeFirstLetter(firstName),
                    lastName: capitalizeFirstLetter(lastName),
                    phoneNumber: phoneNumber,
                    email: toLowerCase(email),
                },
                select: {
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                    email: true
                }
            }) as DestinataireData;
        }

        // Si le destinataire a été créé ou trouvé, créer un cookie et renvoyer la réponse
        if (destinataireData) {
            const isProduction = process.env.NODE_ENV === 'production';

            const data = {
                sender: {
                    firstName: userPayload.firstName,
                    lastName: userPayload.lastName,
                    phoneNumber: userPayload.phoneNumber,
                    email: userPayload.userEmail,
                },
                destinataire: destinataireData
            };

            return NextResponse.json({data: data}, {
                status: 201,
                headers: {
                    'Set-Cookie': `destinataireData=${JSON.stringify(destinataireData)}; Path=/; HttpOnly; ${isProduction ? 'Secure;' : ''} SameSite=Strict`
                }
            });
        } else {
            return NextResponse.json({error: "Error creating destinataire"}, {status: 500});
        }
    } catch (error) {
        console.error("Error creating destinataire:", error);
        return NextResponse.json({error: "Oups Error creating destinataire"}, {status: 500});
    }
}