// path: src/services/backend-services/UserService.ts
'use server';

import {
    CreateDestinataireDto,
    CreateFullUserDto,
    DestinataireResponseDto,
    DestinataireResponseWithRoleDto,
    UpdateAddressDto,
    FullUserResponseDto,
    Roles,
    UserLoginResponseDto,
    UserModelDto,
    UserResponseDto, CreateUserDto
} from "@/utils/dtos";
import prisma from "@/utils/db";
import {VerificationDataType} from "@/utils/types";
import {sendVerificationEmail} from "@/lib/mailer";

/**
 *  Create new user as CLIENT
 *
 * @param newUser
 * @param address
 * @returns new created user data
 */
export async function registerUser(newUser: CreateUserDto, address: UpdateAddressDto): Promise<FullUserResponseDto | null> {

    console.log("log ====> registerUser called in path: src/services/backend-services/UserService.ts")


    console.log("newUser.address from createUser : ", newUser.address);
    try {
        const formattedUser = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            name: newUser.name,
            birthDate: newUser.birthDate,
            phoneNumber: newUser.phoneNumber,
            email: newUser.email,
            verificationToken: newUser.verificationToken,
            verificationTokenExpires: newUser.verificationTokenExpires,
            addressId: address.id,
            isVerified: false,
        };

        console.log("formattedUser after is: ", formattedUser);

        const createdUser = await prisma.user.create({
            data: formattedUser,
            include: {
                Address: true // Inclusion de l'adresse
            }
        });

        if (!createdUser) {
            console.log("Error can't create user");
            return null;
        }

        // Retourner uniquement les données sécurisées
        return {
            id: createdUser.id,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            name: createdUser.name,
            birthDate: createdUser.birthDate,
            email: createdUser.email,
            phoneNumber: createdUser.phoneNumber,
            image: createdUser.image,
            roles: createdUser.roles,
            address: address, // Inclut l'adresse
        } as UserResponseDto;

    } catch (error) {
        console.error("Error registering user:", error);
        throw error; // Relancer l'erreur pour la capturer dans RegisterForm
    }
}


/**
 * Check if user already exists in the database
 * @param email
 * @param phoneNumber
 * @returns {Promise<FullUserDto | null>} user or null
 */

export async function isUserAlreadyExist(email: string, phoneNumber: string): Promise<UserModelDto | null> {

    console.log("log ====> isUserAlreadyExist called in path: src/services/backend-services/UserService.ts")

    try {

        const existedUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: email},
                    {phoneNumber: phoneNumber},
                ],
            }, select: {
                id: true,
                firstName: true,
                lastName: true,
                name: true,
                birthDate: true,
                phoneNumber: true,
                email: true,
                roles: true,
                image: true,
                isVerified: true,
                emailVerified: true,
                verificationToken: true,
                verificationTokenExpires: true,
                addressId: true,
            }
        }) as UserModelDto;

        if (!existedUser) {
            return null;
        }
        return existedUser;

    } catch (error) {
        console.error("Error getting user by email:", error);
        throw error;
    }
}

/**
 * Check if destinataire already exist in the database
 * @param email
 * @param phoneNumber
 * @returns {Promise<DestinataireResponseDto | null>} user or null
 */

export async function isDestinataireAlreadyExist(email: string, phoneNumber: string): Promise<DestinataireResponseWithRoleDto | null> {

    console.log("log ====> isDestinataireAlreadyExist function called in path: src/services/backend-services/UserService.ts")

    console.log("log ====> email and phoneNumber passed to isDestinataireAlreadyExist function in path: src/services/backend-services/UserService.ts: ", email, phoneNumber);

    try {

        const user = await prisma.user.findFirst({
            where: {
                email: email,
                phoneNumber: phoneNumber,

            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                name: true,
                phoneNumber: true,
                email: true,
                roles: true,
                image: true,
            }
        }) as DestinataireResponseWithRoleDto;


        if (!user) {
            console.log("log ====> destinataire NOT FOUND in isDestinataireAlreadyExist function in path: src/services/backend-services/UserService.ts return NULL");
            return null;
        }
        console.log("log ====> user found in isDestinataireAlreadyExist function in path: src/services/backend-services/UserService.ts: ", user);

        return user;

    } catch (error) {
        console.error("Error getting user by email:", error);
        throw error;
    }
}

/**
 * Create destinataire and return user
 * @param newDestinataire
 * @returns {Promise<DestinataireResponseDto>}
 */

export async function createDestinataire(newDestinataire: CreateDestinataireDto): Promise<DestinataireResponseWithRoleDto | null> {
    console.log("log ====> createDestinataire function called in path: src/services/backend-services/UserService.ts");

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
                roles: [Roles.DESTINATAIRE],
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                name: true,
                phoneNumber: true,
                email: true,
                image: true,
                roles: true,
            }
        });

        if (!destinataire) {
            return null;
        }

        console.log("log ====> destinataire created in path: src/services/backend-services/UserService.ts: ", destinataire);

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

    console.log("log ====> getUserByValidToken function called in path: src/services/backend-services/UserService.ts")

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
                roles: true,
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
 * @returns {Promise<void>}
 */
