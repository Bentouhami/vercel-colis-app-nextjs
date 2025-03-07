// path: src/services/backend-services/Bk_UserService.ts
'use server';

import {
    AddressDto,
    CreateDestinataireDto,
    CreateUserDto,
    DestinataireResponseDto,
    DestinataireResponseWithRoleDto,
    FullUserResponseDto, ProfileDto,
    RoleDto,
    UpdateUserDto, UserLoginDto,
    UserLoginResponseDto,
    UserModelDto,
    UserResponseDto
} from "@/services/dtos";
import prisma from "@/utils/db";
import {VerificationDataType} from "@/utils/types";
import {sendVerificationEmail} from "@/lib/mailer";
import {userRepositories} from "@/services/repositories/users/UserRepository";
import {capitalizeFirstLetter, toLowerCase} from "@/utils/stringUtils";
import {transportRepository} from "@/services/repositories/transports/TransportRepository";


export async function handleDestinataire(
    userId: number,
    destinataireData: CreateDestinataireDto
): Promise<DestinataireResponseWithRoleDto | null> {
    console.log("log ====> handleDestinataire reached with userid and destinataireData", userId, destinataireData);

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
            console.log("log ====> handleDestinataire reached with destinataire not found, try to create destinataire: ", destinataireData);


            found = await tx.user.create({
                data: {
                    firstName: capitalizeFirstLetter(destinataireData.firstName),
                    lastName: capitalizeFirstLetter(destinataireData.lastName),
                    name: `${capitalizeFirstLetter(destinataireData.firstName)} ${capitalizeFirstLetter(destinataireData.lastName)}` || "",
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
            console.log("log ====> handleDestinataire reached with association not found, try to create association");
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

        console.log("log ====> handleDestinataire reached with found", safeFound);
        return safeFound;
    });

    return destinataire;
}


/**
 * Create destinataire and return user
 * @param newDestinataire
 * @returns {Promise<DestinataireResponseDto>}
 */

export async function createDestinataire(newDestinataire: CreateDestinataireDto): Promise<DestinataireResponseWithRoleDto | null> {
    console.log("log ====> createDestinataire function called in path: src/services/backend-services/Bk_UserService.ts");

    try {
        const destinataire = await prisma.user.create({
            data: {
                firstName: newDestinataire.firstName,
                lastName: newDestinataire.lastName,
                name: newDestinataire.firstName && newDestinataire.lastName
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
            }
        });

        if (!destinataire) {
            return null;
        }

        console.log("log ====> destinataire created in path: src/services/backend-services/Bk_UserService.ts: ", destinataire);

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
export async function getUserByValidToken(token: string): Promise<UserResponseDto | null> {

    console.log("log ====> getUserByValidToken function called in path: src/services/backend-services/Bk_UserService.ts")

    try {
        const user = await prisma.user.findFirst({
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
            }
        }) as UserResponseDto;

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
export async function updateUserAndResetTokenVerificationAfterVerification(userId: number) {

    // // get connected user
    // const session = await auth();
    // const user  = session?.user;
    // if (!user) {
    //     throw new Error("you have to be connected to update your user");
    // }

    console.log("log ====> updateUserAndResetTokenVerificationAfterVerification function called in path: src/services/backend-services/Bk_UserService.ts")

    console.log("path: src/services/users/Bk_UserService.ts : updateUserAndResetTokenVerification : userId", userId);

    try {
        await prisma.user.update({
            where: {id: userId},
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
                role: true
            }
        });


    } catch
        (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}


/**
 * Update user and reset token verification for old user
 * @param userId - user id
 * @param verificationData - verification data object
 */
export async function updateVerificationTokenForOldUser(userId: number, verificationData: VerificationDataType) {

    console.log("log ====> updateVerificationTokenForOldUser function called in path: src/services/backend-services/Bk_UserService.ts")

    await prisma.user.update({
        where: {id: userId},
        data: {
            role: RoleDto.CLIENT,
            isVerified: false,
            emailVerified: null,
            verificationToken: verificationData.verificationToken,
            verificationTokenExpires: new Date(verificationData.verificationTokenExpires),
        }
    });
}

export async function getUserById(id: number): Promise<CreateDestinataireDto | null> {

    console.log("log ====> getUserByEmail function called in path: src/services/backend-services/Bk_UserService.ts")

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
            }
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
//
// /**
//  * Update destinataire to client
//  * @returns {Promise<DestinataireResponseDto>} user data with updated fields or null if not found
//  * @param userData
//  */
//
// export async function updateDestinataireToClient(
//     userData: UpdateUserDto,
// ): Promise<FullUserResponseDto | null> {
//
//     console.log("log ====> updateDestinataireToClient function called in path: src/services/backend-services/Bk_UserService.ts")
//
//     try {
//         if (!userData.id || !userData.addressId || !userData.address) {
//             return null;
//         }
//         console.log("log ====> userData.id in path: src/services/backend-services/Bk_UserService.ts: ", userData.id);
//         console.log("log ====> userData.addressId in path: src/services/backend-services/Bk_UserService.ts: ", userData.addressId);
//         console.log("log ====> userData.address in path: src/services/backend-services/Bk_UserService.ts: ", userData.address);
//
//         const user = await prisma.user.update({
//             where: {
//                 id: userData.id,
//             },
//             data: {
//                 firstName: userData.firstName,
//                 lastName: userData.lastName,
//                 name: `${userData.lastName} ${userData.firstName}`,
//                 birthDate: userData.birthDate,
//                 phoneNumber: userData.phoneNumber,
//                 email: userData.email,
//                 password: userData.password,
//                 role: RoleDto.CLIENT,
//                 image: userData.image,
//                 isVerified: userData.isVerified,
//                 emailVerified: userData.emailVerified,
//                 verificationToken: userData.verificationToken,
//                 verificationTokenExpires: userData.verificationTokenExpires,
//                 addressId: userData.address.id,
//
//             },
//
//             include: {
//                 Address: true,
//             },
//         });
//
//         if (!user) {
//             return null;
//         }
//
//         // Map the returned user to FullUserResponseDto with null checks
//         const fullUserResponseDto: FullUserResponseDto = {
//             id: user.id,
//             firstName: user.firstName ?? '',
//             lastName: user.lastName ?? '',
//             name: user.name ?? '',
//             birthDate: user.birthDate ?? new Date(),
//             email: user.email,
//             phoneNumber: user.phoneNumber ?? '',
//             role: (user.role ?? RoleDto.CLIENT) as RoleDto,
//             image: user.image ?? '',
//             isVerified: user.isVerified ?? false,
//             emailVerified: user.emailVerified ?? new Date(),
//             verificationToken: user?.verificationToken || '',
//             verificationTokenExpires: user.verificationTokenExpires ?? new Date(),
//             address: user.Address as AddressDto,
//         };
//         if (!fullUserResponseDto) {
//             return null;
//         }
//
//         await sendVerificationEmail(user.name ?? '', user.email, fullUserResponseDto?.verificationToken!);
//
//         return fullUserResponseDto;
//     } catch (error) {
//         console.error("Error updating destinataire:", error);
//         throw error;
//     }
// }


/**
 * Check if association exists between client and destinataire
 * @param clientId - client id
 * @param destinataireId - destinataire id
 */
export async function checkExistingAssociation(clientId: number, destinataireId: number) {
    console.log("log ====> checkExistingAssociation function called in path: src/services/backend-services/Bk_UserService.ts")

    console.log("Checking if association exists between client and destinataire with IDs path: src/services/users/Bk_UserService.ts  :", clientId, destinataireId);
    try {
        const association = await prisma.clientDestinataire.findFirst({
            where: {
                clientId: clientId,
                destinataireId: destinataireId,
            }
        });

        if (association) {
            console.log("Association exists between client and destinataire with IDs returning association:", association);
            return association;
        }

        console.log("Association doesn't exist between client and destinataire with IDs:", clientId, destinataireId);
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

export async function associateDestinataireToCurrentClient(userId: number, destinataireId: number) {
    try {
        console.log("log ====> function associateDestinataireToCurrentClient called in path: src/services/users/Bk_UserService.ts  ")

        console.log("Creating association between client and destinataire with IDs:", userId, destinataireId);
        const association = await prisma.clientDestinataire.create({
            data: {
                clientId: userId,
                destinataireId: destinataireId,
            }
        });

        if (association) {
            console.log("Association created successfully.");
            return association;
        }
        console.log("Error: can't associate! return null.");
        return null;

    } catch (error) {
        console.error("Error associating user as destinataire:", error);
        throw error; // Relancer l'erreur pour remonter jusqu'à l'appelant
    }
}

export async function getUserByEmail(email: string): Promise<UserLoginDto | null> {
    console.log("log ====> getUserByEmail function called in path: src/services/backend-services/Bk_UserService.ts")
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


export async function getUserProfileById(userId: number) : Promise<ProfileDto | null> {
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
