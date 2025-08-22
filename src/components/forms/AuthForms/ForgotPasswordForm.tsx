"use client"

import { useTransition, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { forgotPasswordSchema } from "@/utils/validationSchema"
import type { ForgotPasswordDto } from "@/services/dtos/auth/authDtos"
import { sendResetEmail } from "@/services/frontend-services/AuthService"

type FormState = "idle" | "loading" | "success" | "error"

export default function ForgotPasswordForm() {
    const [isPending, startTransition] = useTransition()
    const [isVisible, setIsVisible] = useState(false)
    const [formState, setFormState] = useState<FormState>("idle")
    const [submittedEmail, setSubmittedEmail] = useState("")

    // Éviter les problèmes d'hydration
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50)
        return () => clearTimeout(timer)
    }, [])

    const form = useForm<ForgotPasswordDto>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    })

    const onSubmit = (data: ForgotPasswordDto) => {
        setFormState("loading")
        setSubmittedEmail(data.email)

        startTransition(() => {
            sendResetEmail(data.email)
                .then((res) => {
                    setFormState("success")
                    toast.success("Email envoyé avec succès !", {
                        description: "Vérifiez votre boîte de réception et vos spams.",
                        duration: 5000,
                    })
                })
                .catch((err) => {
                    setFormState("error")
                    const errorMessage = err.message || "Une erreur s'est produite"
                    toast.error("Erreur lors de l'envoi", {
                        description: errorMessage,
                        duration: 4000,
                    })
                })
        })
    }

    const resetForm = () => {
        setFormState("idle")
        setSubmittedEmail("")
        form.reset()
    }

    // Message de succès détaillé
    const SuccessMessage = () => (
        <div
            className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 transition-all duration-500 delay-300 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
        >
            <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Email envoyé avec succès !</h3>
                    <p className="text-green-700 dark:text-green-300 text-sm mb-3">
                        Un lien de réinitialisation a été envoyé à <strong>{submittedEmail}</strong>
                    </p>
                    <div className="bg-green-100 dark:bg-green-800/30 rounded-md p-3 mb-4">
                        <p className="text-green-800 dark:text-green-200 text-sm font-medium mb-2">
                            📧 Vérifiez votre boîte email :
                        </p>
                        <ul className="text-green-700 dark:text-green-300 text-xs space-y-1 ml-4">
                            <li>• Consultez votre boîte de réception</li>
                            <li>• Vérifiez le dossier spam/courrier indésirable</li>
                            <li>• Le lien expire dans 15 minutes</li>
                        </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            onClick={resetForm}
                            variant="outline"
                            size="sm"
                            className="text-green-700 dark:text-green-300 border-green-300 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-800/30 bg-transparent"
                        >
                            Renvoyer un email
                        </Button>
                        <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <a href="/auth/login">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Retour à la connexion
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )

    // Message d'erreur détaillé
    const ErrorMessage = () => (
        <div
            className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 transition-all duration-500 delay-300 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
        >
            <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Erreur lors de l&apos;envoi</h3>
                    <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                        Nous n&apos;avons pas pu envoyer l&apos;email de réinitialisation. Veuillez réessayer.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={resetForm} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                            Réessayer
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="text-red-700 dark:text-red-300 border-red-300 dark:border-red-600 bg-transparent"
                        >
                            <a href="/auth/login">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Retour à la connexion
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )

    // Affichage conditionnel selon l'état
    if (formState === "success") {
        return (
            <div
                className={`mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center space-y-8 rounded-lg bg-white dark:bg-gray-900 p-6 shadow-lg md:mt-20 transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                    }`}
            >
                <SuccessMessage />
            </div>
        )
    }

    if (formState === "error") {
        return (
            <div
                className={`mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center space-y-8 rounded-lg bg-white dark:bg-gray-900 p-6 shadow-lg md:mt-20 transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                    }`}
            >
                <ErrorMessage />
            </div>
        )
    }

    return (
        <div
            className={`mx-auto mt-10 flex max-w-4xl flex-col items-center justify-center space-y-8 rounded-lg bg-white dark:bg-gray-900 p-6 shadow-lg md:mt-20 md:flex-row md:space-x-8 md:space-y-0 transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                }`}
        >
            {/* Image Section */}
            <div
                className={`flex-shrink-0 transition-all duration-700 delay-100 transform ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                    }`}
            >
                <Image
                    src="/svg/reset-forgot-password/forgot-password.svg"
                    alt="Forgot Password"
                    width={300}
                    height={300}
                    priority
                    className="rounded-md transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Form Section */}
            <div
                className={`w-full max-w-md transition-all duration-700 delay-200 transform ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
                    }`}
            >
                {/* Header */}
                <div
                    className={`mb-6 text-center transition-all duration-500 delay-300 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                        }`}
                >
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Mot de passe oublié ?</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Entrez votre adresse email pour recevoir un lien de réinitialisation sécurisé
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email Field */}
                        <div
                            className={`transition-all duration-500 delay-400 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                                }`}
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">Adresse Email</FormLabel>
                                        <div className="relative">
                                            <Mail className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground dark:text-gray-400 transition-colors duration-200" />
                                            <FormControl>
                                                <Input
                                                    placeholder="exemple@email.com"
                                                    disabled={isPending}
                                                    className="pl-8 transition-all duration-200 focus:scale-[1.02] focus:shadow-md focus:border-blue-500 dark:focus:border-blue-400"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit Button */}
                        <div
                            className={`transition-all duration-600 delay-500 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                }`}
                        >
                            <Button
                                type="submit"
                                disabled={isPending || formState === "loading"}
                                className="w-full py-2 font-semibold shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
                            >
                                {formState === "loading" ? (
                                    <span className="flex items-center justify-center">
                                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                                        Envoi en cours...
                                    </span>
                                ) : (
                                    "Envoyer le lien de réinitialisation"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>

                {/* Back to Login Link */}
                <div
                    className={`mt-6 text-center transition-all duration-600 delay-600 transform ${isVisible ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <a
                        href="/auth/login"
                        className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Retour à la connexion
                    </a>
                </div>

                {/* Security Notice */}
                <div
                    className={`mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md transition-all duration-600 delay-700 transform ${isVisible ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                        🔒 Pour votre sécurité, le lien expirera dans 15 minutes
                    </p>
                </div>
            </div>
        </div>
    )
}
