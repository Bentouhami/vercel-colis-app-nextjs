import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { RoleDto } from "@/services/dtos/enums/EnumsDto";

// ✅ ULTRA-LIGHTWEIGHT config - NO database imports, NO credentials provider
export default {
  providers: [
    // ❌ Remove CredentialsProvider from here - it will be added in auth.ts
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
          role: RoleDto.CLIENT,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ? user.id.toString() : null;
        token.firstName = user.firstName ?? undefined;
        token.lastName = user.lastName ?? undefined;
        token.name = user.name ?? undefined;
        token.email = user.email ?? undefined;
        token.phoneNumber = user.phoneNumber ?? undefined;
        token.userAddresses = user.userAddresses;
        token.image = user.image ?? undefined;
        token.role = user.role;
        token.emailVerified = user.emailVerified ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user = {
          id: token.id ? token.id.toString() : "",
          firstName: token.firstName ?? undefined,
          lastName: token.lastName ?? undefined,
          name: token.name ?? undefined,
          email: token.email ?? "",
          phoneNumber: token.phoneNumber ?? undefined,
          userAddresses: token.userAddresses,
          image: token.image ?? undefined,
          role: token.role,
          emailVerified: token.emailVerified ?? null,
        };
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
  trustHost: true,
} satisfies NextAuthConfig;
