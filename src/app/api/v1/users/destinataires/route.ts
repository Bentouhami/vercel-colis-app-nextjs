// path: src/app/api/v1/users/destinataires/route.ts

import {NextRequest, NextResponse} from "next/server";
import {capitalizeFirstLetter, toLowerCase} from "@/utils/stringUtils";
import {BaseDestinataireDto, DestinataireResponseDto} from "@/utils/dtos";
import {DestinataireInput, destinataireSchema} from "@/utils/validationSchema";
import {verifyToken} from "@/utils/verifyToken";
import {
    associateDestinataireToCurrentClient,
    checkExistingAssociation,
    createDestinataire,
    isDestinataireAlreadyExist,
} from "@/services/backend-services/UserService";

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({error: "Method not allowed"}, {status: 405});
    }
    try {
        // Récupération des données de la requête POST
        const body = (await req.json()) as DestinataireInput;

        console.log("body extracted from POST request: ", body);

        if (!body) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        const validationResult = destinataireSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json({error: validationResult.error.errors[0].message}, {status: 400});
        }

        const {firstName, lastName, phoneNumber, email} = validationResult.data;

        console.log("Creating destinataire with:", {firstName, lastName, phoneNumber, email});

        const token = req.cookies.get(process.env.COOKIE_NAME as string);

        if (!token) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }

        const userPayload = verifyToken(req);
        if (!userPayload) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }


        // Vérifie si un utilisateur avec cet email ou numéro de téléphone existe déjà
        let destinataireData: DestinataireResponseDto | null = await isDestinataireAlreadyExist(email, phoneNumber);
        console.log("isUserAlreadyExist returned:", destinataireData);

        if (destinataireData) {
            console.log("Associating existing user as destinataire.");

            // Vérifier si l'association existe déjà entre le destinataire et le client
            const existingAssociation = await checkExistingAssociation(userPayload.id, destinataireData.id);

            if (existingAssociation) {
                return NextResponse.json({
                    data: destinataireData,
                    message: "Le destinataire est déjà associé au client.",
                }, {status: 200});
            }

            // Associer ce destinataire (via son ID) au client actuel
            await associateDestinataireToCurrentClient(userPayload.id, destinataireData.id);

            // Retourner le destinataire existant
            return NextResponse.json({
                data: destinataireData,
                message: "Le destinataire existant est associé au client.",
            }, {status: 200});
        }

        // Normalisation des données du nouveau destinataire
        const newDestinataireData: BaseDestinataireDto = {
            firstName: capitalizeFirstLetter(firstName),
            lastName: capitalizeFirstLetter(lastName),
            name: capitalizeFirstLetter(firstName) + " " + capitalizeFirstLetter(lastName),
            email: toLowerCase(email),
            phoneNumber: phoneNumber,
        };

        console.log("About to create new destinataire of type BaseDestinataireDto:", newDestinataireData);

        // Création du nouveau destinataire dans la base de données
        destinataireData = await createDestinataire(newDestinataireData);

        if (!destinataireData) {
            return NextResponse.json({error: "Oups Error creating destinataire"}, {status: 500});
        }

        console.log(`Destinataire created: ${destinataireData.firstName}`);

        // Associer le destinataire nouvellement créé au client actuel
        await associateDestinataireToCurrentClient(userPayload.id, destinataireData.id);

        // Retourner le destinataire créé
        return NextResponse.json({
            data: destinataireData,
            message: "Le destinataire a été créé et associé au client.",
        }, {status: 200});

    } catch (error) {
        console.error("Error creating destinataire:", error);
        return NextResponse.json({error: "Oups Error creating destinataire"}, {status: 500});
    }
}
