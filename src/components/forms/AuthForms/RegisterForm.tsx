"use client";

import React, {useTransition} from "react";
import {useRouter} from "next/navigation";
import {motion} from "framer-motion";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import Image from "next/image";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    RegisterUserBackendType,
    RegisterUserFrontendFormType,
    registerUserFrontendSchema
} from "@/utils/validationSchema";
import {registerUser} from "@/services/frontend-services/UserService";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";
import PersonalInformationForm from "@/components/auth/PersonalInformationForm";
import AddressForm from "@/components/address/AddressForm";
import LoginInformationForm from "@/components/auth/LoginInformationForm";


export default function RegisterForm() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // Setup react-hook-form
    // ...

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
                country: ""
            }
        }
    });

    async function handleSubmit(formValues: RegisterUserFrontendFormType) {
        const dto: RegisterUserBackendType = {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            birthDate: formValues.birthDate,
            phoneNumber: formValues.phoneNumber,
            email: formValues.email,
            password: formValues.password,
            address: formValues.address,
        };

        startTransition(() => {
            (async () => {
                try {
                    const result = await registerUser(dto);

                    if (!result) {
                        toast.error("Réponse inattendue du serveur. Veuillez réessayer.");
                        return;
                    }
                    if (result.error) {
                        toast.error(result.error);
                        return;
                    }
                    if (result.message) {
                        toast.success(result.message);
                        setTimeout(() => {
                            router.push("/");
                        }, 2000);
                    } else {
                        toast.error("Réponse invalide du serveur.");
                    }
                } catch (err: any) {
                    toast.error(err.message || "Erreur lors de la création du compte");
                }
            })();
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-2 py-5">
            <motion.div
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.6}}
                className="w-full max-w-3xl space-y-6"
            >
                {/* Image Section */}
                <motion.div
                    initial={{opacity: 0, x: -50}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.7}}
                >
                    <Image
                        priority
                        className="rounded-md mx-auto"
                        src="/svg/login/register.svg"
                        alt="Register Illustration"
                        width={300}
                        height={300}
                    />
                </motion.div>

                {/* Form Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center text-xl font-semibold">
                            Créer un compte
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit, (errors) => console.log(errors))}
                                  className="space-y-6">

                                {/* Personal Information */}
                                <PersonalInformationForm form={form} isPending={isPending}/>

                                {/* Address Information */}
                                <AddressForm form={form} isPending={isPending}/>

                                {/* Login Information */}
                                <LoginInformationForm form={form} isPending={isPending}/>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full"
                                >
                                    {isPending ? "En cours..." : "Créer mon compte"}
                                </Button>

                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
