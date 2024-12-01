import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { capitalizeFirstLetter, toLowerCase } from "@/utils/stringUtils";
import { CreateDestinataireDto, DestinataireResponseWithRoleDto, Roles } from "@/utils/dtos";
import { destinataireSchema } from "@/utils/validationSchema";
import {
    associateDestinataireToCurrentClient,
    checkExistingAssociation,
    createDestinataire,
    isDestinataireAlreadyExist,
} from "@/services/backend-services/UserService";

export async function POST(req: NextRequest) {
    console.log("POST request reached at: /api/v1/users/destinataires");

    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
        // Parse and validate the request body
        const body = (await req.json()) as CreateDestinataireDto;
        if (!body) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const validationResult = destinataireSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json({ error: validationResult.error.errors[0].message }, { status: 400 });
        }

        const { firstName, lastName, phoneNumber, email } = validationResult.data;

        // Validate the user's session using getToken
        const token = await getToken({ req, secret: process.env.AUTH_SECRET });
        if (!token) {
            console.log("Unauthorized request: Missing or invalid token.");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = Number(token.id);
        const userRoles = token.roles || [] as Roles[];

        console.log("User's session:", { userId, userRoles });

        console.log("Authenticated user:", { userId, userRoles });

        // Check if destinataire already exists
        let destinataireData: DestinataireResponseWithRoleDto | null = await isDestinataireAlreadyExist(toLowerCase(email), phoneNumber);

        if (destinataireData) {
            // Check if association already exists
            const existingAssociation = await checkExistingAssociation(userId, destinataireData.id);

            if (existingAssociation) {
                return NextResponse.json({ data: destinataireData }, { status: 200 });
            }

            console.log("Associating existing destinataire with current user...");
            const association = await associateDestinataireToCurrentClient(userId, destinataireData.id);
            if (!association) {
                console.log("Failed to associate destinataire with current user.");
                return NextResponse.json({ data: null }, { status: 200 });
            }

            return NextResponse.json({ data: destinataireData }, { status: 200 });
        }

        // Normalize data for new destinataire
        const newDestinataireData = {
            firstName: capitalizeFirstLetter(firstName),
            lastName: capitalizeFirstLetter(lastName),
            name: `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`,
            email: toLowerCase(email),
            phoneNumber,
            image: null,
            roles: [Roles.DESTINATAIRE],
        };

        console.log("Creating new destinataire:", newDestinataireData);
        if(!newDestinataireData) {
            return NextResponse.json({ data: null }, { status: 200 });
        }
        // Create new destinataire
        destinataireData = await createDestinataire(newDestinataireData);

        if (!destinataireData) {
            return NextResponse.json({ data: null }, { status: 200 });
        }

        // Associate new destinataire with current user
        const association = await associateDestinataireToCurrentClient(userId, destinataireData.id);

        if (!association) {
            return NextResponse.json({ data: null }, { status: 200 });
        }

        return NextResponse.json({ data: destinataireData }, { status: 200 });

    } catch (error) {
        console.error("Error in POST /api/v1/users/destinataires:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
