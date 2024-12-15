import NextAuth, {Session, User} from "next-auth"
import {JWT} from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaAdapter} from "@auth/prisma-adapter";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import GoogleProvider from "@auth/core/providers/google";
import GitHubProvider from "@auth/core/providers/github";
import {Roles} from "@/services/dtos/enums/EnumsDto";
import {AddressResponseDto} from "@/services/dtos";
import {getUserByEmail} from "@/services/backend-services/Bk_UserService";

export const {handlers, signIn, signOut, auth} = NextAuth({
    adapter: PrismaAdapter(prisma),

    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials): Promise<User | null> {
                console.log("---------- authorize start ----------");

                // verify if credentials details are provided
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter a valid email and password");
                }


                try {

                    // find user in database
                    const user = await getUserByEmail(credentials.email as string);

                    // Check if the user exists and has a password
                    if (!user) {
                        throw new Error("Incorrect credentials");
                    }

                    // console.log("Credentials password:", credentials.password);
                    // console.log("User password:", user.password);

                    const passwordValid = await bcrypt.compare(
                        String(credentials.password), // Explicitly convert to string
                        String(user.password) // Explicitly convert to string

                    );

                    if (!passwordValid) {
                        throw new Error("Incorrect credentials");

                    }

                    console.log("---------- authorize end ----------");

                    // Map Prisma user object to UserDto, transforming roles to match Roles enum
                    return {
                        id: user.id.toString(),
                        firstName: user.firstName ?? undefined,
                        lastName: user.lastName ?? undefined,
                        name: user.name ?? undefined,
                        email: user.email,
                        phoneNumber: user.phoneNumber ?? undefined,
                        image: user.image ?? undefined,
                        address: user.Address as AddressResponseDto | null,
                        roles: user.roles as Roles[],
                        emailVerified: user.emailVerified ?? null, // Include emailVerified with a fallback
                    } as User;
                } catch (error) {
                    console.error("Authorization error:", error);
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
                    roles: [Roles.CLIENT], // Assign default role using Roles enum
                };
            },
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            authorization: {
                params: {scope: "user:email"},
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
                    roles: [Roles.CLIENT], // Assign default role using Roles enum
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
        // csrf: true,
    },

    callbacks: {
        async jwt({token, user}): Promise<JWT> {
            if (user) {
                token.id = user.id ? user.id.toString() : null;
                token.firstName = user.firstName ?? undefined;
                token.lastName = user.lastName ?? undefined;
                token.name = user.name ?? undefined;
                token.email = user.email ?? undefined;
                token.phoneNumber = user.phoneNumber ?? undefined;
                token.address = user.address as AddressResponseDto;
                token.image = user.image ?? undefined;
                token.roles = user.roles || [];
                token.emailVerified = user.emailVerified ?? null;
            }
            return token;
        },
        async session({session, token}): Promise<Session> {
            if (session.user) {
                session.user = {
                    id: token.id ? token.id.toString() : '',
                    firstName: token.firstName ?? undefined,
                    lastName: token.lastName ?? undefined,
                    name: token.name ?? undefined,
                    email: token.email ?? '',
                    phoneNumber: token.phoneNumber ?? undefined,
                    address: token.address as AddressResponseDto,
                    image: token.image ?? undefined,
                    roles: token.roles ?? [],
                    emailVerified: token.emailVerified ?? null
                };
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV !== "production", // Enable debug only in development
});

