import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/services/backend-services/Bk_UserService";
import authConfig from "./auth.config";

// ✅ Full Auth.js instance WITH database adapter AND credentials provider
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  providers: [
    // ✅ Add CredentialsProvider here (server-side only)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter a valid email and password");
        }

        try {
          const user = await getUserByEmail(credentials.email as string);

          if (!user) {
            throw new Error("Incorrect credentials");
          }

          const passwordValid = await bcrypt.compare(
            String(credentials.password),
            String(user.password)
          );

          if (!passwordValid) {
            throw new Error("Incorrect credentials");
          }

          return {
            id: user.id.toString(),
            firstName: user.firstName ?? undefined,
            lastName: user.lastName ?? undefined,
            name: user.name ? `${user.lastName} ${user.firstName}` : undefined,
            email: user.email,
            phoneNumber: user.phoneNumber ?? undefined,
            image: user.image ?? undefined,
            userAddress: user.userAddresses,
            role: user.role,
            emailVerified: user.emailVerified ?? null,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    // ✅ Spread the other providers from config
    ...authConfig.providers,
  ],
});
