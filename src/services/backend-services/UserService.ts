// path: src/services/backend-services/UserService.ts


import {
    BaseDestinataireDto,
    CreateFullUserDto,
    DestinataireResponseDto, DestinataireResponseWithRoleDto,
    FullAddressDTO,
    FullUserResponseDto, Role, UserLoginResponseDto,
    UserModelDto, UserResponseDto
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
export async function registerUser(newUser: CreateFullUserDto, address: FullAddressDTO): Promise<FullUserResponseDto | null> {
    console.log("newUser.address from createUser: ", newUser.address);
    try {
        const formattedUser = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            name: newUser.name,
            birthDate: newUser.birthDate,
            phoneNumber: newUser.phoneNumber,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role,
            verificationToken: newUser.verificationToken,
            verificationTokenExpires: newUser.verificationTokenExpires,
            addressId: address.id,
            isVerified: false,
            image: ''
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

        // Construction de l'objet `FullUserResponseDto` avec les données de l'utilisateur et l'adresse
        return {
            id: createdUser.id,
            name: createdUser.name,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            birthDate: createdUser.birthDate,
            email: createdUser.email,
            phoneNumber: createdUser.phoneNumber,
            password: createdUser.password,
            role: createdUser.role,
            image: createdUser.image,
            isVerified: createdUser.isVerified,
            emailVerified: createdUser.emailVerified,
            verificationToken: createdUser.verificationToken,
            verificationTokenExpires: createdUser.verificationTokenExpires,
            address: {
                id: address.id,
                street: address.street,
                number: address.number,
                city: address.city,
                zipCode: address.zipCode,
                country: address.country,
            }
        } as FullUserResponseDto;

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
                role: true,
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

export async function isDestinataireAlreadyExist(email: string, phoneNumber: string): Promise<DestinataireResponseDto | null> {
    try {

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: email},
                    {phoneNumber: phoneNumber},
                    {role: Role.DESTINATAIRE}
                ],
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                name: true,
                phoneNumber: true,
                email: true,
                role: true,
            }
        }) as DestinataireResponseDto;

        if (!user) {
            return null;
        }
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
export async function createDestinataire(newDestinataire: BaseDestinataireDto): Promise<DestinataireResponseWithRoleDto | null> {
    try {
        const destinataireData = {
            ...newDestinataire,
            role: Role.DESTINATAIRE
        };

        const destinataire = await prisma.user.create({
            data: destinataireData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                name: true,
                phoneNumber: true,
                email: true,
                role: true,
            }
        });

        if (!destinataire) {
            return null;
        }

        return destinataire as DestinataireResponseWithRoleDto;
    } catch (error) {
        console.error("Error creating destinataire:", error);
        throw error; // Relancer l'erreur pour la capturer dans RegisterForm
    }
}


/**
 * Get user by valid token and check if the token is not expired
 * @param token
 * @returns {Promise<UserResponseDto>} user
 */
export async function getUserByValidToken(token: string): Promise<UserResponseDto | null> {
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
 * @returns {Promise<void>}
 */
export async function updateUserAndResetTokenVerificationAfterVerification(userId: number) {
    console.log("path: src/services/users/UserService.ts : updateUserAndResetTokenVerification : userId", userId);

    try {
        await prisma.user.update({
            where: {id: userId},
            data: {
                isVerified: true,
                role: Role.CLIENT,
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
 * @returns {Promise<void>} void
 */
export async function updateVerificationTokenForOldUser(userId: number, verificationData: VerificationDataType) {
    await prisma.user.update({
        where: {id: userId},
        data: {
            role: Role.CLIENT,
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
                role: true,
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
    addressId: FullAddressDTO,
    verificationData: VerificationDataType
): Promise<FullUserResponseDto | null> {
    try {
        const user = await prisma.user.update({
            where: {
                id: destinataire.id,
            },
            data: {
                birthDate: birthDate,
                role: Role.CLIENT,
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
            role: (user.role ?? Role.CLIENT) as Role,
            image: user.image ?? '',
            isVerified: user.isVerified,
            emailVerified: user.emailVerified ?? new Date(),
            verificationToken: user.verificationToken ?? '',
            verificationTokenExpires: user.verificationTokenExpires ?? new Date(),
            address: addressId as FullAddressDTO,
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
    try {
        return await prisma.clientDestinataire.findFirst({
            where: {
                clientId: clientId,
                destinataireId: destinataireId,
            }
        });
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
        // Ajouter l'association entre le destinataire et le client
        await prisma.clientDestinataire.create({
            data: {
                clientId: userId,
                destinataireId: destinataireId,
            }
        });
    } catch (error) {
        console.error("Error associating user as destinataire:", error);
        throw error;
    }
}

