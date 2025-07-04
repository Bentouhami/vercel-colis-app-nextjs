// path: src/components/auth/PersonalInformationForm.tsx

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaCalendar, FaPhone, FaUser } from "react-icons/fa";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/phone-input";
import { UseFormReturn, Controller, FieldValues, Path } from "react-hook-form";

interface PersonalInfoFields {
    firstName: string;
    lastName: string;
    birthDate: string;
    phoneNumber: string;
    email: string;
}
import { DatePicker } from "@/components/ui/date-picker";

interface PersonalInformationFormProps<TForm extends FieldValues> {
    form: UseFormReturn<TForm>;
    isPending: boolean;
    role?: string;
    agencies?: { id: number; name: string }[];
}


export default function PersonalInformationForm<TForm extends FieldValues>({ form, isPending }: PersonalInformationFormProps<TForm>) {
    const { control } = form;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    {/* First Name */}
                    <FormField control={control} name={"firstName" as Path<TForm>} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prénom <span className="text-red-500 ml-1">*</span></FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input {...field} disabled={isPending} placeholder="Prénom" className="pl-3 w-full" />
                                    <FaUser className="absolute top-3 right-3 text-muted-foreground" />
                                </div>
                            </FormControl>
                        </FormItem>
                    )} />

                    {/* Last Name */}
                    <FormField control={control} name={"lastName" as Path<TForm>} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom <span className="text-red-500 ml-1">*</span></FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input {...field} disabled={isPending} placeholder="Nom" className="pl-3" />
                                    <FaUser className="absolute top-3 right-3 text-muted-foreground" />
                                </div>
                            </FormControl>
                        </FormItem>
                    )} />
                </div>

                <div className="mt-3 flex flex-col md:flex-row gap-4">
                    {/* BirthDate */}
                    <Controller
                        control={control}
                        name={"birthDate" as Path<TForm>}
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/2">
                                <FormLabel>Date de naissance <span className="text-red-500 ml-1">*</span></FormLabel>
                                <FormControl>

                                    <DatePicker
                                        field={{
                                            ...field,
                                            value: field.value ? new Date(field.value) : undefined, // Convertir string en Date
                                            onChange: (date: Date | undefined) => {
                                                field.onChange(date ? date.toISOString().split("T")[0] : ""); // Stocker en string
                                            }
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />


                    {/* PhoneNumber */}
                    <FormField control={control} name={"phoneNumber" as Path<TForm>} render={({ field }) => (
                        <FormItem className="w-full md:w-1/2">
                            <FormLabel>Téléphone <span className="text-red-500 ml-1">*</span></FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <PhoneInput {...field} disabled={isPending} defaultCountry="BE" />
                                    <FaPhone className="absolute top-3 right-3 text-muted-foreground" />
                                </div>
                            </FormControl>
                        </FormItem>
                    )} />


                </div>
            </CardContent>
        </Card>
    );
}
