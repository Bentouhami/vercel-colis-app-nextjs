// src/app/api/auth/verify-credentials/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { getUserForAuthentication } from "@/services/backend-services/Bk_UserService";

//  This runs on serverless (not edge) so bcrypt and Prisma work fine
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    const user = await getUserForAuthentication(email);

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordValid = await compare(password, user.password);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Return user data (without password)
    return NextResponse.json({
      id: user.id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      role: user.role,
      image: user.image,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    console.error("Credential verification error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
