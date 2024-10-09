// path: src/app/api/v1/destinataires/route.ts


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { capitalizeFirstLetter, toLowerCase } from "@/utils/stringUtils";
import { CreateDestinataireDto } from "@/utils/dtos";
import { destinataireSchema } from "@/utils/validationSchema";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as CreateDestinataireDto;

        if (!body) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const validationResult = destinataireSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json({ error: validationResult.error.errors[0].message }, { status: 400 });
        }

        const { firstName, lastName, phoneNumber, email } = validationResult.data;

        const existingDestinataire = await prisma.destinataire.findFirst({
            where: {
                OR: [
                    { email: toLowerCase(email) },
                    { phoneNumber: phoneNumber }
                ]
            }
        });

        if (existingDestinataire) {
            return NextResponse.json({ error: "Destinataire already exists" }, { status: 400 });
        }

        const newDestinataire = await prisma.destinataire.create({
            data: {
                firstName: capitalizeFirstLetter(firstName),
                lastName: capitalizeFirstLetter(lastName),
                phoneNumber: phoneNumber,
                email: toLowerCase(email)
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                email: true
            }
        });

        // Vérification si l'environnement est HTTPS ou non
        const isProduction = process.env.NODE_ENV === 'production';

        // Définir le cookie, sans l'attribut `Secure` en développement local
        return NextResponse.json({ newDestinataire }, {
            status: 201,
            headers: {
                'Set-Cookie': `destinataireId=${newDestinataire.id}; Path=/; HttpOnly; ${isProduction ? 'Secure;' : ''} SameSite=Strict`
            }
        });
    } catch (error) {
        console.error("Error creating destinataire:", error);
        return NextResponse.json({ error: "Error creating destinataire" }, { status: 500 });
    }
}
