// path: src/components/forms/AuthForms/ForgotPasswordForm.tsx
"use client"

import React, { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import Image from "next/image"
import { toast } from "sonner"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { forgotPasswordSchema } from "@/utils/validationSchema"
import { ForgotPasswordDto } from "@/services/dtos/auth/authDtos"
import {sendResetEmail} from "@/services/frontend-services/AuthService";

export default function ForgotPasswordForm() {
    const [isPending, startTransition] = useTransition()

    const form = useForm<ForgotPasswordDto>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    })

    const onSubmit = (data: ForgotPasswordDto) => {
        startTransition(() => {
            sendResetEmail(data.email)
                .then((res) => {
                    toast.success(res.message)
                })
                .catch((err) => {
                    toast.error(err.message || "Erreur inconnue")
                })
        })
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
                    src="/svg/reset-forgot-password/forgot-password.svg"
                    alt="Forgot Password"
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
                                                placeholder="Entrez votre adresse email"
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
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-2 font-semibold shadow-sm"
                            >
                                {isPending
                                    ? "Envoi en cours..."
                                    : "Envoyer le lien de réinitialisation"}
                            </Button>
                        </motion.div>
                    </form>
                </Form>
            </motion.div>
        </motion.div>
    )
}


