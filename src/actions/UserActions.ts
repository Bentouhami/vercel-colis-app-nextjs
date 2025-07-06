// actions/UserActions.ts
"use server";

import { LoginUserDto } from "@/services/dtos/users/UserDto";
import { loginUserSchema } from "@/utils/validationSchema";
import { signIn } from "@/auth/auth";
import { getUserByEmail } from "@/services/backend-services/Bk_UserService";

const login = async (email: string, password: string) => {
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

    const result = await signIn("credentials", {
      redirect: false,
      email: loginData.email,
      password: loginData.password,
    });

    if (result?.error) {
      return { error: "Email ou mot de passe incorrect." };
    }

    // Return success with user role
    return {
      success: true,
      userRole: user.role,
    };
  } catch (error) {
    return { error: "Erreur inattendue lors de la connexion." };
  }
};

export { login };
