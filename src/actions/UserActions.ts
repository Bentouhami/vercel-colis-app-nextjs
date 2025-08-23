// src/actions/UserActions.ts

"use server";

import type { LoginUserDto } from "@/services/dtos/users/UserDto";
import { loginUserSchema } from "@/utils/validationSchema";
import { signIn } from "@/auth/auth";

const login = async (email: string, password: string, redirectUrl?: string) => {
  // ✅ Empêche l'exécution pendant le build Vercel
  if (process.env.NEXT_PUBLIC_VERCEL_ENV && process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
    console.warn(
      "⛔ Tentative d'authentification bloquée (environnement Vercel)."
    );
    return {
      error: "Connexion temporairement désactivée sur cet environnement.",
    };
  }

  if (!email || !password) {
    return { error: "Veuillez fournir un email et un mot de passe." };
  }

  const loginData: LoginUserDto = { email, password };
  const validated = loginUserSchema.safeParse(loginData);

  if (!validated.success) {
    return { error: "Les données saisies sont invalides." };
  }

  try {
    // 🚀 Let Auth.js handle everything - no need to pre-fetch user data
    const result = await signIn("credentials", {
      redirect: false,
      email: loginData.email.toLowerCase().trim(),
      password: loginData.password,
    });

    if (result?.error) {
      return { error: "Email ou mot de passe incorrect." };
    }
    return { success: true };
  } catch (error) {
    // If it's a redirect, let it propagate
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error("Login error:", error);
    return { error: "Erreur inattendue lors de la connexion." };
  }
};

export { login };
