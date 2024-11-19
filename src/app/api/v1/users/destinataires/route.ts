import { NextRequest, NextResponse } from "next/server";
import { capitalizeFirstLetter, toLowerCase } from "@/utils/stringUtils";
import { CreateDestinataireDto, DestinataireResponseWithRoleDto, Roles } from "@/utils/dtos";
import { destinataireSchema } from "@/utils/validationSchema";
import { verifyToken } from "@/utils/verifyToken";
import {
    associateDestinataireToCurrentClient,
    checkExistingAssociation,
    createDestinataire,
    isDestinataireAlreadyExist,
} from "@/services/backend-services/UserService";

export async function POST(req: NextRequest) {
    console.log("log ====> POST request reached in path : src/app/api/v1/users/destinataires/route.ts ")

    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    try {
        const body = (await req.json()) as CreateDestinataireDto;
        console.log("body extracted from POST request: ", body);

        if (!body) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const validationResult = destinataireSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json({ error: validationResult.error.errors[0].message }, { status: 400 });
        }

        const { firstName, lastName, phoneNumber, email } = validationResult.data;
        const name = body.name
        console.log("log ===> creating destinataire with these data: ", { firstName, lastName, name, phoneNumber, email });

        const userPayload = verifyToken(req);
        if (!userPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }


        // Vérifie si un utilisateur avec cet email ou numéro de téléphone existe déjà
        let destinataireData: DestinataireResponseWithRoleDto | null = await isDestinataireAlreadyExist(toLowerCase(email), phoneNumber);


        if (destinataireData) {
            // Vérifier si l'association existe déjà entre le destinataire et le client
            const existingAssociation = await checkExistingAssociation(userPayload.id, destinataireData.id);

            if (existingAssociation) {

                return NextResponse.json({
                    data: destinataireData,
                }, { status: 200 });
            }

            console.log("log ====> destinataire NOT found in POST destinataire route path: src/app/api/v1/users/destinataires/route.ts:  trying to associate it to the current  connected client");

            // Associer ce destinataire (via son ID) au client actuel
            const association = await associateDestinataireToCurrentClient(userPayload.id, destinataireData.id);

            if (!association) {
                console.log("Associating failed");
                return NextResponse.json(
                    { data: null},
                    { status: 200 }
                );
            }

            console.log("log ====> Association ajouté entre le client et le destinataire avec succès, envoie de la réponse suivent:", destinataireData);

            return NextResponse.json({
                data: destinataireData,
            }, { status: 200 });
        }

        // Normalisation des données du nouveau destinataire
        const newDestinataireData = {
            firstName: capitalizeFirstLetter(firstName),
            lastName: capitalizeFirstLetter(lastName),
            name: capitalizeFirstLetter(firstName) + " " + capitalizeFirstLetter(lastName),
            email: toLowerCase(email),
            phoneNumber: phoneNumber,
            image: null,
            roles: [Roles.DESTINATAIRE], // Updated to roles array
        };

        console.log("About to create new destinataire of type BaseDestinataireDto:", newDestinataireData);

        // Création du nouveau destinataire dans la base de données
        destinataireData = await createDestinataire(newDestinataireData);

        if (!destinataireData) {
            return NextResponse.json({ data : null }, { status: 200 });
        }
        console.log(`Destinataire created: destinataireData`);
        console.log("DestinataireData.id after creation new destinataire is : ", destinataireData.id)

        // Associer le destinataire nouvellement créé au client actuel
        const association = await associateDestinataireToCurrentClient(userPayload.id, destinataireData.id);

        if (!association) {
            return NextResponse.json({ data : null }, { status: 200 });
        }

        // Retourner le destinataire créé
        return NextResponse.json({
            data: destinataireData,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ data : null }, { status: 200 });
    }
}
