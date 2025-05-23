// path: src\components\forms\AuthForms\ResetPasswordForm.tsx
"use client"

import React, { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Lock } from "lucide-react"
import { resetPasswordSchema } from "@/utils/validationSchema"
import { ResetPasswordDto } from "@/services/dtos/auth/authDtos"
import {checkResetToken, resetPassword} from "@/services/frontend-services/AuthService";

export default function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showPassword, setShowPassword] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [tokenValid, setTokenValid] = useState<boolean | null>(null)
    const token = searchParams.get("token")

    // Vérification réelle du token via le service
    useEffect(() => {
        if (!token) {
            toast.error("Lien invalide ou expiré")
            router.replace("/client/auth/login")
            return
        }

        checkResetToken(token).then((isValid) => {
            if (!isValid) {
                toast.error("Ce lien a expiré ou a déjà été utilisé.")
                router.replace("/client/auth/login")
            } else {
                setTokenValid(true)
            }
        })
    }, [token, router])

    const form = useForm<ResetPasswordDto>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (data: ResetPasswordDto) => {
        if (!token) return
        startTransition(() => {
            resetPassword(token, data.password)
                .then(() => {
                    toast.success("Mot de passe mis à jour")
                    setTimeout(() => router.replace("/client/auth/login"), 800)
                })
                .catch((err) => toast.error(err.message || "Erreur inconnue"))
        })
    }

    if (tokenValid === null) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="text-gray-600 dark:text-gray-300">Vérification du lien en cours...</span>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-center space-y-8 rounded-lg bg-white dark:bg-gray-900 p-6 shadow-lg md:mt-20 md:flex-row md:space-x-8 md:space-y-0"
        >
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0"
            >
                <Image
                    src="/svg/reset-forgot-password/reset-password.svg"
                    alt="Reset Password"
                    width={300}
                    height={300}
                    priority
                    className="rounded-md"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-md"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
                                        Nouveau mot de passe
                                    </FormLabel>
                                    <div className="relative">
                                        <Lock className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground dark:text-gray-400" />
                                        <FormControl>
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Entrez votre nouveau mot de passe"
                                                disabled={isPending}
                                                className="pl-8 pr-10"
                                                {...field}
                                            />
                                        </FormControl>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-2.5 text-muted-foreground"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
                                        Confirmer le mot de passe
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Répétez le mot de passe"
                                            disabled={isPending}
                                            className="pl-8"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Button type="submit" disabled={isPending} className="w-full">
                                {isPending ? "Mise à jour en cours..." : "Réinitialiser le mot de passe"}
                            </Button>
                        </motion.div>
                    </form>
                </Form>
            </motion.div>
        </motion.div>
    )
}
