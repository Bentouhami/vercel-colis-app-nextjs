// path: src/components/address/AddressForm.tsx

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaBuilding, FaHashtag, FaMapMarkerAlt } from "react-icons/fa";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface AddressFields {
    address: {
        street: string;
        complement?: string;
        streetNumber?: string;
        boxNumber?: string;
        city: string;
        country: string;
    };
}
import SimulationCountryCitySelector from "@/components/client-specific/simulation/simulation-country-city-selector";

interface AddressFormProps<TForm extends FieldValues> {
    form: UseFormReturn<TForm>;
    isPending: boolean;
}

export default function AddressForm<TForm extends FieldValues>({ form, isPending }: AddressFormProps<TForm>) {
    const { control } = form;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Adresse</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/*
          This handles "address.country" & "address.city"
          Make sure it sets form values for city and country:
            form.setValue("address.city", ...)
            form.setValue("address.country", ...)
        */}
                <SimulationCountryCitySelector form={form} />

                {/* Street (required) */}
                <FormField
                    control={control}
                    name={"address.street" as Path<TForm>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Rue <span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="Ex: Avenue Louise"
                                        className="pl-3"
                                    />
                                    <FaMapMarkerAlt className="absolute top-3 right-3 text-muted-foreground" />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* streetNumber & boxNumber are optional */}
                <div className="flex flex-col md:flex-row gap-4">
                    <FormField
                        control={control}
                        name={"address.streetNumber" as Path<TForm>}
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/2">
                                <FormLabel>Numéro de rue</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="Ex: 123"
                                            className="pl-3"
                                        />
                                        <FaHashtag className="absolute top-3 right-3 text-muted-foreground" />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={"address.boxNumber" as Path<TForm>}
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/2">
                                <FormLabel>Boîte</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="Ex: Boîte 2B"
                                            className="pl-3"
                                        />
                                        <FaBuilding className="absolute top-3 right-3 text-muted-foreground" />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* complement is also optional */}
                <FormField
                    control={control}
                    name={"address.complement" as Path<TForm>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Complément</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="Ex: Appartement, étage, etc."
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}
