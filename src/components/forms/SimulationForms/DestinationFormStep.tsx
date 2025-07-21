// path: src/components/forms/SimulationForms/DestinationFormStep.tsx

'use client';

import React, { ChangeEvent, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import CountrySelect from "@/components/forms/SimulationForms/CountrySelectForm";
import CitySelect from "@/components/forms/SimulationForms/CitySelectForm";
import AgencySelect from "@/components/forms/SimulationForms/AgencySelectForm";
import { getDestinationCountries, getCitiesByCountryId, getAgenciesByCityId } from "@/services/frontend-services/AddressService";
import { toast } from 'sonner';

interface DestinationFormStepProps {
    destination: { country: string; city: string; agencyName: string };
    setDestination: React.Dispatch<React.SetStateAction<{ country: string; city: string; agencyName: string }>>;
    options: any; // TODO: Define a proper type for options
    setOptions: React.Dispatch<React.SetStateAction<any>>; // TODO: Define a proper type for setOptions
    departure: { country: string; city: string; agencyName: string }; // Now receiving the full departure object
}

const DestinationFormStep: React.FC<DestinationFormStepProps> = ({
    destination,
    setDestination,
    options,
    setOptions,
    departure,
}) => {

    const handleDestinationChange = (field: keyof typeof destination, value: string) => {
        setDestination((prev) => ({ ...prev, [field]: value }));
    };

    //==================================
    //   FETCH DESTINATION COUNTRIES
    //   => only after user picks a departure
    //==================================
    useEffect(() => {
        if (!departure.agencyName) {
            // We haven't chosen a valid departure agency yet => clear it
            setOptions((prev: any) => ({ ...prev, destinationCountries: [] }));
            setDestination({ country: '', city: '', agencyName: '' });
            return;
        }

        // If the user has fully chosen a valid departure agency,
        // we fetch all possible other countries that have agencies
        (async () => {
            try {
                const data = await getDestinationCountries(departure.country);
                setOptions((prev: any) => ({ ...prev, destinationCountries: data }));
                // reset destination
                setDestination({ country: '', city: '', agencyName: '' });
            } catch (error) {
                console.error("Error fetching destination countries:", error);
            }
        })();
    }, [departure.agencyName, departure.country, setOptions, setDestination]);

    //==================================
    //   FETCH DESTINATION CITIES
    //==================================
    useEffect(() => {
        if (!destination.country) {
            setOptions((prev: any) => ({ ...prev, destinationCities: [] }));
            setDestination((prev) => ({ ...prev, city: '', agencyName: '' }));
            return;
        }

        (async () => {
            try {
                const countryId = Number(destination.country);
                const data = await getCitiesByCountryId(countryId); // Only cities with agencies
                setOptions((prev: any) => ({ ...prev, destinationCities: data }));
                setDestination((prev) => ({ ...prev, city: '', agencyName: '' }));
            } catch (error) {
                console.error("Error fetching destination cities:", error);
            }
        })();
    }, [destination.country, setOptions, setDestination]);

    //==================================
    //   FETCH DESTINATION AGENCIES
    //==================================
    useEffect(() => {
        if (!destination.city) {
            setOptions((prev: any) => ({ ...prev, destinationAgencies: [] }));
            setDestination((prev) => ({ ...prev, agencyName: '' }));
            return;
        }

        (async () => {
            try {
                const cityObj = options.destinationCities.find((c: any) => c.id === Number(destination.city));
                if (cityObj) {
                    const data = await getAgenciesByCityId(cityObj.id);
                    setOptions((prev: any) => ({ ...prev, destinationAgencies: data }));
                    setDestination((prev) => ({ ...prev, agencyName: '' }));
                }
            } catch (error) {
                console.error("Error fetching destination agencies:", error);
                toast.error("Failed to fetch destination agencies. Please try again.");
            }
        })();
    }, [destination.city, options.destinationCities, setOptions, setDestination]);

    return (
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CountrySelect
                    label="Pays de destination"
                    value={destination.country}
                    onChange={(e) => handleDestinationChange('country', e.target.value)}
                    countries={options.destinationCountries}
                    disabled={!departure.agencyName}
                    placeholder="Sélectionnez d’abord une agence de départ"
                />
                <CitySelect
                    label="Ville de destination"
                    value={destination.city}
                    onChange={(e) => handleDestinationChange('city', e.target.value)}
                    cities={options.destinationCities}
                    disabled={!destination.country}
                />
                <AgencySelect
                    label="Agence d'arrivée"
                    value={destination.agencyName}
                    onChange={(e) => handleDestinationChange('agencyName', e.target.value)}
                    agencies={options.destinationAgencies}
                    disabled={!destination.city}
                />
            </div>
        </CardContent>
    );
};

export default DestinationFormStep;
