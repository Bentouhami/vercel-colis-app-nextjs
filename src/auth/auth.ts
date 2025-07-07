import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/utils/db";
import authConfig from "./auth.config";

// ✅ Full Auth.js instance WITH database adapter - for server-side usage
// This preserves ALL your existing login/logout functionality
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // session: { strategy: "jwt" }, // Keep JWT for consistency
  ...authConfig, // Spread the shared config
});
