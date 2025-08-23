// path: src/app/api/v1/users/verify/route.ts

import { NextRequest, NextResponse } from "next/server";
import { RoleDto, UserResponseDto } from "@/services/dtos";
import {
  getUserByValidToken,
  updateUserAndResetTokenVerificationAfterVerification,
} from "@/services/backend-services/Bk_UserService";
import dynamic from "next/dynamic";

/**
 * @method POST
 * @route /api/v1/users/verify
 * @desc Verify email
 */

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ status: 400 });
  }

  // Récupérer le token depuis le corps de la requête
  const { token } = await req.json(); // Utiliser req.json() pour extraire le body correctement

  if (!token) {
    return NextResponse.json({ message: "Token is missing" }, { status: 400 });
  }

  try {
    // Rechercher l'utilisateur avec le token et vérifier si le token n'a pas expiré

    const user = await getUserByValidToken(token);

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    // Mettre à jour l'état de l'utilisateur pour indiquer que son email est vérifié
    await updateUserAndResetTokenVerificationAfterVerification(user.id);

    // Créer l'objet de réponse utilisateur
    const userResponse: UserResponseDto = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      phoneNumber: user.phoneNumber,
      email: user.email,
      image: user.image,
      role: RoleDto.CLIENT,
    };
    return NextResponse.json(
      {
        user: userResponse,
        message: "Email verified successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
