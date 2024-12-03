"use sever";

import {LoginUserDto} from "@/utils/dtos";
import {loginUserSchema} from "@/utils/validationSchema";
import {signIn} from "next-auth/react";
import {toast} from "react-toastify";
import {router} from "next/client";

const login = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return;
    }

    // call frontend service
    const loginData: LoginUserDto = {email, password};
    const validated = loginUserSchema.safeParse(loginData);

    if (!validated.success) {
        toast.error(validated.error.errors[0].message);
        return;
    }
    try {
        const result = await signIn("credentials", {
            redirect: false,
            email: loginData.email,
            password: loginData.password,
        });

        if (result?.error) {
            return toast.error("Invalid email or password");
        } else {

             toast.success("Connexion réussie");
             await router.push("/client/simulation");
        }
    } catch (error) {
        toast.error("Erreur lors de la connexion");
    }
}

export {login}