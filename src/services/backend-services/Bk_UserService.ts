// path: src/services/backend-services/Bk_UserService.ts
"use server";

import {
  CreateDestinataireDto,
  DestinataireResponseDto,
  DestinataireResponseWithRoleDto,
  ProfileDto,
  RoleDto,
  UserLoginDto,
  UserResponseDto,
} from "@/services/dtos";
import prisma from "@/utils/db";
import { VerificationDataType } from "@/utils/types";
import { userRepositories } from "@/services/repositories/users/UserRepository";
import { capitalizeFirstLetter, toLowerCase } from "@/utils/stringUtils";

export async function handleDestinataire(
  userId: number,
  destinataireData: CreateDestinataireDto
): Promise<DestinataireResponseWithRoleDto | null> {
  if (!userId || !destinataireData) return null;

  const destinataire = await prisma.$transaction(async (tx) => {
    // 1. Chercher un utilisateur avec l'email et le téléphone (peu importe les rôles)
    let found = await tx.user.findFirst({
      where: {
        email: toLowerCase(destinataireData.email),
        phoneNumber: destinataireData.phoneNumber,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
        role: true,
      },
    });

    // 2. Si l'utilisateur existe, mais ne possède pas le rôle DESTINATAIRE, on le met à jour
    if (!found) {
      found = await tx.user.create({
        data: {
          firstName: capitalizeFirstLetter(destinataireData.firstName),
          lastName: capitalizeFirstLetter(destinataireData.lastName),
          name:
            `${capitalizeFirstLetter(
              destinataireData.firstName
            )} ${capitalizeFirstLetter(destinataireData.lastName)}` || "",
          email: toLowerCase(destinataireData.email),
          phoneNumber: destinataireData.phoneNumber,
          image: destinataireData.image || "",
          role: RoleDto.DESTINATAIRE,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          name: true,
          email: true,
          phoneNumber: true,
          image: true,
          role: true,
        },
      });
    }
    // Vérifier l'association entre le client et le destinataire
    const existingAssociation = await tx.clientDestinataire.findUnique({
      where: {
        clientId_destinataireId: {
          clientId: userId,
          destinataireId: found.id,
        },
      },
    });

    // 5. Si l'association n'existe pas, la créer
    if (!existingAssociation) {
      await tx.clientDestinataire.create({
        data: {
          clientId: userId,
          destinataireId: found.id,
        },
      });
    }

    // Transform the result to ensure non-nullable fields are set
    const safeFound: DestinataireResponseWithRoleDto = {
      id: found.id,
      firstName: found.firstName ?? "",
      lastName: found.lastName ?? "",
      name: found.name, // allowed to be string or null
      email: found.email,
      phoneNumber: found.phoneNumber ?? "",
      image: found.image,
      role: found.role as RoleDto,
    };
    return safeFound;
  });

  return destinataire;
}

/**
 * Create destinataire and return user
 * @param newDestinataire
 * @returns {Promise<DestinataireResponseDto>}
 */

export async function createDestinataire(
  newDestinataire: CreateDestinataireDto
): Promise<DestinataireResponseWithRoleDto | null> {
  try {
    const destinataire = await prisma.user.create({
      data: {
        firstName: newDestinataire.firstName,
        lastName: newDestinataire.lastName,
        name:
          newDestinataire.firstName && newDestinataire.lastName
            ? `${newDestinataire.firstName} ${newDestinataire.lastName}`
            : "", // Ensure name is never null
        email: newDestinataire.email,
        phoneNumber: newDestinataire.phoneNumber,
        image: newDestinataire.image ?? "", // Default to empty string if null
        role: RoleDto.DESTINATAIRE,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        phoneNumber: true,
        email: true,
        image: true,
        role: true,
      },
    });

    if (!destinataire) {
      return null;
    }

    return destinataire as DestinataireResponseDto;
  } catch (error) {
    console.error("Error creating destinataire:", error);
    throw error;
  }
}

