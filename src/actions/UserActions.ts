"use sever";

import {LoginUserDto} from "@/services/dtos/users/UserDto"
import {loginUserSchema} from "@/utils/validationSchema";
import {signIn} from "next-auth/react";
import {toast} from "react-toastify";

const login = async (email: string, password: string) => {
    // const email = formData.get("email") as string;
    // const password = formData.get("password") as string;

    if (!email || !password) {
        return;
    }

    // call frontend service
    const loginData: LoginUserDto = {email, password};
    const validated = loginUserSchema.safeParse(loginData);

    if (!validated.success) {
        return;
    }
    try {
        const result = await signIn("credentials", {
            redirect: false,
            email: loginData.email,
            password: loginData.password,
        });

        if (result?.error) {
            return {error: "Incorrect email or password"};
        }
    } catch (error) {
        toast.error("Erreur lors de la connexion");
    }
}

export {login}