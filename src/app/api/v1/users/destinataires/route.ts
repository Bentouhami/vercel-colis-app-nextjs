// path: src/app/api/v1/users/destinataires/route.ts

import { NextRequest, NextResponse } from "next/server";
import { capitalizeFirstLetter, toLowerCase } from "@/utils/stringUtils";
import {
  CreateDestinataireDto,
  DestinataireResponseWithRoleDto,
  RoleDto,
} from "@/services/dtos";
import { destinataireSchema } from "@/utils/validationSchema";
import {
  associateDestinataireToCurrentClient,
  checkExistingAssociation,
  createDestinataire,
  handleDestinataire,
} from "@/services/backend-services/Bk_UserService";
import { auth } from "@/auth/auth";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Parse and validate the request body
    const newUser = (await req.json()) as CreateDestinataireDto;

    if (!newUser) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const validationResult = destinataireSchema.safeParse(newUser);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { firstName, lastName, phoneNumber, email } = validationResult.data;

    const sess = await auth();
    if (!sess)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = Number(sess?.user?.id);
    const userRole = sess?.user?.role;

    // Check if destinataire already exists
    let destinataireData: DestinataireResponseWithRoleDto | null =
      await handleDestinataire(userId, newUser);
    if (destinataireData) {
      // Check if the association already exists
      const existingAssociation = await checkExistingAssociation(
        userId,
        destinataireData.id
      );

      if (existingAssociation) {
        return NextResponse.json({ data: destinataireData }, { status: 200 });
      }

      const association = await associateDestinataireToCurrentClient(
        userId,
        destinataireData.id
      );
      if (!association) {
        return NextResponse.json({ data: null }, { status: 200 });
      }

      return NextResponse.json({ data: destinataireData }, { status: 200 });
    }

    // Normalize data for new destinataire
    const newDestinataireData = {
      firstName: capitalizeFirstLetter(firstName),
      lastName: capitalizeFirstLetter(lastName),
      name: `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(
        lastName
      )}`,
      email: toLowerCase(email),
      phoneNumber,
      image: null,
      role: RoleDto.DESTINATAIRE,
    };

    if (!newDestinataireData) {
      return NextResponse.json({ data: null }, { status: 200 });
    }
    // Create new destinataire
    destinataireData = await createDestinataire(newDestinataireData);

    if (!destinataireData) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    // Associate new destinataire with current user
    const association = await associateDestinataireToCurrentClient(
      userId,
      destinataireData.id
    );

    if (!association) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data: destinataireData }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/v1/users/destinataires:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
