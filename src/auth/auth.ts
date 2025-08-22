// src/auth/auth.ts

import NextAuth from "next-auth";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import GoogleProvider from "@auth/core/providers/google";
import GitHubProvider from "@auth/core/providers/github";
import { RoleDto } from "@/services/dtos/enums/EnumsDto";
import type { AddressResponseDto } from "@/services/dtos";
import { getUserForAuthentication } from "@/services/backend-services/Bk_UserService";
// ✅ CONSISTENT: Only import from utils/db
import { prisma } from "@/utils/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (process.env.NODE_ENV === "development") {
          console.log("🔐 Starting authentication for:", credentials?.email);
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter a valid email and password");
        }

        try {
          const user = await getUserForAuthentication(
            credentials.email as string
          );

          if (!user) {
            if (process.env.NODE_ENV === "development") {
              console.log("❌ User not found for:", credentials.email);
            }
            throw new Error("Incorrect credentials");
          }

          if (!user.password) {
            if (process.env.NODE_ENV === "development") {
              console.log("❌ No password set for:", credentials.email);
            }
            throw new Error("Account not configured for password login");
          }

          const passwordValid = await compare(
            String(credentials.password),
            String(user.password)
          );

          if (!passwordValid) {
            if (process.env.NODE_ENV === "development") {
              console.log("❌ Invalid password for:", credentials.email);
            }
            throw new Error("Incorrect credentials");
          }

          if (process.env.NODE_ENV === "development") {
            console.log(
              "✅ Authentication successful for:",
              user.email,
              "Role:",
              user.role
            );
          }

          return {
            id: user.id.toString(),
            firstName: user.firstName ?? undefined,
            lastName: user.lastName ?? undefined,
            name: user.name ?? undefined,
            email: user.email,
            phoneNumber: user.phoneNumber ?? undefined,
            image: user.image ?? undefined,
            userAddress: null,
            role: user.role,
            emailVerified: user.emailVerified ?? null,
          } as User;
        } catch (error) {
          console.error("❌ Authorization error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          scope: "openid email profile",
        },
      },
      profile(profile) {
        const [firstName, lastName] = profile.name?.split(" ") || ["", ""];
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          firstName: profile.given_name || firstName,
          lastName: profile.family_name || lastName,
          image: profile.picture,
          phoneNumber: null,
          role: RoleDto.CLIENT,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: { scope: "user:email" },
      },
      profile(profile) {
        const [firstName, lastName] = profile.name?.split(" ") || ["", ""];
        return {
          id: profile.id.toString(),
          firstName,
          lastName,
          name: profile.name,
          email: profile.email?.toLowerCase(),
          image: profile.avatar_url,
          phoneNumber: null,
          role: RoleDto.CLIENT,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }): Promise<JWT> {
      if (user) {
        token.id = user.id ? user.id.toString() : null;
        token.firstName = user.firstName ?? undefined;
        token.lastName = user.lastName ?? undefined;
        token.name = user.name ?? undefined;
        token.email = user.email ?? undefined;
        token.phoneNumber = user.phoneNumber ?? undefined;
        token.userAddresses = user.userAddresses as AddressResponseDto;
        token.image = user.image ?? undefined;
        token.role = user.role;
        token.emailVerified = user.emailVerified ?? null;

        if (process.env.NODE_ENV === "development") {
          console.log(
            "🎫 JWT created with role:",
            user.role,
            "Email Verified:",
            user.emailVerified
          );
        }
      }

      if (trigger === "update" && session) {
        token.role = session.role;
      }

      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (session.user) {
        session.user = {
          id: token.id ? token.id.toString() : "",
          firstName: token.firstName ?? undefined,
          lastName: token.lastName ?? undefined,
          name: token.name ?? undefined,
          email: token.email ?? "",
          phoneNumber: token.phoneNumber ?? undefined,
          userAddresses: token.userAddresses as AddressResponseDto,
          image: token.image ?? undefined,
          role: token.role,
          emailVerified: token.emailVerified ?? null,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
  trustHost: true,
});
