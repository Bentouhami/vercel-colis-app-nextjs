"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Image from "next/image";

// Your front-end service

// Zod validations
import { registerUserFrontendSchema } from "@/utils/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterClientDto } from "@/services/dtos";

// ShadCN Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
} from "@/components/ui/form";

// Icons
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaPhone,
    FaCalendar,
    FaMapMarkerAlt,
    FaCity,
    FaGlobe,
    FaBuilding,
    FaHashtag,
} from "react-icons/fa";
import {registerUser} from "@/services/frontend-services/UserService";

export default function RegisterForm() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // react-hook-form with Zod
    const form = useForm({
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
                number: "",
                city: "",
                zipCode: "",
                country: "",
            },
        },
    });

    async function handleSubmit(data: any) {
        // Convert birthDate to Date
        const formattedData: RegisterClientDto = {
            ...data,
            birthDate: new Date(data.birthDate),
        }

        startTransition(() => {
            (async () => {
                try {
                    const result = await registerUser(formattedData);

                    // result might look like: { error: "..."} or {message: "..."}
                    if (!result) {
                        toast.error("Réponse inattendue du serveur. Veuillez réessayer.");
                        return;
                    }

                    if (result.error) {
                        // e.g. "User already exists and is verified. Please log in."
                        toast.error(result.error);
                        return;
                    }

                    if (result.message) {
                        // e.g. "User created successfully..."
                        toast.success(result.message);
                        // Optionally redirect
                        setTimeout(() => {
                            router.push("/");
                        }, 2000);
                    } else {
                        toast.error("Réponse invalide du serveur.");
                    }
                } catch (err: any) {
                    // We rethrew the error from the service, so let's handle here
                    toast.error(err.message || "Erreur lors de la création du compte");
                }
            })();
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-3xl space-y-6"
            >
                {/* Image Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
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
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                {/* Personal Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informations Personnelles</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* First Name */}
                                            <FormField
                                                control={form.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Prénom</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    {...field}
                                                                    disabled={isPending}
                                                                    placeholder="Prénom"
                                                                    className="pl-10 w-full"
                                                                />
                                                                <FaUser
                                                                    className="absolute top-3 right-3 text-muted-foreground"/>
                                                            </div>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Last Name */}
                                            <FormField
                                                control={form.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nom</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    {...field}
                                                                    disabled={isPending}
                                                                    placeholder="Nom"
                                                                    className="pl-10"
                                                                />
                                                                <FaUser className="absolute top-3 right-3 text-muted-foreground"/>
                                                            </div>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* BirthDate */}
                                        <FormField
                                            control={form.control}
                                            name="birthDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="mt-3 mb-0">Date de naissance</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                type="date"
                                                                className="pl-10"
                                                            />
                                                            <FaCalendar className="absolute top-3 right-3 text-muted-foreground" />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        {/* PhoneNumber */}
                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="mt-3 mb-0">Téléphone</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                placeholder="+32 473 ..."
                                                                className="pl-10"
                                                            />
                                                            <FaPhone className="absolute top-3 right-3 text-muted-foreground" />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Address Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Adresse</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Street */}
                                        <FormField
                                            control={form.control}
                                            name="address.street"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Rue</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                placeholder="Ex: Avenue Louise"
                                                                className="pl-10"
                                                            />
                                                            <FaMapMarkerAlt className="absolute top-3 right-3 text-muted-foreground" />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        {/* Number */}
                                        <FormField
                                            control={form.control}
                                            name="address.number"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="mt-3 mb-0">Numéro de rue</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                placeholder="Ex: 123"
                                                                className="pl-10"
                                                            />
                                                            <FaHashtag className="absolute top-3 right-3 text-muted-foreground" />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            {/* City */}
                                            <FormField
                                                control={form.control}
                                                name="address.city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="mt-3 mb-0">Ville</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    {...field}
                                                                    disabled={isPending}
                                                                    placeholder="Bruxelles"
                                                                    className="pl-10"
                                                                />
                                                                <FaCity className="absolute top-3 right-3 text-muted-foreground" />
                                                            </div>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {/* ZipCode */}
                                            <FormField
                                                control={form.control}
                                                name="address.zipCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="mt-3 mb-0">Code postal</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    {...field}
                                                                    disabled={isPending}
                                                                    placeholder="1000"
                                                                    className="pl-10"
                                                                />
                                                                <FaBuilding className="absolute top-3 right-3 text-muted-foreground" />
                                                            </div>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Country */}
                                        <FormField
                                            control={form.control}
                                            name="address.country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="mt-3 mb-0">Pays</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                placeholder="Belgique"
                                                                className="pl-10"
                                                            />
                                                            <FaGlobe className="absolute top-3 right-3 text-muted-foreground" />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Login Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informations de Connexion</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Email */}
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                placeholder="exemple@mail.com"
                                                                className="pl-10"
                                                            />
                                                            <FaEnvelope className="absolute top-3 right-3 text-muted-foreground" />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        {/* Password */}
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="mt-3 mb-0">Mot de passe</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                type="password"
                                                                placeholder="********"
                                                                className="pl-10"
                                                            />
                                                            <FaLock className="absolute top-3 right-3 text-muted-foreground" />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        {/* Confirm Password */}
                                        <FormField
                                            control={form.control}
                                            name="checkPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="mt-3 mb-0">Confirmez le mot de passe</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                type="password"
                                                                placeholder="********"
                                                                className="pl-10"
                                                            />
                                                            <FaLock className="absolute top-3 right-3 text-muted-foreground" />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Submit Button */}
                                <Button type="submit" disabled={isPending} className="w-full">
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
