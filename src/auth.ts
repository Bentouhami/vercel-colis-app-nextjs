// path: src/auth.ts

import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter"; // Adapter Prisma
import prisma from "@/utils/db";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github"; // Connexion à Prisma

export const {handlers, signIn, signOut, auth} = NextAuth({
    adapter: PrismaAdapter(prisma),  // Adapter Prisma
   secret: process.env.AUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        },)
    ],
    debug: true,  // Activer le mode debug
    callbacks: {
        async signIn({ user, account, profile }) {
            return true;
        },
    },
});