export async function updateUserAndResetTokenVerificationAfterVerification(userId: number) {

    console.log("log ====> updateUserAndResetTokenVerificationAfterVerification function called in path: src/services/backend-services/UserService.ts")

    console.log("path: src/services/users/UserService.ts : updateUserAndResetTokenVerification : userId", userId);

    try {
        await prisma.user.update({
            where: {id: userId},
            data: {
                isVerified: true,
                roles: [Roles.CLIENT],
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
                roles: true
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
 * @returns {Promise<void>} void
 */
export async function updateVerificationTokenForOldUser(userId: number, verificationData: VerificationDataType) {

    console.log("log ====> updateVerificationTokenForOldUser function called in path: src/services/backend-services/UserService.ts")

    await prisma.user.update({
        where: {id: userId},
        data: {
            roles: [Roles.CLIENT],
            isVerified: false,
            emailVerified: null,
            verificationToken: verificationData.verificationToken,
            verificationTokenExpires: new Date(verificationData.verificationTokenExpires),
        }
    });
}


/**
 * find user by email
 * @param email
 * @returns user data
 */
export async function getUserByEmail(email: string): Promise<UserLoginResponseDto | null> {

    console.log("log ====> getUserByEmail function called in path: src/services/backend-services/UserService.ts")

    try {
        const userByEmailFound = await prisma.user.findFirst({
            where: {
                email: email,
            },
            select: {
                id: true,
                email: true,
                password: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                image: true,
                roles: true,
                isVerified: true,
                emailVerified: true,
                verificationToken: true,
                verificationTokenExpires: true
            }
        });

        if (!userByEmailFound) {
            return null;
        }
        return userByEmailFound as UserLoginResponseDto;
    } catch (error) {
        console.error("Error getting user by email:", error);
        throw error;
    }
}

export async function getUserById(id: number): Promise<CreateDestinataireDto | null> {

    console.log("log ====> getUserByEmail function called in path: src/services/backend-services/UserService.ts")

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

/**
 * Update destinataire to client
 * @param destinataire
 * @param birthDate
 * @param password
 * @param addressId
 * @param verificationData
 * @returns {Promise<DestinataireResponseDto>} user data with updated fields or null if not found
 */

export async function updateDestinataireToClient(
    destinataire: UserModelDto,
    birthDate: Date,
    password: string,
    addressId: UpdateAddressDto,
    verificationData: VerificationDataType
): Promise<FullUserResponseDto | null> {

    console.log("log ====> updateDestinataireToClient function called in path: src/services/backend-services/UserService.ts")


    console.log("Updating destinataire to client with ID path: src/services/users/UserService.ts :", destinataire.id);

    try {

        const user = await prisma.user.update({
            where: {
                id: destinataire.id,
            },
            data: {
                birthDate: birthDate,
                roles: [Roles.CLIENT],
                password: password,
                addressId: addressId.id,
                isVerified: false,
                verificationToken: verificationData.verificationToken,
                verificationTokenExpires: new Date(verificationData.verificationTokenExpires),
            },
            include: {
                Address: true,
            },
        });

        if (!user) {
            return null;
        }

        // Map the returned user to FullUserResponseDto with null checks
        const fullUserResponseDto: FullUserResponseDto = {
            id: user.id,
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            name: user.name ?? '',
            birthDate: user.birthDate ?? new Date(),
            email: user.email,
            phoneNumber: user.phoneNumber ?? '',
            roles: (user.roles ?? [Roles.CLIENT]) as Roles[],
            image: user.image ?? '',
            isVerified: user.isVerified,
            emailVerified: user.emailVerified ?? new Date(),
            verificationToken: user.verificationToken ?? '',
            verificationTokenExpires: user.verificationTokenExpires ?? new Date(),
            address: addressId as UpdateAddressDto,
        };

        await sendVerificationEmail(user.name ?? '', user.email, verificationData.verificationToken);

        return fullUserResponseDto;
    } catch (error) {
        console.error("Error updating destinataire:", error);
        throw error;
    }
}


/**
 * Check if association exists between client and destinataire
 * @param clientId - client id
 * @param destinataireId - destinataire id
 * @returns {Promise<ClientDestinataire | null>} client destinataire or null
 */
export async function checkExistingAssociation(clientId: number, destinataireId: number) {
    console.log("log ====> checkExistingAssociation function called in path: src/services/backend-services/UserService.ts")

    console.log("Checking if association exists between client and destinataire with IDs path: src/services/users/UserService.ts  :", clientId, destinataireId);
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
        console.log("log ====> function associateDestinataireToCurrentClient called in path: src/services/users/UserService.ts  ")

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
