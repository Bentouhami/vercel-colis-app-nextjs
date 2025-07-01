"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileDto } from "@/services/dtos";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import PersonalInformationForm from "@/components/auth/PersonalInformationForm";
import AddressForm from "@/components/address/AddressForm";
import { z } from "zod";
import {updateUserProfile} from "@/services/frontend-services/UserService";

// Define the validation schema for the edit profile form
const editProfileSchema = z.object({
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    birthDate: z.string().min(1, "La date de naissance est requise"),
    phoneNumber: z.string().min(9, "Le numéro de téléphone doit contenir au moins 9 caractères"),
    email: z.string().email("Adresse email invalide"),
    address: z.object({
        street: z.string().min(1, "La rue est requise"),
        complement: z.string().optional(),
        streetNumber: z.string().optional(),
        boxNumber: z.string().optional(),
        city: z.string().min(1, "La ville est requise"),
        country: z.string().min(1, "Le pays est requis")
    })
});

// Define the type for the form data
export type EditProfileFormType = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
    initialData?: ProfileDto | null;
}

export default function EditProfileForm({ initialData }: EditProfileFormProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // Setup react-hook-form
    const form = useForm<EditProfileFormType>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            firstName: initialData?.firstName || "",
            lastName: initialData?.lastName || "",
            birthDate: initialData?.birthDate ? new Date(initialData.birthDate).toISOString().split("T")[0] : "",
            phoneNumber: initialData?.phoneNumber || "",
            email: initialData?.email || "",
            address: {
                street: initialData?.userAddresses?.street || "",
                complement: initialData?.userAddresses?.complement || "",
                streetNumber: initialData?.userAddresses?.streetNumber || "",
                boxNumber: initialData?.userAddresses?.boxNumber || "",
                city: initialData?.userAddresses?.city?.name || "",
                country: initialData?.userAddresses?.city?.country?.name || ""
            }
        }
    });

    async function handleSubmit(formValues: EditProfileFormType) {
        startTransition(() => {
            (async () => {
                try {
                    // Convert birthDate string to Date object before passing to updateUserProfile
                    const updatedData = {
                        ...formValues,
                        birthDate: formValues.birthDate ? new Date(formValues.birthDate) : undefined
                    };

                    await updateUserProfile(updatedData);

                    toast.success("Profil mis à jour avec succès");

                    setTimeout(() => {
                        router.push("/client/profile");
                        router.refresh();
                    }, 1000);
                } catch (err: any) {
                    toast.error(err.message || "Erreur lors de la mise à jour du profil");
                }
            })();
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-2 py-5">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                {/* Image Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="w-full max-w-3xl space-y-6">
                        <Image
                            priority
                            className="rounded-md mx-auto"
                            src="/svg/login/profile.svg"
                            alt="Profile Illustration"
                            width={300}
                            height={300}
                        />
                    </div>
                </motion.div>

                {/* Form Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center text-xl font-semibold">
                            Modifier mon profil
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

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full"
                                >
                                    {isPending ? "En cours..." : "Mettre à jour mon profil"}
                                </Button>

                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
