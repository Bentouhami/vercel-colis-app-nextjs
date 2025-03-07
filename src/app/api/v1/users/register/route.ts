// path: src/app/api/v1/users/register/route.ts

import {NextRequest, NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import {registerUserBackendSchema} from "@/utils/validationSchema";
import prisma from "@/utils/db";
import {generateVerificationTokenForUser} from "@/utils/generateToken";
import {sendVerificationEmail} from "@/lib/mailer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = registerUserBackendSchema.parse(body);
        const {firstName, lastName, birthDate, phoneNumber, email, password, address} = validatedData;

        //  Check if the user already exists
        const existingUser = await prisma.user.findFirst({
            where: {OR: [{email}, {phoneNumber}]},
            select: {id: true, isVerified: true, role: true, firstName: true, email: true}
        });

        if (existingUser) {
            //  If a user is verified, return error
            if (existingUser.isVerified) {
                return NextResponse.json(
                    {error: "Utilisateur déjà existant et vérifié. Veuillez vous connecter."},
                    {status: 400}
                );
            }

            // If a user exists but is not verified, resend verification email and update the verification token
            const verificationData = generateVerificationTokenForUser();
            await prisma.user.update({
                where: {id: existingUser.id},
                data: {
                    verificationToken: verificationData.verificationToken,
                    verificationTokenExpires: verificationData.verificationTokenExpires,
                },
            });

            await sendVerificationEmail(existingUser.firstName!, existingUser.email, verificationData.verificationToken);

            return NextResponse.json({
                message: "Un compte existe déjà, mais n'est pas vérifié. Vérifiez votre email.",
            }, {status: 200});
        }

        // if the use doesn't exist, create it and send verification email

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction: Create Address + User + Link Address
        const newUser = await prisma.$transaction(async (tx) => {
            // Find Country
            const country = await tx.country.findFirst({
                where: {name: address.country},
            });
            if (!country) throw new Error("Le pays spécifié est introuvable.");

            //  Find City
            const city = await tx.city.findFirst({
                where: {name: address.city, countryId: country.id},
                select: {id: true},
            });
            if (!city) throw new Error("La ville spécifiée est introuvable.");

            // Find/Create Address
            let existingAddress = await tx.address.findFirst({
                where: {street: address.street, streetNumber: address.streetNumber, cityId: city.id},
                select: {id: true},
            });

            if (!existingAddress) {
                existingAddress = await tx.address.create({
                    data: {
                        street: address.street,
                        complement: address.complement || null,
                        streetNumber: address.streetNumber,
                        boxNumber: address.boxNumber || null,
                        cityId: city.id,
                    },
                    select: {id: true},
                });
            }

            // Generate verification token
            const verificationData = generateVerificationTokenForUser();

            // Create User FIRST
            const user = await tx.user.create({
                data: {
                    firstName,
                    lastName,
                    birthDate: new Date(birthDate),
                    phoneNumber,
                    email,
                    password: hashedPassword,
                    role: "CLIENT",
                    isVerified: false,
                    verificationToken: verificationData.verificationToken,
                    verificationTokenExpires: verificationData.verificationTokenExpires,
                },
                select: {id: true, email: true, firstName: true, lastName: true, verificationToken: true},
            });

            // NOW Link User to Address
            await tx.userAddress.create({
                data: {
                    userId: user.id,  // Now we have the userId
                    addressId: existingAddress.id,
                    addressType: "HOME",
                },
            });

            return user;
        });

        // Send Verification Email
        await sendVerificationEmail(newUser.firstName!, newUser.email, newUser.verificationToken!);

        return NextResponse.json({
            message: "Compte créé avec succès. Vérifiez votre email.",
            user: newUser
        }, {status: 201});

    } catch (error: any) {
        console.error("Registration Error:", error);

        if (error.name === "ZodError") {
            return NextResponse.json({error: "Données invalides", details: error.errors}, {status: 400});
        }

        return NextResponse.json({error: error.message || "Erreur interne du serveur"}, {status: 500});
    }
}
