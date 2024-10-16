// url : /api/v1/users/register
import {NextRequest, NextResponse} from 'next/server';
import {CreateUserDto, UserResponseDto} from '@/utils/dtos';
import {prisma} from "@/utils/db";
import bcrypt from "bcryptjs";
import {JWTPayload} from "@/utils/types";
import {setCookie} from "@/utils/generateToken";
import {errorHandler} from "@/utils/handelErrors";
import {capitalizeFirstLetter, toLowerCase} from "@/utils/stringUtils";
import {registerUserSchema} from "@/utils/validationSchema";

/**
 * Register a new user
 * @param request - The request object
 * @returns - The response object
 */
export async function POST(request: NextRequest) {
    try {
        console.log("POST request received");

        // Récupérer les données de l'utilisateur à partir de la requête
        const body = (await request.json()) as CreateUserDto;

        // Vérifier que les données sont renseignées
        if (!body) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }
        console.log("Register user request body: ", body);

        // Valider les données de l'utilisateur avec le schéma de validation
        const
            {
                success,
                error,
                data: validatedData
            } = registerUserSchema.safeParse(body);

        console.log("Register user request validation result: ", success, error);
        // Vérifier si les données sont valides
        if (!success) {
            return NextResponse.json(
                {error: error?.errors[0].message},
                {status: 400}
            );
        }

        console.log("Register user request validation result success: ", success, error);


        // Récupérer les données de l'utilisateur à partir de la validation réussie
        const {
            firstName,
            lastName,
            birthDate,
            gender,
            phoneNumber,
            email,
            password,
            address
        } = validatedData;

        // formated user data
        const formattedUser = {
            firstName: capitalizeFirstLetter(firstName),
            lastName: capitalizeFirstLetter(lastName),
            birthDate,
            gender: gender,
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
        }

        console.log("Register user request formatted user: ", formattedUser);

        // Vérifier si l'adresse et les informations utilisateur existent déjà
        const [existingAddress, phoneNumberExists, emailExists] = await Promise.all([
            prisma.address.findFirst({
                where: {
                    street: formattedUser.address.street,
                    number: formattedUser.address.number,
                    city: formattedUser.address.city,
                    zipCode: formattedUser.address.zipCode,
                    country: formattedUser.address.country
                }
            }),
            prisma.user.findFirst({
                where: {
                    phoneNumber: formattedUser.phoneNumber
                }
            }),
            prisma.user.findFirst({
                where: {
                    email: formattedUser.email
                }
            })
        ]);

        console.log("Register user request existing data: ", existingAddress, phoneNumberExists, emailExists);


        // Gérer les erreurs liées à l'existence des données (si l'adresse ou l'email ou le numéro de téléphone existe déjà)
        if (phoneNumberExists || emailExists) {
            console.log("account already exists");
            return NextResponse.json({error: 'account already exists, please try to connect'}, {status: 400});
        }

        // Créer l'adresse si elle n'existe pas
        const addressToUse = existingAddress || await prisma.address.create({
            data: formattedUser.address,
        });

        if(!addressToUse) {
            console.log("Failed to create address");
            return NextResponse.json({error: "Failed to create address"}, {status: 500});
        }

        console.log("Register user request address to use: ", addressToUse);
        // Hashes le mot de passe et créer un nouvel utilisateur dans la base de données
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Register user request hashed password");

        const newUser = await prisma.user.create({
            data: {
                firstName: formattedUser.firstName,
                lastName: formattedUser.lastName,
                dateOfBirth: new Date(formattedUser.birthDate),
                gender: formattedUser.gender,
                phoneNumber: formattedUser.phoneNumber,
                email: formattedUser.email,
                password: hashedPassword,
                addressId: addressToUse.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
                gender: true,
                phoneNumber: true,
                email: true,
                imageUrl: true,
                role: true
            }
        });


        // Vérifier si l'utilisateur a été créé avec succès dans la base de données pour éviter typescript errors (car user peut être null)
        if (!newUser) {
            console.log("Failed to register user");
            return NextResponse.json({error: "Failed to register user"}, {status: 500});
        }

        console.log("Register user request new user created successfully : ", newUser);

        // Générer un cookie JWT avec les informations de l'utilisateur
        const jwtPayload: JWTPayload = {
            id: newUser.id,
            role: newUser.role,
            userEmail: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            phoneNumber: newUser.phoneNumber,
            imageUrl: newUser.imageUrl
        };


        if (!jwtPayload) {
            return NextResponse.json(
                {error: "Error creating jwt"},
                {status: 500}
            );
        }
        console.log("Register user request jwt payload: ", jwtPayload);

        // Générer le cookie JWT
        const cookie = setCookie(jwtPayload);

        // Convertir les données de l'utilisateur en un objet UserResponseDto
        const userResponse: UserResponseDto = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            dateOfBirth: newUser.dateOfBirth?.toISOString() || "",
            gender: newUser.gender ?? "",
            phoneNumber: newUser.phoneNumber ?? "",
            email: newUser.email,
            imageUrl: newUser.imageUrl,
            role: newUser.role
        };


        // Renvoyer les données de l'utilisateur et le message de succès (201 pour création réussie)
        return NextResponse.json(
            {user: userResponse, message: "Registered & authenticated"},
            {
                status: 201,
                headers: {'Set-Cookie': cookie}
            }
        );

    } catch (error) {
        // console.error("Error in user registration: ", error);
        return errorHandler(`Internal server error: ${error}`, 500);
    }
}
