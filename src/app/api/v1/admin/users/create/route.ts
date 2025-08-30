// path: src/app/api/v1/admin/users/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth/auth";
import { prisma } from "@/utils/db";
import { RoleDto } from "@/services/dtos";
import { sendResetPasswordEmail } from "@/services/backend-services/Bk_AuthService";

const addressSchema = z.object({
  street: z.string().min(1),
  complement: z.string().optional(),
  streetNumber: z.string().optional(),
  boxNumber: z.string().optional(),
  city: z.string().min(1),
  country: z.string().min(1),
});

const adminCreateUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.string().min(1),
  phoneNumber: z.string().min(5),
  email: z.string().email(),
  role: z.nativeEnum(RoleDto),
  address: addressSchema,
  agencyId: z.number().int().positive().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const requesterRole = session.user?.role as RoleDto | undefined;
    if (requesterRole !== RoleDto.SUPER_ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = adminCreateUserSchema.parse(body);

    const { firstName, lastName, birthDate, phoneNumber, email, role, address, agencyId } = data;

    // Enforce agencyId for specific roles
    if ((role === RoleDto.AGENCY_ADMIN || role === RoleDto.ACCOUNTANT) && !agencyId) {
      return NextResponse.json({ error: "L'agence est requise pour ce rôle." }, { status: 400 });
    }

    // If user already exists, update role/links and resend reset email instead of failing on unique constraint
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true, firstName: true, email: true },
    });

    if (existingUser) {
      await prisma.$transaction(async (tx) => {
        if (existingUser.role !== role) {
          await tx.user.update({ where: { id: existingUser.id }, data: { role } });
        }

        if ((role === RoleDto.AGENCY_ADMIN || role === RoleDto.ACCOUNTANT) && agencyId) {
          const exists = await tx.agencyStaff.findFirst({
            where: { staffId: existingUser.id, agencyId: agencyId },
          });
          if (!exists) {
            await tx.agencyStaff.create({
              data: {
                staffId: existingUser.id,
                agencyId: agencyId,
                staffRole: role as any,
              },
            });
          }
        }
      });

      await sendResetPasswordEmail(existingUser.email);

      return NextResponse.json({
        message:
          "Utilisateur existant mis à jour. Un lien de réinitialisation a été envoyé pour définir/mettre à jour le mot de passe.",
        user: existingUser,
      });
    }

    // Transaction: Find/Create Address + Create User + Link Address
    const newUser = await prisma.$transaction(async (tx) => {
      const country = await tx.country.findFirst({ where: { name: address.country } });
      if (!country) throw new Error("Le pays spécifié est introuvable.");

      const city = await tx.city.findFirst({ where: { name: address.city, countryId: country.id }, select: { id: true } });
      if (!city) throw new Error("La ville spécifiée est introuvable.");

      let existingAddress = await tx.address.findFirst({
        where: { street: address.street, streetNumber: address.streetNumber, cityId: city.id },
        select: { id: true },
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
          select: { id: true },
        });
      }

      // Create user with empty password; mark as verified to allow normal flow
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          birthDate: new Date(birthDate),
          phoneNumber,
          email,
          password: "",
          role,
          isVerified: true,
        },
        select: { id: true, email: true, firstName: true },
      });

      await tx.userAddress.create({
        data: { userId: user.id, addressId: existingAddress.id, addressType: "HOME" },
      });

      // Link user to agency if required
      if ((role === RoleDto.AGENCY_ADMIN || role === RoleDto.ACCOUNTANT) && agencyId) {
        await tx.agencyStaff.create({
          data: {
            staffId: user.id,
            agencyId: agencyId,
            staffRole: role as any,
          },
        });
      }

      return user;
    });

    // Send reset password email to let the user set their password
    await sendResetPasswordEmail(newUser.email);

    return NextResponse.json({
      message: "Utilisateur créé. Un lien a été envoyé pour définir le mot de passe.",
      user: newUser,
    });
  } catch (error: any) {
    console.error("Admin Create User Error:", error);
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: "Données invalides", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error?.message || "Erreur interne" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
