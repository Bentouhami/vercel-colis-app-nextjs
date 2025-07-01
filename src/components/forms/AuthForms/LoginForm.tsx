// path: src/components/forms/AuthForms/LoginForm.tsx
"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginUserSchema } from "@/utils/validationSchema";
import { login } from "@/actions/UserActions";
import { useSession } from "next-auth/react";
import { RoleDto } from "@/services/dtos";
import { adminPath, clientPath } from "@/utils/constants";

interface LoginUserDto {
    email: string;
    password: string;
}

export default function LoginForm() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<LoginUserDto>({
        resolver: zodResolver(loginUserSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginUserDto) {
        startTransition(() => {
            (async () => {
                try {
                    const result = await login(data.email, data.password);
                    if (result?.error) {
                        toast.error(result.error);
                    } else {
                        toast.success("Connexion réussie");

                        const redirectUrl =
                            session?.user?.role !== RoleDto.CLIENT
                                ? searchParams.get("redirect") || adminPath()
                                : searchParams.get("redirect") || clientPath();

                        setTimeout(() => {
                            router.replace(redirectUrl);
                            router.refresh();
                        }, 600);
                    }
                } catch (error) {
                    toast.error("Erreur lors de la connexion");
                }
            })();
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-center space-y-8 rounded-lg bg-white dark:bg-gray-900 p-6 shadow-lg md:mt-20 md:flex-row md:space-x-8 md:space-y-0"
        >
            {/* Image Section */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0"
            >
                <Image
                    src="/svg/login/login.svg"
                    alt="Welcome"
                    width={300}
                    height={300}
                    priority
                    className="rounded-md"
                />
            </motion.div>

            {/* Form Section */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-md"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
                                        Adresse Email
                                    </FormLabel>
                                    <div className="relative">
                                        <Mail className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground dark:text-gray-400" />
                                        <FormControl>
                                            <Input
                                                placeholder="Entrez votre email"
                                                disabled={isPending}
                                                className="pl-8"
                                                {...field}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
                                        Mot de Passe
                                    </FormLabel>
                                    <div className="relative">
                                        <Lock className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground dark:text-gray-400" />
                                        <FormControl>
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Entrez votre mot de passe"
                                                disabled={isPending}
                                                className="pl-8 pr-10"
                                                {...field}
                                            />
                                        </FormControl>

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-2.5 inline-flex h-5 w-5 items-center justify-center text-muted-foreground dark:text-gray-400"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-2 font-semibold shadow-sm transition duration-150 ease-in-out"
                            >
                                {isPending ? "Connexion en cours..." : "Se connecter"}
                            </Button>
                        </motion.div>
                    </form>
                </Form>


                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-6 text-center text-sm text-gray-500 dark:text-gray-300"
                >
                    <a
                        href="/client/auth/forgot-password"
                        className="block mb-2 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Vous avez oublié votre mot de passe ?
                    </a>
                    <a
                        href="/client/auth/register"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Pas encore inscrit ? Créez un compte
                    </a>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
