// path: src/services/users/UserService.ts

import {RegisterUserBackendType} from "@/utils/validationSchema";
import {hashPassword} from "@/lib/auth";
import prisma from "@/utils/db";
import {CreateDestinataireDto, UserResponseDto} from "@/utils/dtos";

export async function registerUser(newUser: RegisterUserBackendType) {
    try {
        const formattedUser = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            birthDate: newUser.birthDate,
            phoneNumber: newUser.phoneNumber,
            email: newUser.email,
            password: await hashPassword(newUser.password),
            address: {
                street: newUser.address.street,
                number: newUser.address.number,
                city: newUser.address.city,
                zipCode: newUser.address.zipCode,
                country: newUser.address.country
            }
        }

        return await prisma.user.create({
            data: formattedUser
        }) as UserResponseDto;

    } catch (error) {
        console.error("Error registering user:", error);
        throw error; // Relancer l'erreur pour la capturer dans RegisterForm
    }
}

/**
 * Vérifie si un utilisateur existe déjà dans la base de données avec e role = CLIENT || ADMIN || DESTINATAIRE
 * par email et par numéro de téléphone
 * @param email
 * @param phoneNumber
 * @returns user or null
 */
// isUserAlreadyExist : Vérifie si un utilisateur existe déjà dans la base de données
export async function isUserAlreadyExist(email: string, phoneNumber: string) {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                {email: email},
                {phoneNumber: phoneNumber},
            ],
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            phoneNumber: true,
            email: true,
            isVerified: true,
            image: true,
            role: true,
            addressId: true
        }
    });

    if (!user) {
        return null;
    }
    // check if the user is a destinataire
    if (user.role === "DESTINATAIRE") {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            name: user.firstName + " " + user.lastName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: user.role,
            addressId: user.addressId
        };
    }


    return user;

}


export async function createDestinataire(newDestinataire: CreateDestinataireDto) {
    return await prisma.user.create({
        data: newDestinataire
    });
}


