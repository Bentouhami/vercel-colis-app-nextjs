// path: src/auth.ts
import NextAuth, {NextAuthConfig} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {PrismaAdapter} from "@auth/prisma-adapter";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";

export const authConfig: NextAuthConfig = {
    adapter: PrismaAdapter(prisma),
    providers: [
        // Google Provider
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    scope: "openid email profile",
                },
            },
            profile(profile) {
                const [firstName, lastName] = profile.name?.split(" ") || ["", ""]; // Split full name into first and last names
                return {
                    id: profile.sub, // Unique Google ID
                    email: profile.email,
                    name: profile.name,
                    firstName: profile.given_name || firstName,
                    lastName: profile.family_name || lastName,
                    image: profile.picture,
                    birthDate: null, // Google doesn't provide this
                    roles: ["CLIENT"], // Default to CLIENT role
                };
            },
        }),

// GitHub Provider
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
                params: {
                    scope: "user:email",
                },
            },
            profile(profile) {
                const [firstName, lastName] = profile.name?.split(" ") || ["", ""];
                return {
                    id: profile.id.toString(),
                    email: profile.email?.toLowerCase(),
                    name: profile.name,
                    firstName: firstName,
                    lastName: lastName,
                    image: profile.avatar_url,
                    birthDate: null, // GitHub doesn't provide this
                    roles: ["CLIENT"], // Default to CLIENT role
                };
            },
        }),
        // Credentials
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" } ,
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email as string,
                        },
                    });

                    if (!user || !user.password) {
                        console.log("User not found or no password");
                        return null;
                    }

                    const passwordValid = await bcrypt.compare(
                        credentials.password as string,
                        user.password as string
                    );

                    if (!passwordValid) {
                        console.log("Invalid password");
                        return null;
                    }

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        image: user.image,
                        roles: user.roles,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),

    ],


    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};

export const {handlers, auth, signIn, signOut} = NextAuth(authConfig);