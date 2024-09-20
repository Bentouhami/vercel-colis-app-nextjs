import {NextRequest, NextResponse} from 'next/server';
import {CreateUserDto, UserResponseDto} from '@/app/utils/dtos';
import {registerUserSchema} from "@/app/utils/validationSchema";
import {prisma} from "@/app/utils/db";
import bcrypt from "bcryptjs";
import {JWTPayload} from "@/app/utils/types";
import {setCookie} from "@/app/utils/generateToken";
import {errorHandler} from "@/app/utils/handelErrors";

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as CreateUserDto;

        // Validate the request body
        const validated = registerUserSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({error: validated.error.errors[0].message}, {status: 400});
        }

        const {firstName, lastName, birthDate, gender, phoneNumber, email, password, address} = validated.data;

        let newAddress = await prisma.address.findFirst({
            where: {
                street: address.street,
                number: address.number,
                city: address.city,
                zipCode: address.zipCode,
                country: address.country
            }
        });

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

        if (phoneNumberExists) {
            return NextResponse.json({error: "Phone number already exists"}, {status: 400});
        }

        // Vérifier si l'email existe déjà dans la base de données (pour éviter les conflits des contraintes de clé unique sur le champ email)
        const emailExists = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (emailExists) {
            return NextResponse.json({error: "Email already exists"}, {status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
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

        const jwtPayload: JWTPayload = {
            id: user.id,
            role: user.role,
            userEmail: user.email,
        };

        const cookie = setCookie(jwtPayload);

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
