import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "@auth/core/providers/google"
import GitHubProvider from "@auth/core/providers/github"
import type { RoleDto } from "@/services/dtos/enums/EnumsDto"

// 🚀 EDGE-COMPATIBLE: No Prisma adapter, no bcrypt
export const { handlers, signIn, signOut, auth } = NextAuth({
    // ❌ Remove PrismaAdapter for edge compatibility
    session: {
        strategy: "jwt", // ✅ JWT works on edge
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    // 🚀 Use API route for authentication (runs on serverless, not edge)
                    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/verify-credentials`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    })

                    if (!response.ok) {
                        return null
                    }

                    const user = await response.json()
                    return user
                } catch (error) {
                    console.error("Auth error:", error)
                    return null
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.firstName = user.firstName
                token.lastName = user.lastName
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.role = token.role as RoleDto
                session.user.firstName = token.firstName as string
                session.user.lastName = token.lastName as string
            }
            return session
        },
    },
    pages: {
        signIn: "/client/auth/login",
        error: "/client/auth/error",
    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
})
