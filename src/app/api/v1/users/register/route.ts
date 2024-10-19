import {NextRequest, NextResponse} from 'next/server';
import {UserResponseDto} from '@/utils/dtos';
import bcrypt from "bcryptjs";
import {errorHandler} from "@/utils/handelErrors";
import {capitalizeFirstLetter, toLowerCase} from "@/utils/stringUtils";
import {registerUserBackendSchema, RegisterUserBackendType} from "@/utils/validationSchema";
import prisma from "@/utils/db";
import {randomBytes} from "crypto";
import {createAddress, isAddressAlreadyExist} from "@/services/address/AddresseService";
import {isUserAlreadyExist} from "@/services/users/UserService";
import { sendVerificationEmail} from "@/lib/mailer";
import {hashPassword} from "@/lib/auth";

export async function POST(request: NextRequest) {

    if (request.method !== "POST") {
        return NextResponse.json({error: "Method not allowed"}, {status: 405});
    }

    try {
        console.log("POST request received");

        // Récupérer les données de l'utilisateur à partir de la requête
        const body = (await request.json()) as RegisterUserBackendType;

        // Vérifier que les données sont renseignées
        if (!body) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }
        console.log("Register user request body: ", body);

        // Valider les données de l'utilisateur avec le schéma de validation
        const {success, error, data: validatedData} = registerUserBackendSchema.safeParse(body);

        if (!success) {
            return NextResponse.json(
                {error: error?.errors[0].message},
                {status: 400}
            );
        }

        const {
            firstName,
            lastName,
            birthDate,
            phoneNumber,
            email,
            password,
            address
        } = validatedData;

        // Formater les données de l'utilisateur
        const formattedUser = {
            firstName: capitalizeFirstLetter(firstName),
            lastName: capitalizeFirstLetter(lastName),
            birthDate,
            phoneNumber,
            email: toLowerCase(email),
            password,
            address: {
                street: toLowerCase(address.street),
                number: address.number,
                city: capitalizeFirstLetter(address.city),
                zipCode: address.zipCode,
                country: capitalizeFirstLetter(address.country)
            }
        } as RegisterUserBackendType;

        // Vérifier si l'utilisateur existe déjà dans la base de données
        const existedUser = await isUserAlreadyExist(formattedUser.email, formattedUser.phoneNumber);

        // Si l'utilisateur n'existe pas, créer un nouvel utilisateur
        const existingAddress = await isAddressAlreadyExist(formattedUser.address);

        // Créer l'adresse si elle n'existe pas
        const addressToUse = existingAddress || await createAddress(formattedUser.address);
        if (!addressToUse) {
            return NextResponse.json({error: "Failed to create address"}, {status: 500});
        }

        // Générer un token de vérification de l'email
        // Générer un token de vérification
        const verificationToken = randomBytes(32).toString("hex");
        const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 15); // Expiration en 15 minutes

        // hash password
        const hashedPassword = await hashPassword(formattedUser.password);
        if (existedUser) {

            if (!existedUser.password) {
                existedUser.role = "DESTINATAIRE";
            }
            // L'utilisateur existe déjà, vérifions son rôle et l'état de vérification
            if (existedUser.role === "DESTINATAIRE" && !existedUser.isVerified) {
                // Mettre à jour l'utilisateur avec le token de vérification
                await prisma.user.update({
                    where: {id: existedUser.id},
                    data: {
                        name: formattedUser.firstName + " " + formattedUser.lastName,
                        dateOfBirth: new Date(formattedUser.birthDate),
                        password: hashedPassword,
                        role: "CLIENT",
                        addressId: addressToUse.id,
                        verificationToken: verificationToken,
                        verificationTokenExpires: verificationTokenExpires
                    }
                });

                // Envoyer un email de vérification à l'utilisateur
                await sendVerificationEmail(existedUser.email, verificationToken);

                return NextResponse.json({message: "Vérification de l'email envoyée, valable pour 15 mins"}, {status: 200});
            } else if ((existedUser.role === "CLIENT" || existedUser.role === "ADMIN") && existedUser.isVerified) {
                // Si l'utilisateur est déjà un client ou un admin vérifié
                return NextResponse.json({error: "User already exists and is verified. Please log in."}, {status: 400});
            } else {
                // Si l'utilisateur est client ou admin, mais non vérifié, renvoyer un email de vérification
                const token = randomBytes(32).toString("hex");

                await prisma.user.update({
                    where: {id: existedUser.id},
                    data: {
                        verificationToken: token,
                        verificationTokenExpires: new Date(Date.now() + 1000 * 60 * 15)
                    }
                });

                await sendVerificationEmail(existedUser.email, token);
                return NextResponse.json({message: "Vérification de l'email envoyée, valable pour 15 mins"}, {status: 200});
            }
        }



        // Créer le nouvel utilisateur
        const newUser = await prisma.user.create({
            data: {
                firstName: formattedUser.firstName,
                lastName: formattedUser.lastName,
                name: formattedUser.firstName + " " + formattedUser.lastName,
                dateOfBirth: new Date(formattedUser.birthDate),
                phoneNumber: formattedUser.phoneNumber,
                email: formattedUser.email,
                password: hashedPassword,
                verificationToken,
                verificationTokenExpires,
                addressId: addressToUse.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
                phoneNumber: true,
                email: true,
                image: true,
                role: true
            }
        }) as UserResponseDto;

        if (!newUser) {
            return NextResponse.json({error: "Failed to register user"}, {status: 500});
        }

        // lig created user data et BREAK
        console.log("User created successfully: ", newUser);


        // Envoyer un email de vérification pour le nouvel utilisateur
        await sendVerificationEmail(newUser.email, verificationToken);


        // Renvoyer les données de l'utilisateur et le message de succès (201 pour création réussie)
        return NextResponse.json(
            {
                message:
                    "Registered & verification email sent"
            },
            {
                status: 201,
            }
        )
            ;

    } catch (error) {
        return errorHandler(`Internal server error: ${error}`, 500);
    }
}
