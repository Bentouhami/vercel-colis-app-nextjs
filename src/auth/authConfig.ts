// import NextAuth from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import prisma from "@/utils/db";
// import bcrypt from "bcryptjs";
// import GoogleProvider from "@auth/core/providers/google";
// import GitHubProvider from "@auth/core/providers/github";
// import {UserDto, Roles} from "@/services/dtos"; // Import Roles enum
//
// export const { handlers, signIn, signOut, auth } = NextAuth({
//     adapter: PrismaAdapter(prisma),
//
//     providers: [
//         CredentialsProvider({
//             name: "credentials",
//             credentials: {
//                 email: { label: "Email", type: "email" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials): Promise<UserDto | null> {
//                 console.log("---------- authorize start ----------");
//
//                 if (!credentials?.email || !credentials?.password) {
//                     console.error("Email and password are required.");
//                     return null;
//                 }
//
//                 try {
//                     const user = await prisma.user.findFirst({
//                         where: { email: credentials.email },
//                         include: {
//                             Address: {
//                                 select: {
//                                     street: true,
//                                     number: true,
//                                     city: true,
//                                     zipCode: true,
//                                     country: true,
//                                 },
//                             },
//                         },
//                     });
//
//                     if (!user) {
//                         console.error("User not found.");
//                         return null;
//                     }
//
//                     const passwordValid = await bcrypt.compare(
//                         credentials.password,
//                         user.password || ""
//                     );
//
//                     if (!passwordValid) {
//                         console.error("Invalid password.");
//                         return null;
//                     }
//
//                     console.log("---------- authorize end ----------");
//
//                     // Map Prisma user object to UserDto, transforming roles to match Roles enum
//                     return {
//                         id: user.id,
//                         firstName: user.firstName,
//                         lastName: user.lastName,
//                         name: user.name,
//                         email: user.email,
//                         phoneNumber: user.phoneNumber,
//                         image: user.image,
//                         roles: user.roles as Roles[], // Transform Prisma roles to Roles enum
//                         address: user.Address,
//                     };
//                 } catch (error) {
//                     console.error("Authorization error:", error);
//                     return null;
//                 }
//             },
//         }),
//
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//             authorization: {
//                 params: {
//                     prompt: "consent",
//                     access_type: "offline",
//                     scope: "openid email profile",
//                 },
//             },
//             profile(profile) {
//                 const [firstName, lastName] = profile.name?.split(" ") || ["", ""];
//                 return {
//                     id: profile.sub,
//                     email: profile.email,
//                     name: profile.name,
//                     firstName: profile.given_name || firstName,
//                     lastName: profile.family_name || lastName,
//                     image: profile.picture,
//                     phoneNumber: null,
//                     roles: [Roles.CLIENT], // Assign default role using Roles enum
//                 };
//             },
//         }),
//
//         GitHubProvider({
//             clientId: process.env.GITHUB_ID!,
//             clientSecret: process.env.GITHUB_SECRET!,
//             authorization: {
//                 params: { scope: "user:email" },
//             },
//             profile(profile) {
//                 const [firstName, lastName] = profile.name?.split(" ") || ["", ""];
//                 return {
//                     id: profile.id.toString(),
//                     firstName,
//                     lastName,
//                     name: profile.name,
//                     email: profile.email?.toLowerCase(),
//                     image: profile.avatar_url,
//                     phoneNumber: null,
//                     roles: [Roles.CLIENT], // Assign default role using Roles enum
//                 };
//             },
//         }),
//     ],
//
//     session: {
//         strategy: "jwt",
//     },
//
//     callbacks: {
//         async jwt({ token, user }) {
//             console.log("user before jwt callback:", user);
//             console.log("token before jwt callback:", token);
//
//             if (user) {
//                 token.id = user.id;
//                 token.firstName = user.firstName;
//                 token.lastName = user.lastName;
//                 token.name = user.name;
//                 token.email = user.email;
//                 token.phoneNumber = user.phoneNumber;
//                 token.image = user.image;
//                 token.roles = user.roles;
//                 token.address = user.address || null;
//             }
//
//             console.log("user in jwt callback after if:", user);
//             console.log("token in jwt callback after if:", token);
//             return token;
//         },
//
//         async session({ session, token }) {
//             console.log("session before session callback:", session);
//             console.log("token before session callback:", token);
//
//             if (session.user) {
//                 session.user = {
//                     id: token.id as number,
//                     firstName: token.firstName,
//                     lastName: token.lastName,
//                     name: token.name,
//                     email: token.email,
//                     phoneNumber: token.phoneNumber,
//                     image: token.image,
//                     roles: token.roles,
//                     address: token.address,
//
//                 };
//             }
//
//             console.log("session in session callback after if:", session);
//             console.log("token in session callback after if:", token);
//             return session;
//         },
//     },
//
//     secret: process.env.NEXTAUTH_SECRET,
//     debug: process.env.NODE_ENV === "development",
// });
//