/**
 * Get user by valid token and check if the token is not expired
 * @param token
 * @returns {Promise<UserResponseDto>} user
 */
export async function getUserByValidToken(
  token: string
): Promise<UserResponseDto | null> {
  try {
    const user = (await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gt: new Date(), // Le token doit être encore valide (pas expiré)
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        phoneNumber: true,
        email: true,
        role: true,
        image: true,
      },
    })) as UserResponseDto;

    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error getting user by valid token:", error);
    throw error;
  }
}

/**
 * Update user and reset token verification
 * @param userId
 */
export async function updateUserAndResetTokenVerificationAfterVerification(
  userId: number
) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        role: RoleDto.CLIENT,
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        phoneNumber: true,
        email: true,
        image: true,
        role: true,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * Update user and reset token verification for old user
 * @param userId - user id
 * @param verificationData - verification data object
 */
export async function updateVerificationTokenForOldUser(
  userId: number,
  verificationData: VerificationDataType
) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      role: RoleDto.CLIENT,
      isVerified: false,
      emailVerified: null,
      verificationToken: verificationData.verificationToken,
      verificationTokenExpires: new Date(
        verificationData.verificationTokenExpires
      ),
    },
  });
}

export async function getUserById(
  id: number
): Promise<CreateDestinataireDto | null> {
  try {
    const userByEmailFound = await prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    });

    if (!userByEmailFound) {
      return null;
    }
    return userByEmailFound as CreateDestinataireDto;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
}

export async function DeleteDestinataireById(id: number): Promise<boolean> {
  // ckeck id
  if (isNaN(id) || id <= 0) {
    console.error("Invalid user ID:", id);
    return false; // Return false if the ID is invalid
  }

  try {
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!userExists) {
      console.error("User not found:", id);
      return false; // User does not exist
    }

    // Soft delete user
    const softDeleteUser = await prisma.user.update({
      where: {
        id,
        email: userExists.email, // Ensure we update by email as well
      },
      data: {
        isDeleted: true,
      },
    });

    if (!softDeleteUser) {
      console.error("Failed to soft delete user:", id);
      return false; // Soft deletion failed
    }

    return true; // User soft deleted successfully
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error; // Rethrow the error for further handling
  }
}

/**
 * Check if association exists between client and destinataire
 * @param clientId - client id
 * @param destinataireId - destinataire id
 */
export async function checkExistingAssociation(
  clientId: number,
  destinataireId: number
) {
  try {
    const association = await prisma.clientDestinataire.findFirst({
      where: {
        clientId: clientId,
        destinataireId: destinataireId,
      },
    });

    if (association) {
      return association;
    }

    return null;
  } catch (error) {
    console.error("Error association doesn't exists:", error);
    throw error;
  }
}

/**
 * Associate user as destinataire to client (via ID) and vice versa
 * @param userId
 * @param destinataireId
 */

export async function associateDestinataireToCurrentClient(
  userId: number,
  destinataireId: number
) {
  try {
    const association = await prisma.clientDestinataire.create({
      data: {
        clientId: userId,
        destinataireId: destinataireId,
      },
    });

    if (association) {
      return association;
    }
    return null;
  } catch (error) {
    console.error("Error associating user as destinataire:", error);
    throw error; // Relancer l'erreur pour remonter jusqu'à l'appelant
  }
}

export async function getUserByEmail(
  email: string
): Promise<UserLoginDto | null> {
  try {
    const user = await userRepositories.findUserByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error getting user from database:", error);
    throw error;
  }
}

export async function getUserProfileById(
  userId: number
): Promise<ProfileDto | null> {
  try {
    const response = await userRepositories.getUserProfileById(userId);
    if (!response) {
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

export async function getUsersByAgencyAdmin(
  adminId: number
): Promise<ProfileDto[] | null> {
  return await userRepositories.getUsersByAgencyAdmin(adminId); // Implémentation spécifique avec agencyId
}

export async function getAllUsers(): Promise<ProfileDto[] | null> {
  const users = userRepositories.getAllUsers();

  return users;
}
