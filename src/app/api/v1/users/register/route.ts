import {NextRequest, NextResponse} from 'next/server';
import {CreateUserDto} from '@/app/utils/dtos';
import {registerUserSchema} from "@/app/utils/validationSchema";
import prisma from "@/app/utils/db";
import {Address, User} from "@prisma/client";
import bcrypt from "bcryptjs";
import {JWTPayload} from "@/app/utils/types";
import {setCookie} from "@/app/utils/generateToken";

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as CreateUserDto;

        // Validate the user body including address
        const validated = registerUserSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({error: validated.error.errors[0].message}, {status: 400});
        }

        const {firstName, lastName, birthDate, gender, phoneNumber, email, password, address} = validated.data;

        // Create address first
        const createdAddress: Address | null = await prisma.address.create({
            data: {
                street: address.street,
                number: address.number,
                city: address.city,
                zipCode: address.zipCode,
                country: address.country
            }
        });

        // crypto password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user with the addressId from the newly created address
        const user: User | null = await prisma.user.create({
            data: {
                firstName,
                lastName,
                dateOfBirth: new Date(birthDate),
                gender,
                phoneNumber,
                email,
                password: hashedPassword,
                addressId: createdAddress.id // Associate the created address
            },
            select: {
                id: true,
                email: true,
                role: true
            }
        });

        // Générez un jeton et retournez l'objet de réponse utilisateur
        const jwtPayload: JWTPayload = {
            id: user.id,
            role: user.role,
            userEmail: user.email,
        };

        const cookie = setCookie(jwtPayload);

        // retournez le message de création de l'utilisateur avec le token généré
        return NextResponse.json(
            {
                user,
                message: "Registered & authenticated",
            },
            {
                status: 201,
                headers: {
                    'Set-Cookie': cookie
                }
            }
        );
    } catch (error) {
        return NextResponse.json({error: "Internal server error", details: error.message}, {status: 500});
    }
}
