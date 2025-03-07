// path: src/components/forms/admins/AgencyForm.tsx
"use client"
import {toast} from "sonner";
import {useForm} from "react-hook-form";
import * as z from "zod"

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {zodResolver} from "@hookform/resolvers/zod";
import {PhoneInput} from "@/components/phone-input";
import React, {useEffect, useState, useTransition} from "react";
import {getAgencyById} from "@/services/frontend-services/AgencyService";
import {AgencyDto} from "@/services/dtos";
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import {useSession} from "next-auth/react";
import {fetchCities, fetchCountries} from "@/services/frontend-services/AddressService";
import {checkAuthStatus} from "@/lib/auth";
// import NewLocationSelector from "@/components/address/NewLocationSelector";

const formSchema = z.object({
    agencyName: z.string().min(1).min(1).max(50),
    location: z.string().min(1).optional(),
    phoneNumber: z.string(),
    email: z.string(),
    vatNumber: z.string().min(1),
    capacity: z.number().min(1),
    availableSlots: z.number().min(0)
});

const countrySchema = z.string().min(1);
const citySchema = z.string().min(1);

type Country = z.infer<typeof countrySchema>;
type City = z.infer<typeof citySchema>;

interface AgencyFormProps {
    agencyId?: number;
}

const AgencyForm = ({agencyId}: AgencyFormProps) => {

    const [country, setCountry] = useState<Country>('');
    const [city, setCity] = useState<City>('');
    const [cities, setCities] = useState<City[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);
    const {data: session, status} = useSession();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const [agency, setAgency] = useState<AgencyDto>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    });

    useEffect(() => {
        setIsLoading(true);
        const checkAuth = async () => {
            const authResult = await checkAuthStatus(false);
            setIsAuthenticated(authResult.isAuthenticated);
            setUserId(authResult.userId || null);
        };
        checkAuth();
    }, []);

    /**
     * Fetch countries and set them in the state
     *
     */
    useEffect(() => {
        fetchCountries().then(data => setCountries(data)).catch(console.error);
    }, []);

    /**
     * Fetch cities when country changes
     */
    useEffect(() => {
        if (country) {
            fetchCities(country).then(data => setCities(data)).catch(console.error);
            setCity('');
        }
    }, [country]);

    useEffect(() => {
        (async () => {
            if (agencyId) {
                const agencyResponse = await getAgencyById(agencyId);
                if (agencyResponse instanceof Error) {
                    toast("Error fetching agency by id: " + agencyResponse.message);
                } else {
                    setAgency(agencyResponse);
                }
            }
        })();
    }, [agencyId]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
            );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    function onChangeCountry(e: React.ChangeEvent<HTMLSelectElement>) {
        setCountry(e.target.value);
    }

    function onChangeCity(e: React.ChangeEvent<HTMLSelectElement>) {
        setCity(e.target.value);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                <div className="grid grid-cols-12 gap-4">

                    <div className="col-span-6">

                        <FormField
                            control={form.control}
                            name="agencyName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Agence</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Agence de Mons"

                                            type="text"
                                            {...field} />
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
                                        <Input
                                            placeholder="Prés la gare de Mons..."

                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>La localisation de l&#39;agence.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                </div>
                {/* Phone section */}
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({field}) => (
                        <FormItem className="flex flex-col items-start">
                            <FormLabel>Numéro de téléphone de l&#39;agence</FormLabel>
                            <FormControl className="w-full">
                                <PhoneInput
                                    placeholder="+32456565656"
                                    {...field}
                                    defaultCountry="BE"
                                />
                            </FormControl>
                            <FormDescription>Enter le numéro de téléphone de l&#39;agence.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Email section */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email de l&#39;agence</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="agnecy.mons@mail.be"

                                    type="email"
                                    {...field} />
                            </FormControl>
                            <FormDescription>Enter l&#39;email de l&#39;agence.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* VAT section */}
                <FormField
                    control={form.control}
                    name="vatNumber"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Numéro de TVA</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=""

                                    type="text"
                                    {...field} />
                            </FormControl>
                            <FormDescription>Numéro de TVA de l&#39;agence.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Stock section */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="capacity"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Capacity</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""

                                            type="number"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>Capacité de stock pour l&#39;agence.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-6">

                        <FormField
                            control={form.control}
                            name="availableSlots"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Disponibilité </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""

                                            type="number"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>Nombre de places disponibles pour l&#39;agence.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Country section */}

                    <div className="col-span-6">
                        <CountrySelect
                            label="Pays"
                            value={country}
                            onChange={onChangeCountry}
                            countries={countries}
                            disabled={isPending}
                            placeholder="Sélectionnez un pays avant de continuer"
                        />
                    </div>
                    <div className="col-span-6">

                        <CitySelect
                            label="Ville"
                            value={city}
                            onChange={onChangeCity}
                            cities={cities}
                            disabled={!country}
                            placeholder="Sélectionnez une ville avant de continuer"
                        />
                    </div>
                    {/*<CountryDropdown />*/}
                    {/*<NewLocationSelector />*/}

                </div>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
};

export default AgencyForm;