import {NextRequest, NextResponse} from 'next/server';
import {
    BaseAddressDTO,
    BaseClientDto,
    CreateFullUserDto,
    FullAddressDTO,
    FullUserResponseDto,
    Role, UserModelDto,

} from '@/utils/dtos';
import {errorHandler} from "@/utils/handelErrors";
import {capitalizeFirstLetter, toLowerCase} from "@/utils/stringUtils";
import {registerUserBackendSchema, RegisterUserBackendType} from "@/utils/validationSchema";

import {hashPassword} from "@/lib/auth";
import {getVerificationData} from "@/utils/generateToken";
import {VerificationDataType} from "@/utils/types";
import {createAddress, isAddressAlreadyExist} from "@/services/backend-services/AddresseService";
import {
    isUserAlreadyExist,
    registerUser,
    updateDestinataireToClient,
    updateVerificationTokenForOldUser
} from "@/services/backend-services/UserService";
import {sendVerificationEmail} from "@/lib/mailer";

export async function POST(request: NextRequest) {
    if (request.method !== "POST") {
        return NextResponse.json({error: "Method not allowed"}, {status: 405});
    }

    try {
        console.log("POST request received");

        // Récupérer les données de l'utilisateur à partir de la requête
        const body = (await request.json()) as RegisterUserBackendType;

        if (!body) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        console.log("Register registeredUser request body: ", body);

        // Valider les données de l'utilisateur avec le schéma de validation
        const {success, error, data: validatedData} = registerUserBackendSchema.safeParse(body);

        if (!success) {
            return NextResponse.json({error: error?.errors[0].message}, {status: 400});
        }

        const {firstName, lastName, birthDate , phoneNumber, email, password, address} = validatedData;

        const extractedBaseAddresse: BaseAddressDTO = {
            street: toLowerCase(address.street),
            number: address.number,
            city: capitalizeFirstLetter(address.city),
            zipCode: address.zipCode,
            country: capitalizeFirstLetter(address.country),
        };

        // Formater les données de l'utilisateur
        const formattedUser: BaseClientDto = {
            firstName: capitalizeFirstLetter(firstName),
            lastName: capitalizeFirstLetter(lastName),
            name: `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`,
            birthDate: new Date(birthDate),
            phoneNumber,
            email: toLowerCase(email),
            password,
            address: extractedBaseAddresse as BaseAddressDTO
        };

        console.log("Formatted address registeredUser:", formattedUser.address);

        // Vérifier l'existence de l'adresse
        let addressToUse: FullAddressDTO | null = await isAddressAlreadyExist(extractedBaseAddresse);

        if (!addressToUse) {
            addressToUse = await createAddress(extractedBaseAddresse);
            if (!addressToUse) {
                return NextResponse.json({error: "Failed to create address"}, {status: 500});
            }
        }

        console.log("addressToUse is: ", addressToUse);

        // Générer les données de vérification et le mot de passe haché
        const verificationData = getVerificationData() as VerificationDataType;

        if (!verificationData) {
            return NextResponse.json({error: "Failed to generate verification data"}, {status: 500});
        }

        const hashedPassword = await hashPassword(formattedUser.password);

        // Vérifier si l'utilisateur existe déjà
        let existedUser: UserModelDto | null = await isUserAlreadyExist(formattedUser.email, formattedUser.phoneNumber);

        console.log("isUserAlreadyExist returned:", existedUser);

        let registeredUser : FullUserResponseDto | null = null;

        // Créer un nouvel utilisateur s'il n'existe pas
        if (!existedUser) {
            const {firstName, lastName, name, birthDate, phoneNumber, email} = formattedUser;

            const userData: CreateFullUserDto = {
                firstName: firstName,
                lastName: lastName,
                name: name,
                birthDate: birthDate,
                email: email,
                phoneNumber: phoneNumber,
                password: hashedPassword,
                address: addressToUse,
                role: Role.CLIENT,
                verificationToken: verificationData.verificationToken,
                verificationTokenExpires: verificationData.verificationTokenExpires,
            }

            registeredUser = await registerUser(userData, addressToUse) as FullUserResponseDto;

            if (!registeredUser) {
                return NextResponse.json({error: "Failed to create registeredUser"}, {status: 500});
            }

            await sendVerificationEmail(registeredUser.name, registeredUser.email, verificationData.verificationToken);

            return NextResponse.json({message: "User created successfully, please check your email to verify your account"}, {status: 201});
        }

        // Gérer les autres cas si l'utilisateur existe déjà
        if (existedUser.role === Role.CLIENT && !existedUser.isVerified) {
            await updateVerificationTokenForOldUser(existedUser.id, verificationData);
            await sendVerificationEmail(existedUser.name, existedUser.email, verificationData.verificationToken);
            return NextResponse.json({
                message: "User already exists, please login or verify your email to activate your account",
                status: 200
            });
        }

        if (existedUser.role === Role.DESTINATAIRE) {
            registeredUser = await updateDestinataireToClient(
                existedUser,
                formattedUser.birthDate,
                hashedPassword,
                addressToUse,
                verificationData
            );

            if (!registeredUser) {
                return NextResponse.json({error: "Failed to update destinataire"}, {status: 500});
            }

            await sendVerificationEmail(registeredUser.name, registeredUser.email, verificationData.verificationToken);

            return NextResponse.json({message: "User created successfully, please check your email to verify your account"}, {status: 201});
        }

        if ((existedUser.role === Role.CLIENT || existedUser.role === Role.ADMIN) && existedUser.isVerified) {
            console.log("User is a client or admin and verified, returning error");
            return NextResponse.json({error: "User already exists and is verified. Please log in."}, {status: 400});
        }

    } catch (error) {
        return errorHandler(`Internal server error: ${error}`, 500);
    }
}
