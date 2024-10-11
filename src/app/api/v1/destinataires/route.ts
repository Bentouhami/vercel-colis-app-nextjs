// path: src/app/api/v1/destinataires/route.ts


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { capitalizeFirstLetter, toLowerCase } from "@/utils/stringUtils";
import { CreateDestinataireDto } from "@/utils/dtos";
import { destinataireSchema } from "@/utils/validationSchema";
import {getDefaultAutoSelectFamilyAttemptTimeout} from "node:net";
import {getCurrentUser} from "@/utils/api";

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


        let destinataire = await prisma.destinataire.findFirst({
            where: {
                OR: [
                    { email: toLowerCase(email) },
                    { phoneNumber: phoneNumber }
                ]
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                email: true
            }
        });

        if (!destinataire) {
            destinataire = await prisma.user.findFirst({
                where: {
                    email: email
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                    email: true
                }
            });

            const payload = getCurrentUser(req);

            console.log("uer connected payload: ", payload);


            if(destinataire && payload) {
                console.log("destinataire and payload: ", destinataire, payload);


                if((destinataire.email === payload.userEmail ) || (destinataire.phoneNumber === payload.phoneNumber)) {

                    console.log("email match", payload.email);

                    return NextResponse.json({ error: "Vous ne pouvez pas utiliser vos propres informations comme destinataire." }, { status: 400 });
                }

                // Créer un nouveau destinataire si aucune correspondance trouvée et si l'utilisateur est connecté et pas le destinataire lui-même
                destinataire = await prisma.destinataire.create({
                    data: {
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                        phoneNumber: payload.phoneNumber,
                        email: payload.email,

                    },
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phoneNumber: true,
                        email: true
                    }
                });

            }
        }
        if (destinataire) {
            const isProduction = process.env.NODE_ENV === 'production';

            // Définir le cookie, sans l'attribut `Secure` en développement local
            return NextResponse.json({ destinatire: destinataire }, {
                status: 201,
                headers: {
                    'Set-Cookie': `destinataireId=${destinataire.id}; Path=/; HttpOnly; ${isProduction ? 'Secure;' : ''} SameSite=Strict`
                }
            });
        }

        destinataire = await prisma.destinataire.create({
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
        return NextResponse.json({ destinatire: destinataire }, {
            status: 201,
            headers: {
                'Set-Cookie': `destinataireId=${destinataire.id}; Path=/; HttpOnly; ${isProduction ? 'Secure;' : ''} SameSite=Strict`
            }
        });
    } catch (error) {
        console.error("Error creating destinataire:", error);
        return NextResponse.json({ error: "Error creating destinataire" }, { status: 500 });
    }
}
