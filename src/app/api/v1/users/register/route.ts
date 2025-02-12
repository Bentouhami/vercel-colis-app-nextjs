// Path: src/app/api/v1/users/register/route.ts

import { NextRequest, NextResponse } from "next/server"

import { errorHandler } from "@/utils/handelErrors"
import { capitalizeFirstLetter, toLowerCase } from "@/utils/stringUtils"
import { registerUserBackendSchema } from "@/utils/validationSchema"
import { saltAndHashPassword } from "@/lib/auth"
import { generateVerificationTokenForUser } from "@/utils/generateToken"
import { VerificationDataType } from "@/utils/types"
import {
    createAddress,
    isAddressAlreadyExist,
} from "@/services/backend-services/Bk_AddressService"
import {
    isUserAlreadyExist,
    registerUser,
    updateDestinataireToClient,
    updateVerificationTokenForOldUser,
} from "@/services/backend-services/Bk_UserService"
import { sendVerificationEmail } from "@/lib/mailer"
import {
    BaseClientDto,
    FullUserResponseDto,
    RegisterClientDto,
    UserModelDto,
} from "@/services/dtos/users/UserDto"
import { AddressResponseDto } from "@/services/dtos/addresses/AddressDto"
import { Roles } from "@/services/dtos/enums/EnumsDto"

/**
 * @method POST - Register a new user in DB and send a verification email
 * @route /api/v1/users/register
 * @access Public
 */
// ... Previous imports and setup remain the same

export async function POST(request: NextRequest) {
    console.log("POST request received in path: src/app/api/v1/users/register/route.ts");

    if (request.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
        const body: RegisterClientDto = await request.json();
        if (!body) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { success, error, data: validatedData } = registerUserBackendSchema.safeParse(body);
        if (!success) {
            console.log("Validation error:", error);
            return NextResponse.json({ error: error?.errors[0].message }, { status: 400 });
        }

        const { firstName, lastName, birthDate, phoneNumber, email, password, address, roles } = validatedData;

        // Format email and phoneNumber for checking
        const formattedEmail = toLowerCase(email);
        const formattedPhone = phoneNumber;

        // Check user existence first
        let existedUser = await isUserAlreadyExist(formattedEmail, formattedPhone);
        console.log("User existence check result:", existedUser);

        if (existedUser) {
            // Handle existing user cases
            if (existedUser.roles.includes(Roles.CLIENT) || existedUser.roles.includes(Roles.SUPER_ADMIN)) {
                if (existedUser.isVerified) {
                    return NextResponse.json(
                        { error: "User already exists and is verified. Please log in." },
                        { status: 400 }
                    );
                } else {
                    // User is a client but not verified: update token and resend email
                    const verificationData = generateVerificationTokenForUser();
                    if (!verificationData) {
                        return NextResponse.json({ error: "Failed to generate verification data" }, { status: 500 });
                    }
                    await updateVerificationTokenForOldUser(existedUser.id, verificationData);
                    await sendVerificationEmail(existedUser.name, existedUser.email, verificationData.verificationToken);
                    return NextResponse.json({
                        message: "User already exists, please check your email to verify your account"
                    }, { status: 200 });
                }
            } else if (existedUser.roles.includes(Roles.DESTINATAIRE)) {
                // Process address for destinataire upgrade
                const extractedBaseAddress: AddressResponseDto = {
                    street: toLowerCase(address.street),
                    number: address.number,
                    city: capitalizeFirstLetter(address.city),
                    zipCode: address.zipCode,
                    country: capitalizeFirstLetter(address.country),
                };

                let addressToUse = await isAddressAlreadyExist(extractedBaseAddress);
                if (!addressToUse) {
                    addressToUse = await createAddress(extractedBaseAddress);
                    if (!addressToUse) {
                        return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
                    }
                }

                // Generate verification data and hash password
                const verificationData = generateVerificationTokenForUser();
                const hashedPassword = await saltAndHashPassword(password);

                // Prepare user data for update
                const userData = {
                    ...existedUser,
                    birthDate: new Date(birthDate),
                    addressId: addressToUse.id,
                    address: addressToUse,
                    password: hashedPassword,
                    verificationToken: verificationData.verificationToken,
                    verificationTokenExpires: verificationData.verificationTokenExpires,
                };

                const registeredUser = await updateDestinataireToClient(userData);
                if (!registeredUser) {
                    return NextResponse.json({ error: "Failed to update destinataire to client" }, { status: 500 });
                }

                await sendVerificationEmail(registeredUser?.name!, registeredUser.email, verificationData.verificationToken);
                return NextResponse.json({
                    message: "User updated successfully, please check your email to verify your account"
                }, { status: 200 });
            }
        } else {
            // User doesn't exist: process address and create new user
            const extractedBaseAddress: AddressResponseDto = {
                street: toLowerCase(address.street),
                number: address.number,
                city: capitalizeFirstLetter(address.city),
                zipCode: address.zipCode,
                country: capitalizeFirstLetter(address.country),
            };

            let addressToUse = await isAddressAlreadyExist(extractedBaseAddress);
            if (!addressToUse) {
                addressToUse = await createAddress(extractedBaseAddress);
                if (!addressToUse) {
                    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
                }
            }

            // Format user data with address
            const formattedUser: BaseClientDto = {
                firstName: capitalizeFirstLetter(firstName),
                lastName: capitalizeFirstLetter(lastName),
                name: `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`,
                birthDate: new Date(birthDate),
                phoneNumber: formattedPhone,
                email: formattedEmail,
                image: null,
                roles: roles ? [Roles.CLIENT] : [],
                password: password,
                address: addressToUse,
            };

            const verificationData = generateVerificationTokenForUser();
            if (!verificationData) {
                return NextResponse.json({ error: "Failed to generate verification data" }, { status: 500 });
            }

            const hashedPassword = await saltAndHashPassword(formattedUser.password);

            // Prepare user data for creation
            const userData = {
                firstName: formattedUser.firstName,
                lastName: formattedUser.lastName,
                name: formattedUser.name,
                birthDate: formattedUser.birthDate,
                phoneNumber: formattedUser.phoneNumber,
                email: formattedUser.email,
                password: hashedPassword,
                verificationToken: verificationData.verificationToken,
                verificationTokenExpires: verificationData.verificationTokenExpires,
                addressId: addressToUse.id,
                address: addressToUse,
            };

            const registeredUser = await registerUser(userData);
            if (!registeredUser || !registeredUser.name) {
                return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
            }

            await sendVerificationEmail(registeredUser.name, registeredUser.email, verificationData.verificationToken);
            return NextResponse.json({
                message: "User created successfully, please check your email to verify your account"
            }, { status: 201 });
        }
    } catch (error) {
        return errorHandler(`Internal server error: ${error}`, 500);
    }
}