"use client";

import {toast} from "sonner";
import {Controller, useForm} from "react-hook-form";
import * as z from "zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {PhoneInput} from "@/components/phone-input";
import React, {useEffect, useState} from "react";
import {createAgency, getAgencyById, updateAgency} from "@/services/frontend-services/AgencyService"; // Assurez-vous d'avoir cette fonction
import {AgencyResponseDto, CreateAgencyDto} from "@/services/dtos";
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import {fetchCities, fetchCountries} from "@/services/frontend-services/AddressService";

//
// Schéma de validation avec les champs d'adresse imbriqués
//
const formSchema = z.object({
    agencyName: z.string().min(1).max(50),
    location: z.string().optional(),
    phoneNumber: z.string(),
    email: z.string(),
    vatNumber: z.string().min(1),
    capacity: z.coerce.number().min(1),
    availableSlots: z.coerce.number().min(0),
    address: z.object({
        street: z.string().optional(),
        complement: z.string().optional(),
        streetNumber: z.string().optional(),
        boxNumber: z.string().optional(),
        city: z.object({
            id: z.number(),
            name: z.string(),
            country: z.object({
                id: z.number(),
                name: z.string(),
            }),
        }),

    }),
});

interface AgencyFormProps {
    agencyId?: number;
}

export default function AgencyForm({agencyId}: AgencyFormProps) {
    const [countries, setCountries] = useState<{ id: number; name: string }[]>([]);
    const [cities, setCities] = useState<{ id: number; name: string }[]>([]);

    const [agency, setAgency] = useState<AgencyResponseDto | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            agencyName: "",
            location: "",
            phoneNumber: "",
            email: "",
            vatNumber: "",
            capacity: 0,
            availableSlots: 0,
            address: {
                street: "",
                complement: "",
                streetNumber: "",
                boxNumber: "",
                city: {id: 0, name: "", country: {id: 0, name: ""}},

            },
        },
    });
    const selectedCountryId = form.watch("address.city.country.id");

    useEffect(() => {
        if (selectedCountryId && selectedCountryId !== 0) {
            fetchCities(selectedCountryId).then(setCities).catch(console.error);
            // Only reset city if you really want to clear it out each time
            form.setValue("address.city.id", 0);
            form.setValue("address.city.name", "");
            // Keep the country ID + name from the user’s selection
        }
    }, [selectedCountryId, form]);


    // 1. Récupérer l'agence par ID (si mise à jour)
    useEffect(() => {
        if (!agencyId) return;

        (async () => {
            try {
                const agencyResponse = await getAgencyById(agencyId);
                console.log("✅ Agency fetched successfully:", agencyResponse);

                if (agencyResponse instanceof Error) {
                    toast.error("Error fetching agency: " + agencyResponse.message);
                } else {
                    setAgency(agencyResponse);
                }
            } catch (error) {
                console.error("Error fetching agency:", error);
                toast.error("Failed to fetch agency data.");
            }
        })();
    }, [agencyId]);

    // 2. Mettre à jour le formulaire quand les données de l'agence arrivent
    useEffect(() => {
        if (agency) {
            form.reset({
                agencyName: agency.name || "",
                location: agency.location || "",
                phoneNumber: agency.phoneNumber || "",
                email: agency.email || "",
                vatNumber: "", // Mettez ici la valeur réelle si disponible
                capacity: agency.capacity || 0,
                availableSlots: agency.availableSlots || 0,
                address: {
                    street: agency.address?.street || "",
                    complement: agency.address?.complement || "",
                    streetNumber: agency.address?.streetNumber || "",
                    boxNumber: agency.address?.boxNumber || "",
                    city: {
                        id: agency.address?.city.id || 0,
                        name: agency.address?.city.name || "",
                        country: {
                            id: agency.address?.city.country.id || 0,
                            name: agency.address?.city.country.name || "",
                        },
                    },

                },
            });
        }
    }, [agency, form]);

    // 3. Récupérer la liste des pays
    useEffect(() => {
        fetchCountries()
            .then(setCountries)
            .catch(console.error);
    }, []);

    // 4. Récupérer la liste des villes quand le pays change
    useEffect(() => {
        // Nous utilisons setValue pour récupérer l'ID du pays dans address.country.id
        const countryId = (form.getValues("address.city.country") as { id: number }).id;
        if (countryId !== 0) {
            fetchCities(countryId)
                .then(setCities)
                .catch(console.error);
            // Réinitialiser la ville sélectionnée
            form.setValue("address.city", {id: 0, name: "", country: {id: 0, name: ""}});
        }
    }, [form]);

    // 5. Handler de soumission
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Transformation du formulaire pour correspondre au type AgencyResponseDto
        const newAgency: CreateAgencyDto = {
            id: agency?.id || 0, // ou ne pas inclure 'id' si c'est une création
            name: values.agencyName,
            location: values.location || "",
            phoneNumber: values.phoneNumber,
            email: values.email,
            vatNumber: values.vatNumber,
            capacity: values.capacity,
            availableSlots: values.availableSlots,
            address: {
                street: values.address.street!,
                complement: values.address.complement,
                streetNumber: values.address.streetNumber,
                boxNumber: values.address.boxNumber,
                city: values.address.city,
            },
        };

        console.log("🚀 Submitting form with values:", newAgency);
        try {
            if (agencyId) {
                // Call update function if agencyId exists
                const agencyResponse = await updateAgency(newAgency); // Assuming you have updateAgency defined
                toast.success("Agence mise à jour avec succès !");
                console.log("Agency updated:", agencyResponse);
            } else {
                // Call create function if no agencyId
                const agencyResponse = await createAgency(newAgency);
                toast.success("Agence créée avec succès !");
                console.log("Agency created:", agencyResponse);
            }
        } catch (error) {
            toast.error("Erreur lors de la création de l'agence");
            console.error("Creation error:", error);
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                {/* Informations de base de l'agence */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="agencyName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Agence</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Agence de Mons" {...field} />
                                    </FormControl>
                                    <FormDescription>Nom de l&#39;agence.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Près de la gare de Mons..." {...field} />
                                    </FormControl>
                                    <FormDescription>Localisation de l&#39;agence.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Téléphone & Email */}
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Numéro de téléphone</FormLabel>
                            <FormControl>
                                <PhoneInput placeholder="+32456565656" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="agency.mons@mail.be" type="email" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* TVA, Capacité et Places disponibles */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="vatNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Numéro de TVA</FormLabel>
                                    <FormControl>
                                        <Input placeholder="BE0123456789" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-3">
                        <FormField
                            control={form.control}
                            name="capacity"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Capacité</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-3">
                        <FormField
                            control={form.control}
                            name="availableSlots"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Places disponibles</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Champs d'adresse */}
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="address.street"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Rue</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nom de la rue" {...field} />
                                </FormControl>
                                <FormDescription>Indiquez la rue de l&#39;agence.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="address.streetNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Numéro</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Numéro de rue" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address.boxNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Boîte</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Boîte" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="address.complement"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Complément</FormLabel>
                                <FormControl>
                                    <Input placeholder="Complément d'adresse" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Sélection du Pays et de la Ville */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <Controller
                            name="address.city.country.id"
                            control={form.control}
                            render={({ field }) => {
                                // This ensures the correct item is shown as selected.
                                // If your CountrySelect uses country.name as the option value, you'd do the same approach
                                // as the city solution (ID <-> name transformation).
                                // But if your CountrySelect returns an ID, you can parse it directly as shown below.

                                return (
                                    <CountrySelect
                                        label="Pays"
                                        value={field.value ? field.value.toString() : ""}
                                        onChange={(e) => {
                                            const id = parseInt(e.target.value, 10);
                                            field.onChange(id);

                                            // Find the country object by ID to get its name
                                            const selectedCountry = countries.find((c) => c.id === id);

                                            // Manually set the country.name so the final object is not empty
                                            if (selectedCountry) {
                                                form.setValue("address.city.country.name", selectedCountry.name);
                                            } else {
                                                // If user selects nothing or an invalid ID
                                                form.setValue("address.city.country.name", "");
                                            }
                                        }}
                                        countries={countries}
                                    />
                                );
                            }}
                        />

                    </div>
                    <div className="col-span-6">
                        <Controller
                            name="address.city.id"
                            control={form.control}
                            render={({ field }) => {
                                // 1. Convert current city ID → city name
                                const selectedCity = cities.find((c) => c.id === field.value);
                                const selectedCityName = selectedCity ? selectedCity.name : "";

                                return (
                                    <CitySelect
                                        label="Ville"
                                        // The <select> value is the city name, not the ID
                                        value={selectedCityName}
                                        onChange={(e) => {
                                            const cityName = e.target.value;
                                            // 2. Convert chosen city name → ID
                                            const matchedCity = cities.find((c) => c.name === cityName);
                                            if (matchedCity) {
                                                // Update the form's city ID
                                                field.onChange(matchedCity.id);
                                                // Optionally also update city.name if you store that separately
                                                form.setValue("address.city.name", matchedCity.name);
                                            } else {
                                                // Reset if no match or empty selection
                                                field.onChange(0);
                                                form.setValue("address.city.name", "");
                                            }
                                        }}
                                        cities={cities}
                                    />
                                );
                            }}
                        />


                    </div>
                </div>

                <Button type="submit" className="mt-4">
                    {agencyId ? "Mettre à jour l'agence" : "Créer une agence"}
                </Button>
            </form>
        </Form>
    );
}
