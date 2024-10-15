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

        // debug le contenu de la requête POST
        console.log("body debug & BREAK", body);

        // Valider les données avec Zod
        const validationResult = destinataireSchema.safeParse(body);


        // Si la validation a échoué, retourner une erreur 400 avec le message d'erreur
        if (!validationResult.success) {
            return NextResponse.json({error: validationResult.error.errors[0].message}, {status: 400});
        }

        // Récupérer les données du destinataire destructeur à partir de la validation
        const {firstName, lastName, phoneNumber, email} = validationResult.data;



        // récupérer le token de l'utilisateur connecté
        const token = req.cookies.get(process.env.COOKIE_NAME as string);
        if (!token) {
            return new Response('Unauthorized', {status: 401});
        }

        const userPayload = verifyToken(req);
        console.log("user payload & token: ", userPayload, token);

        if (!userPayload) {
            return NextResponse.json('Unauthorized', {status: 401});
        }


        // chercher le destinataire dans la base de données s'il existe déjà et renvoyer une erreur si c'est
        let destinataireData = await prisma.user.findFirst({
            where: {
                email: toLowerCase(email),
                phoneNumber: phoneNumber
            },
            select: {
                // id: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                email: true,

            }
        }) as DestinataireData;

        console.log("existed destinataire data: ", destinataireData, userPayload);

        // vérifier si le client à utiliser ses propres informations comme destinataire et retourner une erreur si c'est le cas
        if ((destinataireData && userPayload) &&
            (destinataireData.id === userPayload.id) ) {

            // vérifier si les données sont les mêmes pour éviter les doublons
            if(destinataireData.phoneNumber === userPayload.phoneNumber && destinataireData.email === userPayload.userEmail) {
                console.log("same data between destinataire and user: ", destinataireData, userPayload);
                return NextResponse.json(
                    {error: "Vous ne pouvez pas utiliser vos propres informations comme destinataire."},
                    {status: 400}
                );
            }
            else {
                console.log("different data between destinataire and user: ", destinataireData, userPayload);
            }
        }


        if (!destinataireData) {
            // créer le destinataire dans la base de données s'il n'existe pas
            destinataireData = await prisma.user.create({
                data: {
                    firstName: capitalizeFirstLetter(firstName),
                    lastName: capitalizeFirstLetter(lastName),
                    phoneNumber: phoneNumber,
                    email: toLowerCase(email),
                },
                select: {
                    // id: true,
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                    email: true

                }
            }) as DestinataireData;
        }


        if (destinataireData) {
            // Vérification si l'environnement est HTTPS ou non
            const isProduction = process.env.NODE_ENV === 'production';
            // Définir le cookie, sans l'attribut `Secure` en développement local
            console.log("Setting destinatire cookie with destinataireData :", destinataireData);

            const data = {
                sender: {
                    // id: userPayload.id,
                    firstName: userPayload.firstName,
                    lastName: userPayload.lastName,
                    phoneNumber: userPayload.phoneNumber,
                    email: userPayload.userEmail,
                },
                destinataire: destinataireData
            }

            return NextResponse.json({data: data}, {
                status: 201,
                headers: {
                    'Set-Cookie': `destinataireData=${JSON.stringify(destinataireData)}; Path=/; HttpOnly; ${isProduction ? 'Secure;' : ''} SameSite=Strict`
                }
            });
        } else {
            return NextResponse.json({error: "Error creating destinataire"}, {status: 500});
        }
    } catch
        (error) {
        console.error("Error creating destinataire:", error);
        return NextResponse.json({error: "Error creating destinataire"}, {status: 500});
    }
}
