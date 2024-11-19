// Path: src/app/api/v1/users/register/route.ts


import { NextRequest, NextResponse } from 'next/server';
import {
    CreateAddressDto,
    BaseClientDto,
    UpdateAddressDto,
    FullUserResponseDto,
    Roles,
    UserModelDto, CreateUserDto, RegisterClientDto,
} from '@/utils/dtos';
import { errorHandler } from "@/utils/handelErrors";
import { capitalizeFirstLetter, toLowerCase } from "@/utils/stringUtils";
import { registerUserBackendSchema, RegisterUserBackendType } from "@/utils/validationSchema";
import { hashPassword } from "@/lib/auth";
import { generateVerificationTokenForUser } from "@/utils/generateToken";
import { VerificationDataType } from "@/utils/types";
import { createAddress, isAddressAlreadyExist } from "@/services/backend-services/AddresseService";
import {
    isUserAlreadyExist,
    registerUser,
    updateDestinataireToClient,
    updateVerificationTokenForOldUser
} from "@/services/backend-services/UserService";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
    if (request.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
        console.log("POST request received");

        const body = (await request.json()) as RegisterClientDto;

        if (!body) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log("Register registeredUser request body: ", body);

        const { success, error, data: validatedData } = registerUserBackendSchema.safeParse(body);

        if (!success) {
            return NextResponse.json({ error: error?.errors[0].message }, { status: 400 });
        }

        const { firstName, lastName, birthDate, phoneNumber, email, password, address } = validatedData;

        const extractedBaseAddress: CreateAddressDto = {
            street: toLowerCase(address.street),
            number: address.number,
            city: capitalizeFirstLetter(address.city),
            zipCode: address.zipCode,
            country: capitalizeFirstLetter(address.country),
        };

        // Format user data with roles array
        const formattedUser: BaseClientDto = {
            firstName: capitalizeFirstLetter(firstName),
            lastName: capitalizeFirstLetter(lastName),
            name: `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`,
            birthDate: new Date(birthDate),
            phoneNumber,
            email: toLowerCase(email),
            image: null,
            roles: [Roles.CLIENT], // Updated to roles array with default CLIENT Roles
            password,
            address: extractedBaseAddress as CreateAddressDto
        };

        console.log("Formatted address registeredUser:", formattedUser.address);

        let addressToUse: UpdateAddressDto | null = await isAddressAlreadyExist(extractedBaseAddress);

        if (!addressToUse) {
            addressToUse = await createAddress(extractedBaseAddress);
            if (!addressToUse) {
                return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
            }
        }

        console.log("addressToUse is: ", addressToUse);

        const verificationData = generateVerificationTokenForUser() as VerificationDataType;

        if (!verificationData) {
            return NextResponse.json({ error: "Failed to generate verification data" }, { status: 500 });
        }

        const hashedPassword = await hashPassword(formattedUser.password);

        let existedUser: UserModelDto | null = await isUserAlreadyExist(formattedUser.email, formattedUser.phoneNumber);

        console.log("isUserAlreadyExist returned:", existedUser);

        let registeredUser: FullUserResponseDto | null;

        // Create a new user if not existing
        if (!existedUser) {
            const { firstName, lastName, name, birthDate, phoneNumber, email } = formattedUser;

            const userData: CreateUserDto = {
                firstName,
                lastName,
                name,
                birthDate,
                email,
                phoneNumber,
                password: hashedPassword,
                address: addressToUse,
                verificationToken: verificationData.verificationToken,
                verificationTokenExpires: verificationData.verificationTokenExpires,
            };

            registeredUser = await registerUser(userData, addressToUse) as FullUserResponseDto;

            if (!registeredUser) {
                return NextResponse.json({ error: "Failed to create registeredUser" }, { status: 500 });
            }

            await sendVerificationEmail(registeredUser.name, registeredUser.email, verificationData.verificationToken);

            return NextResponse.json({ message: "User created successfully, please check your email to verify your account" }, { status: 201 });
        }

        // Handle other cases if user already exists
        if (existedUser.roles.includes(Roles.CLIENT) && !existedUser.isVerified) {
            await updateVerificationTokenForOldUser(existedUser.id, verificationData);
            await sendVerificationEmail(existedUser.name, existedUser.email, verificationData.verificationToken);
            return NextResponse.json({
                message: "User already exists, please login or verify your email to activate your account",
                status: 200
            });
        }

        if (existedUser.roles.includes(Roles.DESTINATAIRE)) {
            registeredUser = await updateDestinataireToClient(
                existedUser,
                formattedUser.birthDate,
                hashedPassword,
                addressToUse,
                verificationData
            );

            if (!registeredUser) {
                return NextResponse.json({ error: "Failed to update destinataire" }, { status: 500 });
            }

            await sendVerificationEmail(registeredUser.name, registeredUser.email, verificationData.verificationToken);

            return NextResponse.json({ message: "User created successfully, please check your email to verify your account" }, { status: 201 });
        }

        if ((existedUser.roles.includes(Roles.CLIENT) || existedUser.roles.includes(Roles.ADMIN)) && existedUser.isVerified) {
            console.log("User is a client or admin and verified, returning error");
            return NextResponse.json({ error: "User already exists and is verified. Please log in." }, { status: 400 });
        }

    } catch (error) {
        return errorHandler(`Internal server error: ${error}`, 500);
    }
}
