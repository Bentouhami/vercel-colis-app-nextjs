// path: src/components/auth/LoginInformationForm.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { UseFormReturn } from "react-hook-form";
import { RegisterClientDto } from "@/services/dtos";
import {RegisterUserFrontendFormType} from "@/utils/validationSchema";
import {cn} from "@/lib/utils";

interface LoginInformationFormProps {
    form: UseFormReturn<RegisterUserFrontendFormType>;
    isPending: boolean;
}

export default function LoginInformationForm({
                                                 form,
                                                 isPending
                                             }: LoginInformationFormProps) {
    const { control } = form;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Informations de Connexion</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Email */}
                <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="mt-3 mb-0">
                            <FormLabel >Email <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="exemple@mail.com"
                                        className="pl-3"
                                    />
                                    <FaEnvelope className="absolute top-3 right-3 text-muted-foreground" />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Password */}
                <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="mt-3">
                            <FormLabel>Mot de passe <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        type="password"
                                        placeholder="********"
                                        className="pl-3"
                                    />
                                    <FaLock className="absolute top-3 right-3 text-muted-foreground" />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Confirm Password */}
                <FormField
                    control={control}
                    name="checkPassword"
                    render={({ field }) => (
                        <FormItem className="mt-3">
                            <FormLabel>
                                Confirmez le mot de passe <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        type="password"
                                        placeholder="********"
                                        className="pl-3"
                                    />
                                    <FaLock className="absolute top-3 right-3 text-muted-foreground" />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}
