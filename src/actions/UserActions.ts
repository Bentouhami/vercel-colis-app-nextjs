// actions/UserActions.ts
"use server";

import { LoginUserDto } from "@/services/dtos/users/UserDto";
import { loginUserSchema } from "@/utils/validationSchema";
import { signIn } from "@/auth/auth";
import { getUserByEmail } from "@/services/backend-services/Bk_UserService";
import { redirect } from "next/navigation";
import { adminPath, clientPath } from "@/utils/constants";
import { RoleDto } from "@/services/dtos";

const login = async (email: string, password: string, redirectUrl?: string) => {
  if (!email || !password) {
    return { error: "Veuillez fournir un email et un mot de passe." };
  }

  const loginData: LoginUserDto = { email, password };
  const validated = loginUserSchema.safeParse(loginData);

  if (!validated.success) {
    return { error: "Les données saisies sont invalides." };
  }

  try {
    // Get user data before signing in to determine role
    const user = await getUserByEmail(loginData.email);

    if (!user) {
      return { error: "Email ou mot de passe incorrect." };
    }

    // Use redirect: false to prevent automatic redirection
    const result = await signIn("credentials", {
      redirect: false,
      email: loginData.email,
      password: loginData.password,
    });

    if (result?.error) {
      return { error: "Email ou mot de passe incorrect." };
    }

    // Determine redirect URL based on role
    const defaultRedirectUrl =
      user.role !== RoleDto.CLIENT ? adminPath() : clientPath();

    const finalRedirectUrl = redirectUrl || defaultRedirectUrl;

    // Use Next.js redirect for proper server-side navigation
    redirect(finalRedirectUrl);
  } catch (error) {
    // If it's a redirect, let it propagate
    if (typeof error === 'object' && error !== null && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Login error:", error);
    return { error: "Erreur inattendue lors de la connexion." };
  }
};

export { login };
