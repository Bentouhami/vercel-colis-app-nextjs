import { NextRequest, NextResponse } from "next/server";
import { capitalizeFirstLetter, toLowerCase } from "@/utils/stringUtils";
import { CreateDestinataireDto } from "@/utils/dtos";
import { destinataireSchema } from "@/utils/validationSchema";
import { verifyToken } from "@/utils/verifyToken";
import { createDestinataire, isUserAlreadyExist } from "@/services/users/UserService";

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    try {
        // Récupération des données de la requête POST
        const body = (await req.json()) as CreateDestinataireDto;

        if (!body) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const validationResult = destinataireSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json({ error: validationResult.error.errors[0].message }, { status: 400 });
        }

        const { firstName, lastName, phoneNumber, email } = validationResult.data;

        console.log("Creating destinataire with:", { firstName, lastName, phoneNumber, email });

        const token = req.cookies.get(process.env.COOKIE_NAME as string);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userPayload = verifyToken(req);
        if (!userPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Vérifie si un utilisateur avec cet email ou numéro de téléphone existe déjà
        let destinataireData = await isUserAlreadyExist(email, phoneNumber);
        console.log("isUserAlreadyExist returned:", destinataireData);

        if (destinataireData) {
            return NextResponse.json({ error: "Un destinataire avec ce numéro de téléphone ou cet email existe déjà." }, { status: 409 });
        }

        // Normalisation des données du nouveau destinataire
        const newDestinataireData = {
            firstName: capitalizeFirstLetter(firstName),
            lastName: capitalizeFirstLetter(lastName),
            phoneNumber: phoneNumber,
            email: toLowerCase(email),
            role: "DESTINATAIRE"
        } as CreateDestinataireDto;

        console.log("About to create new destinataire:", newDestinataireData);

        // Création du nouveau destinataire dans la base de données
        destinataireData = await createDestinataire(newDestinataireData);

        console.log("Destinataire created successfully:", destinataireData);

        return NextResponse.json({ data: destinataireData }, { status: 201 });

    } catch (error) {
        // Vérifie si l'erreur est liée à une contrainte unique
        if (error.code === 'P2002') {
            console.error("Unique constraint error on:", error.meta?.target);
            return NextResponse.json({ error: `Un utilisateur avec le même ${error.meta?.target} existe déjà.` }, { status: 409 });
        }

        console.error("Error creating destinataire:", error);
        return NextResponse.json({ error: "Oups Error creating destinataire" }, { status: 500 });
    }
}
