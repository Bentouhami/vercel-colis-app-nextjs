// src/auth/auth.ts

import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { RoleDto } from "@/services/dtos/enums/EnumsDto";
import { AddressResponseDto } from "@/services/dtos";
import { getUserByEmail } from "@/services/backend-services/Bk_UserService";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        // verify if credentials details are provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter a valid email and password");
        }
        try {
          // find user in a database
          const user = await getUserByEmail(credentials.email as string);

          // Check if the user exists and has a password
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
          } as User;
        } catch (error) {
          return null;
        }
      },
    }),

    Google({
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

    GitHub({
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
          role: RoleDto.CLIENT, // Assign default role using RoleDto enum
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    // csrf: true,
  },

  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
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
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV !== "production", // Enable debug only in development
});
