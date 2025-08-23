// path: src/components/forms/AuthForms/LoginForm.tsx

"use client"

import { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, LogIn, ArrowRight, Sparkles } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { loginUserSchema } from "@/utils/validationSchema"
import { login } from "@/actions/UserActions"
import { useSession } from "next-auth/react"

interface LoginUserDto {
    email: string
    password: string
}

export default function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session, update } = useSession()
    const [showPassword, setShowPassword] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [isVisible, setIsVisible] = useState(false)

    // Déclencher les animations après le montage
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    const form = useForm<LoginUserDto>({
        resolver: zodResolver(loginUserSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: LoginUserDto) {
        setIsDisabled(true)
        startTransition(async () => {
            try {
                const result = await login(data.email, data.password)

                if (result?.error) {
                    toast.error(result.error)
                } else if (result?.success) {
                    toast.success("Connexion réussie !")

                    // 🔄 Update session to get fresh user data
                    await update()

                    // Small delay to ensure session is updated
                    setTimeout(async () => {
                        // Get fresh session data
                        const updatedSession = await fetch("/api/auth/session").then((res) => res.json())

                        if (updatedSession?.user?.role) {
                            const userRole = updatedSession.user.role

                            // 🚀 ROLE-BASED REDIRECTS: Determine redirect based on role
                            let redirectUrl: string

                            if (["SUPER_ADMIN", "AGENCY_ADMIN", "ACCOUNTANT"].includes(userRole)) {
                                redirectUrl = "/admin"
                            } else {
                                redirectUrl = "/client/profile"
                            }

                            // Override with custom redirect if provided and appropriate
                            const customRedirect = searchParams.get("redirect")
                            if (customRedirect) {
                                // For admin users, only allow admin redirects
                                if (["SUPER_ADMIN", "AGENCY_ADMIN", "ACCOUNTANT"].includes(userRole)) {
                                    if (customRedirect.startsWith("/admin")) {
                                        redirectUrl = customRedirect
                                    }
                                    // Keep default /admin for non-admin redirects
                                }
                                // For client users, allow client redirects
                                else if (["CLIENT", "DESTINATAIRE"].includes(userRole)) {
                                    if (customRedirect.startsWith("/client") || customRedirect === "/") {
                                        redirectUrl = customRedirect
                                    }
                                }
                            }

                            console.log("🔄 Login redirect:", { userRole, customRedirect, redirectUrl })
                            router.push(redirectUrl)
                        } else {
                            // Fallback if no role detected
                            const fallbackRedirect = searchParams.get("redirect") || "/client/profile"
                            router.push(fallbackRedirect)
                        }

                        router.refresh()
                    }, 500)
                }
            } catch (error) {
                console.error("Login error:", error)
                toast.error("Erreur lors de la connexion")
            } finally {
                setIsDisabled(false)
            }
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 relative overflow-hidden">
            {/* Particules décoratives en arrière-plan */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-20 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                ></div>
                <div
                    className="absolute top-40 right-20 w-1 h-1 bg-purple-400/30 rounded-full animate-bounce"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-blue-500/30 rounded-full animate-bounce"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="absolute bottom-20 right-10 w-2 h-2 bg-purple-500/30 rounded-full animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                ></div>
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Image Section */}
                <div
                    className={`flex justify-center lg:justify-end transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-12 scale-95"
                        }`}
                    style={{ transitionDelay: "200ms" }}
                >
                    <div className="relative">
                        <Image
                            src="/svg/login/login.svg"
                            alt="Welcome to ColisApp"
                            width={400}
                            height={400}
                            priority
                            className="rounded-2xl transition-all duration-500 hover:scale-105 hover:rotate-1"
                        />
                        {/* Effet de halo autour de l'image */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl -z-10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                </div>

                {/* Form Section */}
                <div
                    className={`flex justify-center lg:justify-start transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-12 scale-95"
                        }`}
                    style={{ transitionDelay: "400ms" }}
                >
                    <div className="w-full max-w-md">
                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
                            <CardHeader className="text-center pb-6">
                                <div
                                    className={`transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                                        }`}
                                    style={{ transitionDelay: "600ms" }}
                                >
                                    <div className="relative inline-block">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 hover:rotate-12 transition-all duration-300">
                                            <LogIn className="h-8 w-8 text-white" />
                                        </div>
                                        <Sparkles className="absolute -top-1 -right-2 h-4 w-4 text-purple-500 animate-pulse" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                        Se connecter
                                    </CardTitle>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">Accédez à votre espace ColisApp</p>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        {/* Email Field */}
                                        <div
                                            className={`space-y-2 transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                                }`}
                                            style={{ transitionDelay: "700ms" }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">Adresse email</FormLabel>
                                                        <div className="relative group">
                                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                                            <FormControl>
                                                                <Input
                                                                    type="email"
                                                                    placeholder="votre@email.com"
                                                                    className="pl-10 h-11 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:scale-105 transition-all duration-200"
                                                                    disabled={isPending}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Password Field */}
                                        <div
                                            className={`space-y-2 transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                                }`}
                                            style={{ transitionDelay: "800ms" }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">Mot de passe</FormLabel>
                                                        <div className="relative group">
                                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                                                            <FormControl>
                                                                <Input
                                                                    type={showPassword ? "text" : "password"}
                                                                    placeholder="Votre mot de passe"
                                                                    className="pl-10 pr-10 h-11 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:scale-105 transition-all duration-200"
                                                                    disabled={isPending}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:scale-110 transition-all duration-200"
                                                            >
                                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </button>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div
                                            className={`transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                                                }`}
                                            style={{ transitionDelay: "900ms" }}
                                        >
                                            <Button
                                                type="submit"
                                                disabled={isDisabled || isPending}
                                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                                            >
                                                {/* Effet de brillance qui traverse */}
                                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                                {isPending ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Connexion en cours...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <LogIn className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                                                        Se connecter
                                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                                                    </div>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>

                                {/* Register Links */}
                                <div
                                    className={`text-center pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3 transition-all duration-500 ease-out ${isVisible ? "opacity-100" : "opacity-0"
                                        }`}
                                    style={{ transitionDelay: "1000ms" }}
                                >
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <Link
                                            href="/client/auth/forgot-password"
                                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline"
                                        >
                                            Vous avez oublié votre mot de passe ?
                                        </Link>
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Pas encore inscrit ?{" "}
                                        <Link
                                            href="/client/auth/register"
                                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline"
                                        >
                                            Créez un compte
                                        </Link>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
