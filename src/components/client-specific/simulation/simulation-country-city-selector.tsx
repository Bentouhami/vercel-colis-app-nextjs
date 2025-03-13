// path: src/components/client-specific/simulation/simulation-country-city-selector.tsx

"use client";

import {useEffect, useState} from "react";
import {Check, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Label} from "@/components/ui/label";
import {UseFormReturn} from "react-hook-form";
import {RegisterUserFrontendFormType} from "@/utils/validationSchema";
import {getCitiesPerCountry} from "@/services/frontend-services/city/CityService";
import {getAllCountries} from "@/services/frontend-services/country/CountryService";
import {CityDto} from "@/services/dtos/cities/CityDto";

interface CountryCitySelectorProps {
    form: UseFormReturn<RegisterUserFrontendFormType>;
}

export default function SimulationCountryCitySelector({form}: CountryCitySelectorProps) {
    const {setValue, watch} = form;
    const [countries, setCountries] = useState<any[]>([]);
    const [cities, setCities] = useState<CityDto[]>([]);
    const [openCountry, setOpenCountry] = useState(false);
    const [openCity, setOpenCity] = useState(false);

    const selectedCountry = watch("address.country");
    const selectedCity = watch("address.city");

    // Charger la liste des pays au montage du composant
    useEffect(() => {
        (async () => {
            try {

                const countries = await getAllCountries()
                if (countries) {
                    setCountries(countries);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des pays :", error);
            }
        })();
    }, []);

    // Charger les villes lorsque le pays sélectionné change
    useEffect(() => {
        (async () => {
            if (selectedCountry) {
                console.log("selectedCountry in useEffect in path: src/components/dashboard/forms/RegisterUserFrontendForm.tsx is :", selectedCountry);
                // Récupérer l'id du pays en fonction du nom sélectionné
                const countryId = countries.find(c => c.name === selectedCountry)?.id;
                if (countryId) {
                    console.log("countryId in useEffect in path: src/components/dashboard/forms/RegisterUserFrontendForm.tsx is :", countryId);
                    try {
                        const cities = await getCitiesPerCountry(Number(countryId));
                        if (cities) {
                            setCities(cities);
                            setValue("address.city", "");
                        }
                    } catch (error) {
                        console.error("Erreur lors de la récupération des villes :", error);
                    }
                }
            } else {
                setCities([]);
            }
        })();
    }, [selectedCountry, countries, setValue]);

    return (
        <div className="space-y-4">
            {/* Sélection du pays */}
            <div>
                <Label htmlFor="country">
                    Pays<span className="text-red-500 ml-1">*</span>
                </Label>
                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                            {selectedCountry || "Sélectionner un pays"}
                            <ChevronsUpDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Rechercher un pays..."/>
                            <CommandList>
                                <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-y-auto">
                                    {countries.map((country) => (
                                        <CommandItem
                                            key={country.id}
                                            value={country.name}
                                            onSelect={() => {
                                                setValue("address.country", country.name);
                                                setOpenCountry(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedCountry === country.name ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {country.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Sélection de la ville */}
            <div>
                <Label htmlFor="city">
                    Ville<span className="text-red-500 ml-1">*</span>
                </Label>
                <Popover open={openCity} onOpenChange={setOpenCity}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-between"
                            disabled={!selectedCountry}
                        >
                            {selectedCity || "Sélectionner une ville"}
                            <ChevronsUpDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Rechercher une ville..."/>
                            <CommandList>
                                <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-y-auto">
                                    {cities.map((city) => (
                                        <CommandItem
                                            key={city.id}
                                            value={city.name}
                                            onSelect={() => {
                                                setValue("address.city", city.name);
                                                setOpenCity(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedCity === city.name ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {city.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
