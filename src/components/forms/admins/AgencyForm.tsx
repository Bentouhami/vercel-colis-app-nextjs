"use client";

import {toast} from "sonner";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {PhoneInput} from "@/components/phone-input";
import React, {useEffect, useState} from "react";
import {getAgencyById} from "@/services/frontend-services/AgencyService";
import {AgencyResponseDto} from "@/services/dtos";
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import {fetchCities, fetchCountries} from "@/services/frontend-services/AddressService";

//
// Zod validation schema
//
const formSchema = z.object({
    agencyName: z.string().min(1).max(50),
    location: z.string().optional(),
    phoneNumber: z.string(),
    email: z.string(),
    vatNumber: z.string().min(1),
    capacity: z.number().min(1),
    availableSlots: z.number().min(0)
});

interface AgencyFormProps {
    agencyId?: number;
}

export default function AgencyForm({agencyId}: AgencyFormProps) {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [country, setCountry] = useState<number | null>(null);
    const [city, setCity] = useState<string>("");
    const [agency, setAgency] = useState<AgencyResponseDto | null>(null);

    //
    // Create a single `form` object from `useForm`
    //
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            agencyName: "",
            location: "",
            phoneNumber: "",
            email: "",
            vatNumber: "",
            capacity: 0,
            availableSlots: 0
        }
    });

    const {
        control,     // needed for <FormField control={control} .../>
        handleSubmit,
        reset
    } = form;

    //
    // 1. Fetch Agency by ID
    //
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

    //
    // 2. Update form inputs when the agency data arrives
    //
    useEffect(() => {
        if (agency) {
            reset({
                agencyName: agency.name || "",
                location: agency.location || "",
                phoneNumber: agency.phoneNumber || "",
                email: agency.email || "",
                vatNumber: "", // If you have a real VAT field in DB, set it here
                capacity: agency.capacity || 0,
                availableSlots: agency.availableSlots || 0
            });

            // Prefill the country & city from the agency address
            if (agency.address) {
                setCountry(agency.address.city.country.id);
                setCity(agency.address.city.name);
            }
        }
    }, [agency, reset]);

    //
    // 3. Fetch Countries once
    //
    useEffect(() => {
        fetchCountries()
            .then(setCountries)
            .catch(console.error);
    }, []);

    //
    // 4. Fetch Cities when country changes
    //
    useEffect(() => {
        if (country !== null) {
            fetchCities(country)
                .then(setCities)
                .catch(console.error);
            setCity("");
        }
    }, [country]);

    //
    // 5. Submit Handler
    //
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("🚀 Submitting form with values:", values);
        toast.success("Agency updated successfully!");
        // TODO: Actually send the updated data to your server (PUT or PATCH request)
    }

    //
    // 6. Render the form
    //
    return (
        // Pass entire `form` object to <Form> to fix TS2740
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                {/* Agency Name & Location */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={control}
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
                            control={control}
                            name="location"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Près de la gare de Mons..." {...field} />
                                    </FormControl>
                                    <FormDescription>La localisation de l&#39;agence.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Phone & Email */}
                <FormField
                    control={control}
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
                    control={control}
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

                {/* VAT Number, Capacity, Available Slots */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={control}
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
                            control={control}
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
                            control={control}
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

                {/* Country & City */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <CountrySelect
                            label="Pays"
                            value={country?.toString() || ""}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                setCountry(isNaN(val) ? null : val);
                            }}
                            countries={countries}
                        />
                    </div>
                    <div className="col-span-6">
                        <CitySelect
                            label="Ville"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            cities={cities}
                        />
                    </div>
                </div>

                <Button type="submit" className="mt-4">
                    Mettre à jour
                </Button>
            </form>
        </Form>
    );
}
