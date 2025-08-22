"use client"

import { useTransition, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    type RegisterUserBackendType,
    type RegisterUserFrontendFormType,
    registerUserFrontendSchema,
} from "@/utils/validationSchema"
import { registerUser } from "@/services/frontend-services/UserService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import PersonalInformationForm from "@/components/auth/PersonalInformationForm"
import AddressForm from "@/components/address/AddressForm"
import LoginInformationForm from "@/components/auth/LoginInformationForm"

export default function RegisterForm() {
    const [isPending, startTransition] = useTransition()
    const [isVisible, setIsVisible] = useState(false)
    const router = useRouter()

    // Déclencher les animations au montage
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    // Setup react-hook-form
    const form = useForm<RegisterUserFrontendFormType>({
        resolver: zodResolver(registerUserFrontendSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            birthDate: "",
            phoneNumber: "",
            email: "",
            password: "",
            checkPassword: "",
            address: {
                street: "",
                complement: "",
                streetNumber: "",
                boxNumber: "",
                city: "",
                country: "",
            },
        },
    })

    async function handleSubmit(formValues: RegisterUserFrontendFormType) {
        const dto: RegisterUserBackendType = {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            birthDate: formValues.birthDate,
            phoneNumber: formValues.phoneNumber,
            email: formValues.email,
            password: formValues.password,
            address: formValues.address,
        }

        startTransition(() => {
            ; (async () => {
                try {
                    const result = await registerUser(dto)
                    if (!result) {
                        toast.error("Réponse inattendue du serveur. Veuillez réessayer.")
                        return
                    }
                    if (result.error) {
                        toast.error(result.error)
                        return
                    }
                    if (result.message) {
                        toast.success(result.message)
                        setTimeout(() => {
                            router.push("/")
                        }, 2000)
                    } else {
                        toast.error("Réponse invalide du serveur.")
                    }
                } catch (err: any) {
                    toast.error(err.message || "Erreur lors de la création du compte")
                }
            })()
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-2 py-5">
            <div
                className={`transition-all duration-600 ease-out ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
                    }`}
            >
                {/* Image Section */}
                <div
                    className={`w-full max-w-3xl space-y-6 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                        }`}
                    style={{ transitionDelay: "200ms" }}
                >
                    <Image
                        priority
                        className="rounded-md mx-auto hover:scale-105 transition-transform duration-300 ease-out"
                        src="/svg/login/register.svg"
                        alt="Register Illustration"
                        width={300}
                        height={300}
                    />
                </div>

                {/* Form Section */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle
                            className={`text-center text-xl font-semibold transition-all duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                }`}
                            style={{ transitionDelay: "300ms" }}
                        >
                            Créer un compte
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                {/* Personal Information */}
                                <div
                                    className={`transition-all duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                        }`}
                                    style={{ transitionDelay: "400ms" }}
                                >
                                    <PersonalInformationForm form={form} isPending={isPending} />
                                </div>

                                {/* Address Information */}
                                <div
                                    className={`transition-all duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                        }`}
                                    style={{ transitionDelay: "500ms" }}
                                >
                                    <AddressForm form={form} isPending={isPending} />
                                </div>

                                {/* Login Information */}
                                <div
                                    className={`transition-all duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                        }`}
                                    style={{ transitionDelay: "600ms" }}
                                >
                                    <LoginInformationForm form={form} isPending={isPending} />
                                </div>

                                {/* Submit Button */}
                                <div
                                    className={`transition-all duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                                        }`}
                                    style={{ transitionDelay: "700ms" }}
                                >
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isPending ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>En cours...</span>
                                            </div>
                                        ) : (
                                            "Créer mon compte"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
