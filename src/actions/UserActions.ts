"use server";

import { LoginUserDto } from "@/services/dtos/users/UserDto";
import { loginUserSchema } from "@/utils/validationSchema";
import { signIn } from "@/auth/auth";

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
    const result = await signIn("credentials", {
      redirect: false,
      email: loginData.email,
      password: loginData.password,
    });

    if (result?.error) {
      return { error: "Email ou mot de passe incorrect." };
    }

    // If signIn is successful and redirect is false, result should contain user data
    const user = result?.user; // Assuming result contains a user object
    if (!user || !user.role) {
      return { error: "User role not found after successful login." };
    }

    return { success: true, userRole: user.role };
  } catch (error) {
    return { error: "Erreur inattendue lors de la connexion." };
  }
};

export { login };
