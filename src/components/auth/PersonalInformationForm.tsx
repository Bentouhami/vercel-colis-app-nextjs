// path: src/components/auth/PersonalInformationForm.tsx

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaCalendar, FaPhone, FaUser } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa6";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/phone-input";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import AgencyComboboxSelector from "@/components/forms/admins/AgencyComboboxSelector";

interface PersonalInformationFormProps<TForm extends FieldValues> {
    form: UseFormReturn<TForm>;
    isPending: boolean;
    role?: string;
    agencies?: { id: number; name: string }[];
    includeEmail?: boolean; // show email input in this step (used for admin create)
}

export default function PersonalInformationForm<TForm extends FieldValues>({ form, isPending, includeEmail = false, role }: PersonalInformationFormProps<TForm>) {
    const { control } = form;
    const requiresAgency = role === 'AGENCY_ADMIN' || role === 'ACCOUNTANT';

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
                            <FormMessage />
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
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                {includeEmail && (
                    <div className="mt-3">
                        {/* Email */}
                        <FormField control={control} name={"email" as Path<TForm>} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email <span className="text-red-500 ml-1">*</span></FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input {...field} disabled={isPending} placeholder="exemple@mail.com" className="pl-3" />
                                        <FaEnvelope className="absolute top-3 right-3 text-muted-foreground" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                )}

                {requiresAgency && (
                    <div className="mt-3">
                        <AgencyComboboxSelector form={form} disabled={isPending} />
                    </div>
                )}

                <div className="mt-3 flex flex-col md:flex-row gap-4">
                    {/* BirthDate */}
                    <FormField
                        control={control}
                        name={"birthDate" as Path<TForm>}
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/2">
                                <FormLabel>Date de naissance <span className="text-red-500 ml-1">*</span></FormLabel>
                                <FormControl>
                                    <DatePicker
                                        field={{
                                            ...field,
                                            value: field.value ? new Date(field.value) : undefined,
                                            onChange: (date: Date | undefined) => {
                                                field.onChange(date ? date.toISOString().split("T")[0] : "");
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
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
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
            </CardContent>
        </Card>
    );
}
