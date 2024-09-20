import {NextRequest, NextResponse} from 'next/server';
import {CreateUserDto, UserResponseDto} from '@/app/utils/dtos';
import {registerUserSchema} from "@/app/utils/validationSchema";
import {prisma} from "@/app/utils/db";
import bcrypt from "bcryptjs";
import {JWTPayload} from "@/app/utils/types";
import {setCookie} from "@/app/utils/generateToken";
import {errorHandler} from "@/app/utils/handelErrors";
import {Address, User} from "@prisma/client";

/**
 * Register a new user
 * @param request - The request object
 * @returns - The response object
 */
export async function POST(request: NextRequest) {
    try {
        // Récupérer les données de l'utilisateur à partir de la requête
        const body = (await request.json()) as CreateUserDto;

        // Vérifier que les données sont renseignées
        if (!body) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        // Valider les données de l'utilisateur avec le schéma de validation
        const validated = registerUserSchema.safeParse(body);

        // Vérifier si les données sont valides
        if (!validated.success) {
            return NextResponse.json({error: validated.error.errors[0].message}, {status: 400});
        }

        // Récupérer les données de l'utilisateur à partir de la validation réussie
        const {firstName, lastName, birthDate, gender, phoneNumber, email, password, address} = validated.data;

        // Vérifier si l'adresse est déjà existante dans la base de données (pour éviter les conflits des contraintes de clé unique sur les champs street, number, city, zipCode et country)
        let newAddress: Address | null = await prisma.address.findFirst({
            where: {
                street: address.street,
                number: address.number,
                city: address.city,
                zipCode: address.zipCode,
                country: address.country
            }
        });

        // Si l'adresse n'est pas déjà existante, créer une nouvelle adresse dans la base de données
        if (!newAddress) {
            newAddress = await prisma.address.create({
                data: {
                    street: address.street,
                    number: address.number,
                    city: address.city,
                    zipCode: address.zipCode,
                    country: address.country
                }
            });
        }

        // Vérifier di le numéro de téléphone existe déjà dans la base de données (pour éviter les conflicts des contraintes de clé unique sur le champ phoneNumber)
        const phoneNumberExists = await prisma.user.findFirst({
            where: {
                phoneNumber: phoneNumber
            }
        });

        // Si le numéro de téléphone existe déjà, renvoyer une erreur
        if (phoneNumberExists) {
            return NextResponse.json({error: "Phone number already exists"}, {status: 400});
        }

        // Vérifier si l'email existe déjà dans la base de données (pour éviter les conflits des contraintes de clé unique sur le champ email)
        const emailExists = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        // Si l'email existe déjà, renvoyer une erreur
        if (emailExists) {
            return NextResponse.json({error: "Email already exists"}, {status: 400});
        }

        // Vérifier si l'adresse a été créée avec succès dans la base de données pour éviter typescript errors (car newAddress peut être null)
        if (!newAddress) {
            return NextResponse.json({error: "Failed to register user"}, {status: 500});
        }
        // Hashes le mot de passe et créer un nouvel utilisateur dans la base de données
        const hashedPassword = await bcrypt.hash(password, 10);
        const user: User | null = await prisma.user.create({
            data: {
                firstName,
                lastName,
                dateOfBirth: new Date(birthDate),
                gender,
                phoneNumber,
                email,
                password: hashedPassword,
                addressId: newAddress.id,
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
                role: true
            }
        });

        // Vérifier si l'utilisateur a été créé avec succès dans la base de données pour éviter typescript errors (car user peut être null)
        if (!user) {
            return NextResponse.json({error: "Failed to register user"}, {status: 500});
        }

        // Convertir les données de l'utilisateur en un objet UserResponseDto
        const userResponse: UserResponseDto = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth?.toISOString() || "",
            gender: user.gender ?? false,
            phoneNumber: user.phoneNumber ?? "",
            email: user.email,
            role: user.role
        };

        // Générer un cookie JWT avec les informations de l'utilisateur
        const jwtPayload: JWTPayload = {
            id: user.id,
            role: user.role,
            userEmail: user.email,
        };

        // Générer le cookie JWT
        const cookie = setCookie(jwtPayload);

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
